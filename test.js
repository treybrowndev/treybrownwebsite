class Hero {
name = "";
alias = ""; 
powers = "";
city = ""; 
  
constructor(name, alias, powers, city) {
    this.name = name; 
    this.alias = alias;
    this.powers = powers; 
    this.city = city; 
}

sayName() {
    return this.name;
}

sayAlias() {
    return this.alias;
}


sayPowers() {
    return this.powers;
}

sayCity() {
    return this.city;
}


sayHero() {
    return this.name + "," + this.alias + ", has the powers of " + this.powers + " and protects " + this.city;
}


}

const Supes = new Hero("Clark Kent", "Superman", "flight, super strength, heat vision", "Metropolis");
console.log(Supes.sayHero());