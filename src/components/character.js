class Character {
    constructor(name, damage, health, position) {
        this.name = name;
        this.damage = damage;
        this.health = health;
        this.position = position;
        
    }

    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}, Role: ${this.role}`;
    }

    performAction() {
        console.log(`${this.name} is performing an action.`);
    }
}

export default Character;