export class Character {
    constructor(scene, name, health, damage, position) {
        this.scene = scene;
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.position = position;
        this.currentMovement = null; // To track ongoing movements
    }

    // Find a room by its name
    findRoomByName(name) {
        return this.scene.roomNames.find(room => room.name === name);
    }

    // Find the shortest path between two rooms
    findPath(start, destination) {
        const queue = [[start]];
        const visited = new Set();

        while (queue.length > 0) {
            const path = queue.shift();
            const room = path[path.length - 1];

            if (room === destination) return path;

            if (!visited.has(room)) {
                visited.add(room);
                const roomData = this.findRoomByName(room);
                if (roomData) {
                    const neighbors = [...(roomData.connections || []), ...(roomData.pathways || [])];
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            queue.push([...path, neighbor]);
                        }
                    }
                }
            }
        }

        return null;
    }

    // Move to a destination
    moveTo(destination) {
        if (this.currentMovement) {
            clearTimeout(this.currentMovement);
            console.log(`${this.name}'s previous movement was interrupted.`);
        }

        const path = this.findPath(this.position, destination);
        if (!path) {
            console.log(`No path found from ${this.position} to ${destination}.`);
            return;
        }

        console.log(`${this.name} is navigating from ${this.position} to ${destination}.`);

        let step = 0;
        const moveStep = () => {
            if (step < path.length) {
                this.position = path[step];
                this.scene.updateRoomGuardDisplay();
                step++;

                if (step < path.length) {
                    const currentRoom = this.findRoomByName(path[step - 1]);
                    const nextNavTime = currentRoom ? currentRoom.navTime * 1000 : 1000;

                    this.currentMovement = setTimeout(moveStep, nextNavTime);
                } else {
                    console.log(`${this.name} has reached ${destination}.`);
                    this.currentMovement = null;
                    this.scene.updateRoomGuardDisplay();
                }
            }
        };

        moveStep();
    }

    // Cancel movement
    cancelMovement() {
        if (this.currentMovement) {
            clearTimeout(this.currentMovement);
            this.currentMovement = null;
            console.log(`${this.name}'s movement has been stopped.`);
        }
    }
}
