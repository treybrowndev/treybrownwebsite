const canvas = document.getElementById('glCanvas');
const sectorLabels = document.getElementById('sectorLabels');
const labelContext = sectorLabels?.getContext('2d');
const gl = canvas?.getContext('webgl', { antialias: true });

if (!canvas || !sectorLabels || !labelContext || !gl) {
  const message = document.getElementById('webglMessage');
  if (message) message.hidden = false;
  throw new Error('Project Pellucid requires WebGL support.');
}

const lengthInput = document.getElementById('lengthControl');
const wingInput = document.getElementById('wingControl');
const propulsionInput = document.getElementById('propulsionControl');
const directionInput = document.getElementById('directionControl');
const lengthValue = document.getElementById('lengthValue');
const wingValue = document.getElementById('wingValue');
const propulsionValue = document.getElementById('propulsionValue');
const directionValue = document.getElementById('directionValue');

const controls = {
  length: Number(lengthInput.value),
  wingSpan: Number(wingInput.value),
  propulsion: Number(propulsionInput.value),
  direction: Number(directionInput.value)
};
const sectorStatusList = document.getElementById('sectorStatusList');
const sectorStatuses = Array(12).fill('Fully Operational');
const sectorStatusOptions = ['Fully Operational', 'Breach', 'Offline'];

function renderSectorStatuses() {
  sectorStatusList.replaceChildren();

  sectorStatuses.forEach((status, index) => {
    const label = document.createElement('label');
    const title = document.createElement('span');
    const select = document.createElement('select');
    title.textContent = `Sector ${index + 1}`;
    select.setAttribute('aria-label', `Status for sector ${index + 1}`);

    sectorStatusOptions.forEach((optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue;
      option.selected = optionValue === status;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      sectorStatuses[index] = select.value;
    });

    label.append(title, select);
    sectorStatusList.appendChild(label);
  });
}

renderSectorStatuses();

const vertexShaderSource = `
  attribute vec3 aPosition;
  uniform mat4 uMatrix;
  void main() {
    gl_Position = uMatrix * vec4(aPosition, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec3 uColor;
  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || 'Project Pellucid shader compilation failed.');
  }

  return shader;
}

function createProgram() {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Project Pellucid program linking failed.');
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

function multiply(a, b) {
  const out = new Float32Array(16);

  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[row] * b[col * 4] +
        a[4 + row] * b[col * 4 + 1] +
        a[8 + row] * b[col * 4 + 2] +
        a[12 + row] * b[col * 4 + 3];
    }
  }

  return out;
}

function translation(x, y, z) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]);
}

function perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);

  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, (2 * far * near) * nf, 0
  ]);
}

function normalize(vector) {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function lookAt(eye, center, up) {
  const z = normalize(subtract(eye, center));
  const x = normalize(cross(up, z));
  const y = cross(z, x);

  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

function rotationY(radians) {
  const c = Math.cos(radians);
  const s = Math.sin(radians);

  return new Float32Array([
    c, 0, s, 0,
    0, 1, 0, 0,
    -s, 0, c, 0,
    0, 0, 0, 1
  ]);
}

function createRocketGeometry(config) {
  const segments = 12;
  const lines = [];
  const radius = 0.42;
  const bodyLength = config.length;
  const coneLength = config.length * 0.7;
  const wingHalf = config.wingSpan * 0.45;

  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const x0 = Math.cos(a0) * radius;
    const y0 = Math.sin(a0) * radius;
    const x1 = Math.cos(a1) * radius;
    const y1 = Math.sin(a1) * radius;
    const p0 = [x0, y0, -bodyLength / 2];
    const p1 = [x0, y0, bodyLength / 2];
    const p2 = [x1, y1, -bodyLength / 2];
    const p3 = [x1, y1, bodyLength / 2];
    const apex = [0, 0, bodyLength / 2 + coneLength];

    lines.push(...p0, ...p1, ...p0, ...p2, ...p2, ...p3, ...p1, ...apex, ...p3, ...apex);
  }

  const finRootZ = -bodyLength * 0.15;
  const finRearZ = -bodyLength * 0.48;
  const leftFin = [[-radius, 0.18, finRootZ], [-wingHalf, 0.18, finRearZ], [-radius, 0.18, finRearZ]];
  const rightFin = [[radius, 0.18, finRootZ], [wingHalf, 0.18, finRearZ], [radius, 0.18, finRearZ]];

  [leftFin, rightFin].forEach(([root, tip, rear]) => {
    lines.push(...root, ...tip, ...tip, ...rear, ...rear, ...root);
  });

  const capRings = [
    { radius, z: -bodyLength / 2 },
    { radius: 0.3, z: -bodyLength / 2 - 0.12 },
    { radius: 0.16, z: -bodyLength / 2 - 0.24 }
  ];

  for (let ringIndex = 0; ringIndex < capRings.length; ringIndex++) {
    const ring = capRings[ringIndex];
    const nextRing = capRings[ringIndex + 1];

    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      const current0 = [Math.cos(a0) * ring.radius, Math.sin(a0) * ring.radius, ring.z];
      const current1 = [Math.cos(a1) * ring.radius, Math.sin(a1) * ring.radius, ring.z];
      lines.push(...current0, ...current1);

      if (nextRing) {
        const next = [Math.cos(a0) * nextRing.radius, Math.sin(a0) * nextRing.radius, nextRing.z];
        lines.push(...current0, ...next);
      }
    }
  }

  return new Float32Array(lines);
}

function createFireGeometry(config) {
  const segments = 12;
  const points = [];
  const baseZ = -config.length / 2 - 0.05;
  const baseRadius = 0.2;
  const flameLength = 0.55 + config.propulsion * 0.12;

  for (let i = 0; i < segments; i++) {
    const t0 = (i / segments) * Math.PI * 2;
    const t1 = ((i + 1) / segments) * Math.PI * 2;
    const tipAngle = (t0 + t1) / 2;
    const nextTipAngle = t1 + Math.PI / segments;
    const tipRadius = baseRadius + 0.08 + (i % 2) * 0.06;
    const nextTipRadius = baseRadius + 0.08 + ((i + 1) % 2) * 0.06;
    const p0 = [Math.cos(t0) * baseRadius, Math.sin(t0) * baseRadius, baseZ];
    const p1 = [Math.cos(t1) * baseRadius, Math.sin(t1) * baseRadius, baseZ];
    const p2 = [Math.cos(tipAngle) * tipRadius, Math.sin(tipAngle) * tipRadius, baseZ - flameLength];
    const p3 = [Math.cos(nextTipAngle) * nextTipRadius, Math.sin(nextTipAngle) * nextTipRadius, p2[2]];

    points.push(...p0, ...p1, ...p0, ...p2, ...p2, ...p1, ...p2, ...p3);
  }

  return new Float32Array(points);
}

const program = createProgram();
const positionLocation = gl.getAttribLocation(program, 'aPosition');
const matrixLocation = gl.getUniformLocation(program, 'uMatrix');
const colorLocation = gl.getUniformLocation(program, 'uColor');
const rocketBuffer = gl.createBuffer();
const fireBuffer = gl.createBuffer();
let rocketData = createRocketGeometry(controls);
let fireData = createFireGeometry(controls);

function refreshGeometry() {
  rocketData = createRocketGeometry(controls);
  fireData = createFireGeometry(controls);
  gl.bindBuffer(gl.ARRAY_BUFFER, rocketBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, rocketData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, fireBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, fireData, gl.STATIC_DRAW);
}

function updateControlLabels() {
  lengthValue.textContent = controls.length.toFixed(1);
  wingValue.textContent = controls.wingSpan.toFixed(1);
  propulsionValue.textContent = controls.propulsion.toFixed(1);
  directionValue.textContent = `${Math.round(controls.direction)}°`;
  refreshGeometry();
}

[
  ['length', lengthInput],
  ['wingSpan', wingInput],
  ['propulsion', propulsionInput],
  ['direction', directionInput]
].forEach(([key, input]) => {
  input.addEventListener('input', () => {
    controls[key] = Number(input.value);
    updateControlLabels();
  });
});

refreshGeometry();
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0, 0, 0, 0);
gl.lineWidth(1.75);

function projectLabel(matrix, point) {
  const clipX = matrix[0] * point[0] + matrix[4] * point[1] + matrix[8] * point[2] + matrix[12];
  const clipY = matrix[1] * point[0] + matrix[5] * point[1] + matrix[9] * point[2] + matrix[13];
  const clipW = matrix[3] * point[0] + matrix[7] * point[1] + matrix[11] * point[2] + matrix[15];
  if (clipW <= 0) return null;
  return [
    (clipX / clipW * 0.5 + 0.5) * sectorLabels.width,
    (1 - (clipY / clipW * 0.5 + 0.5)) * sectorLabels.height
  ];
}

function resizeCanvases() {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
  const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    sectorLabels.width = width;
    sectorLabels.height = height;
    labelContext.font = `${16 * pixelRatio}px Segoe UI, sans-serif`;
    labelContext.lineWidth = 4 * pixelRatio;
  }
}

let lastFrameTime = null;
let smoothedDirection = controls.direction;
let smoothedPropulsion = controls.propulsion;

function renderFrame(time) {
  const deltaSeconds = lastFrameTime === null ? 0 : Math.min((time - lastFrameTime) / 1000, 0.05);
  lastFrameTime = time;
  const easing = 1 - Math.exp(-8 * deltaSeconds);
  const directionDelta = ((controls.direction - smoothedDirection + 540) % 360) - 180;
  smoothedDirection += directionDelta * easing;
  smoothedPropulsion += (controls.propulsion - smoothedPropulsion) * easing;

  resizeCanvases();
  const width = canvas.width;
  const height = canvas.height;
  gl.viewport(0, 0, width, height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const directionRadians = (smoothedDirection * Math.PI) / 180;
  const travelPhase = time * 0.00031 * (0.5 + smoothedPropulsion * 0.35);
  const driftX = Math.sin(travelPhase) * 0.08;
  const driftY = Math.sin(travelPhase * 0.7) * 0.035;
  const forwardX = Math.sin(directionRadians) * 0.25;
  const projection = perspective(Math.PI / 4, width / height, 0.1, 50);
  const view = lookAt([4.8, 2.2, 7], [forwardX, 0, 0], [0, 1, 0]);
  const model = multiply(rotationY(directionRadians), translation(forwardX * 0.3 + driftX, driftY, -0.1));
  const finalMatrix = multiply(projection, multiply(view, model));

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, fireBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
  gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);
  gl.uniform3f(colorLocation, 0.58, 0.4, 0.2);
  gl.drawArrays(gl.LINES, 0, fireData.length / 3);

  gl.bindBuffer(gl.ARRAY_BUFFER, rocketBuffer);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
  gl.uniformMatrix4fv(matrixLocation, false, finalMatrix);
  gl.uniform3f(colorLocation, 0.4, 0.25, 0.12);
  gl.drawArrays(gl.LINES, 0, rocketData.length / 3);

  labelContext.clearRect(0, 0, sectorLabels.width, sectorLabels.height);
  const pixelRatio = window.devicePixelRatio || 1;
  labelContext.font = `600 ${16 * pixelRatio}px Segoe UI, sans-serif`;
  labelContext.textAlign = 'center';
  labelContext.textBaseline = 'middle';
  labelContext.fillStyle = '#000000';
  labelContext.strokeStyle = 'rgba(255, 247, 222, 0.9)';
  labelContext.lineWidth = 4 * pixelRatio;

  const bodyLength = controls.length;
  const bodyRadius = 0.42;
  const wingHalf = controls.wingSpan * 0.45;
  const finRootZ = -bodyLength * 0.15;
  const finRearZ = -bodyLength * 0.48;
  const noseTipZ = bodyLength / 2 + bodyLength * 0.7;
  const innerWingDepth = 0.2;
  const innerWingSpan = 0.12;
  const innerWingZ = finRootZ + (finRearZ - finRootZ) * innerWingDepth;
  const wingWidth = wingHalf - bodyRadius;
  const centerWingSpan = 0.42;
  const centerWingX = bodyRadius + wingWidth * centerWingSpan;
  const centerWingZ = finRootZ + (finRearZ - finRootZ) * 0.45;
  const rightInnerWingPoint = [bodyRadius + wingWidth * innerWingSpan, 0.18, innerWingZ];
  const leftCenterWingPoint = [-centerWingX, 0.18, centerWingZ];
  const rightCenterWingPoint = [centerWingX, 0.18, centerWingZ];
  const labelPoints = [
    [-wingHalf, 0.18, finRearZ], [wingHalf, 0.18, finRearZ], [0, 0, noseTipZ],
    [-bodyRadius, 0, bodyLength / 2], [bodyRadius, 0, bodyLength / 2],
    leftCenterWingPoint, rightInnerWingPoint, rightCenterWingPoint
  ];

  for (let sector = 0; sector < 4; sector++) {
    const angle = (sector / 4) * Math.PI * 2;
    labelPoints.push([Math.cos(angle) * bodyRadius, Math.sin(angle) * bodyRadius, 0]);
  }

  labelPoints.forEach((point, index) => {
    const screenPoint = projectLabel(finalMatrix, point);
    if (!screenPoint) return;
    const label = String(index + 1);
    labelContext.strokeText(label, screenPoint[0], screenPoint[1]);
    labelContext.fillText(label, screenPoint[0], screenPoint[1]);
  });

  requestAnimationFrame(renderFrame);
}

requestAnimationFrame(renderFrame);
