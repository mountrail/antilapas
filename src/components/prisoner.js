import { Character } from './character.js';

export class Prisoner extends Character {
    constructor(scene, name, health, damage, position) {
        super(scene, name, health, damage, position);
    }

    // Add prisoner-specific methods or overrides if needed
    attemptEscape(destination) {
        console.log(`${this.name} is attempting to escape to ${destination}.`);
        this.moveTo(destination); // Reuse the inherited moveTo logic
    }
}
