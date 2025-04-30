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
    return this.name + "," + this.alias + ", possess the powers of " + this.powers + " and protects " + this.city;
}
}


class Villain {
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

sayVillain() {
    return this.name + "," + this.alias + ", possess the powers of " + this.powers + " and terrorizes " + this.city;
}
}
// Heroes
const AdamWarlock = new Hero("Adam Warlock", "Adam Warlock", "cosmic energy manipulation, immortality", "Space");
console.log(AdamWarlock.sayHero());
const BlackPanther = new Hero("T'Challa", "Black Panther", "enhanced senses, agility, vibranium suit", "Wakanda");
console.log(BlackPanther.sayHero());
const BlackWidow = new Hero("Natasha Romanoff", "Black Widow", "espionage, martial arts, marksmanship", "The Globe");
console.log(BlackWidow.sayHero());
const CaptainAmerica = new Hero("Steve Rogers", "Captain America", "super strength, agility, vibranium shield", "Brooklyn");
console.log(CaptainAmerica.sayHero());
const CloakAndDagger = new Hero("Tyrone Johnson and Tandy Bowen", "Cloak and Dagger", "darkforce manipulation, light daggers", "New York");
console.log(CloakAndDagger.sayHero());
const DoctorStrange = new Hero("Stephen Strange", "Doctor Strange", "sorcery, time manipulation, astral projection", "Sanctum Sanctorum");
console.log(DoctorStrange.sayHero());
const Groot = new Hero("Groot", "Groot", "regeneration, strength, plant manipulation", "Space");
console.log(Groot.sayHero());
const Hawkeye = new Hero("Clint Barton", "Hawkeye", "archery, marksmanship, martial arts", "New York");
console.log(Hawkeye.sayHero());
const Hulk = new Hero("Bruce Banner", "Hulk", "super strength, durability, rage empowerment", "The Globe");
console.log(Hulk.sayHero());
const HumanTorch = new Hero("Johnny Storm", "Human Torch", "pyrokinesis, flight, heat resistance", "New York");
console.log(HumanTorch.sayHero());
const InvisibleWoman = new Hero("Sue Storm", "Invisible Woman", "invisibility, force fields", "New York");
console.log(InvisibleWoman.sayHero());
const IronFist = new Hero("Danny Rand", "Iron Fist", "martial arts, chi manipulation", "K'un-Lun");
console.log(IronFist.sayHero());
const IronMan = new Hero("Tony Stark", "Iron Man", "genius intellect, powered armor suit", "New York");
console.log(IronMan.sayHero());
const JeffTheLandShark = new Hero("Jeff", "Jeff the Land Shark", "adorable, small but mighty", "Unknown");
console.log(JeffTheLandShark.sayHero());
const LunaSnow = new Hero("Seol Hee", "Luna Snow", "ice manipulation, singing", "South Korea");
console.log(LunaSnow.sayHero());
const Mantis = new Hero("Mantis", "Mantis", "empathy, martial arts, precognition", "Space");
console.log(Mantis.sayHero());
const MisterFantastic = new Hero("Reed Richards", "Mister Fantastic", "elasticity, genius intellect", "New York");
console.log(MisterFantastic.sayHero());
const MoonKnight = new Hero("Marc Spector", "Moon Knight", "martial arts, lunar strength, gadgets", "New York");
console.log(MoonKnight.sayHero());
const Namor = new Hero("Namor McKenzie", "Namor", "aquatic abilities, super strength, flight", "Atlantis");
console.log(Namor.sayHero());
const PeniParker = new Hero("Peni Parker", "SP//dr", "mecha piloting, intelligence", "New York");
console.log(PeniParker.sayHero());
const Psylocke = new Hero("Betsy Braddock", "Psylocke", "telepathy, telekinesis, martial arts", "The Globe");
console.log(Psylocke.sayHero());
const Punisher = new Hero("Frank Castle", "The Punisher", "marksmanship, combat strategy, determination", "New York");
console.log(Punisher.sayHero());
const RocketRaccoon = new Hero("Rocket", "Rocket Raccoon", "marksmanship, engineering, tactics", "Space");
console.log(RocketRaccoon.sayHero());
const ScarletWitch = new Hero("Wanda Maximoff", "Scarlet Witch", "chaos magic, reality manipulation", "The Globe");
console.log(ScarletWitch.sayHero());
const SquirrelGirl = new Hero("Doreen Green", "Squirrel Girl", "squirrel communication, agility, strength", "New York");
console.log(SquirrelGirl.sayHero());
const SpiderMan = new Hero("Peter Parker", "Spider-Man", "wall-crawling, spider sense, agility", "New York");
console.log(SpiderMan.sayHero());
const StarLord = new Hero("Peter Quill", "Star-Lord", "marksmanship, gadgets, leadership", "Space");
console.log(StarLord.sayHero());
const Storm = new Hero("Ororo Munroe", "Storm", "weather manipulation, flight", "The Globe");
console.log(Storm.sayHero());
const Thor = new Hero("Thor Odinson", "Thor", "godly strength, Mjolnir, lightning manipulation", "Asgard");
console.log(Thor.sayHero());
const WinterSoldier = new Hero("Bucky Barnes", "Winter Soldier", "enhanced strength, marksmanship, cybernetic arm", "The Globe");
console.log(WinterSoldier.sayHero());
const Wolverine = new Hero("Logan", "Wolverine", "regeneration, adamantium claws, enhanced senses", "The Globe");
console.log(Wolverine.sayHero());

// Villains
const Hela = new Villain("Hela", "Hela", "death manipulation, super strength, necromancy", "Asgard");
console.log(Hela.sayVillain());
const Loki = new Villain("Loki Laufeyson", "Loki", "illusion, sorcery, shapeshifting", "Asgard");
console.log(Loki.sayVillain());
const Magik = new Villain("Illyana Rasputina", "Magik", "sorcery, teleportation, Soulsword", "Limbo");
console.log(Magik.sayVillain());
const Magneto = new Villain("Erik Lehnsherr", "Magneto", "magnetism manipulation, genius intellect", "The Globe");
console.log(Magneto.sayVillain());
const Venom = new Villain("Eddie Brock", "Venom", "symbiote powers, super strength, agility", "New York");
console.log(Venom.sayVillain());