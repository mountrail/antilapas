class Guard {
    constructor(scene, name, health, damage, position, color = "#ffffff") {
        this.scene = scene; // Reference to the Phaser scene
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.position = position;
        this.color = color;
        this.currentMovement = null; // Tracks ongoing movement
    }

    // Move the guard to a destination
    moveTo(destination) {
        if (this.currentMovement) {
            clearTimeout(this.currentMovement); // Cancel ongoing movement
            console.log(`Guard ${this.name}'s previous movement was interrupted.`);
        }

        const path = this.scene.findPath(this.position, destination);
        if (!path) {
            console.log(`No path found from ${this.position} to ${destination}.`);
            return;
        }

        console.log(`Guard ${this.name} is navigating from ${this.position} to ${destination}.`);

        let step = 0;
        const moveStep = () => {
            if (step < path.length) {
                this.position = path[step];
                this.scene.updateRoomGuardDisplay(); // Update the display after each step
                step++;

                if (step < path.length) {
                    const currentRoom = this.scene.findRoomByName(path[step - 1]);
                    const nextNavTime = currentRoom ? currentRoom.navTime * 1000 : 1000;

                    this.currentMovement = setTimeout(moveStep, nextNavTime);
                } else {
                    console.log(`Guard ${this.name} has reached ${destination}.`);
                    this.currentMovement = null; // Clear movement tracker
                    this.scene.updateRoomGuardDisplay(); // Final update
                }
            }
        };

        moveStep(); // Start moving
    }

    // Cancel the guard's ongoing movement
    cancelMovement() {
        if (this.currentMovement) {
            clearTimeout(this.currentMovement);
            this.currentMovement = null;
            console.log(`Guard ${this.name}'s movement has been stopped.`);
        }
    }
}
