import { Character } from './character.js';

export class Guard extends Character {
    constructor(scene, name, health, damage, position) {
        super(scene, name, health, damage, position);
    }

    // Add guard-specific methods or overrides if needed
    patrol(area) {
        console.log(`${this.name} is patrolling the ${area}.`);
    }
}
