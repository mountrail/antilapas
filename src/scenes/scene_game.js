import { Scene } from 'phaser';
import { createText } from "../components/text1";
import { PopupWindow } from "../components/windows1";
import { WalkieTalkie } from "../components/walkieTalkie";
import { createButton } from '../components/button1';

// Define the Game Scene
export class GameScene extends Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    // ########################## SCENE PRELOAD #############################
    preload() {
        // Load assets required for the scene
        this.load.image("prisonMap", "assets/prison-map.png");
        this.load.image("cctv", "assets/cctv.png");
        this.load.image("walkieTalkie", "assets/walkie-talkie.png");

        // declare variables
        this.startTime = { hours: 6, minutes: 0 };
    }

    // ########################## SCENE CREATE #############################
    create() {
        this.isPopupActive = false; // Tracks if a popup is active
        this.isMapActive = false;
        // Create popup windows for different purposes
        this.windowMid = new PopupWindow(this, 640, 300, 500, 300);
        this.windowBig = new PopupWindow(this, 640, 300, 750, 430);

        // Add guards with their attributes
        this.guards = [
            { name: "Dan", health: 100, damage: 20, position: "Administrasi" },
            { name: "Max", health: 90, damage: 25, position: "Barak" },
            { name: "Joe", health: 120, damage: 15, position: "Ruang Medis" },
            { name: "Jay", health: 110, damage: 18, position: "Lorong A" },
            { name: "Moe", health: 80, damage: 30, position: "Lorong B" },
            { name: "Doe", health: 95, damage: 22, position: "Lorong C" },
            { name: "May", health: 100, damage: 20, position: "Kantin" },
            { name: "Zen", health: 110, damage: 16, position: "Lapangan" },
            { name: "Jaz", health: 85, damage: 28, position: "Kamar Mandi" },
            { name: "Zoe", health: 130, damage: 10, position: "Pagar Kiri" },
        ];


        // List of room names in the scene
        this.roomNames = [
            { name: "Administrasi", connections: ["Ruang Serbaguna", "Barak", "Ruang Medis", "Pagar Kanan", "Pagar Kiri", "Keluar"], cam: "cam-administrasi" },
            { name: "Barak", connections: ["Administrasi", "Ruang Medis"] },
            { name: "Ruang Serbaguna", connections: ["Administrasi", "Lorong A"] },
            { name: "Ruang Medis", connections: ["Barak", "Administrasi", "Lorong D"] },
            { name: "Lorong A", connections: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "Ruang Serbaguna", "Lapangan"], pathways: ["Lorong B", "Lorong D"] },
            { name: "Lorong B", connections: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "Kantin"], pathways: ["Lorong A", "Lorong C"] },
            { name: "Lorong C", connections: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "Kamar Mandi", "Lapangan"], pathways: ["Lorong B", "Lorong D"] },
            { name: "Lorong D", connections: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "Ruang Medis"], pathways: ["Lorong A", "Lorong C"] },
            { name: "Kantin", connections: ["Lorong B"] },
            { name: "Kamar Mandi", connections: ["Lorong C"] },
            { name: "Lapangan", connections: ["Lorong A", "Lorong C"], cam: "cam-lapangan" },
            { name: "Pagar Kiri", connections: ["Administrasi"], pathways: ["Pagar Belakang"] },
            { name: "Pagar Kanan", connections: ["Administrasi"], pathways: ["Pagar Belakang"] },
            { name: "Pagar Belakang", pathways: ["Pagar Kiri", "Pagar Kanan"] },
        ];

        // Set up background and prison map
        this.background = this.add.image(0, 0, "background")
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // this.add.image(650, 300, "prisonMap").setInteractive();

        createButton(this, 250, 490, "Buka Peta", () => { this.showMap() });

        // Instantiate the WalkieTalkie component
        this.walkieTalkie = new WalkieTalkie(
            this,
            100,
            660,
            [
                {
                    text: "Pilih Personil",
                    callback: () => {
                        if (this.walkieTalkie.isActive) {
                            this.walkieTalkie.hideMenu();
                            this.walkieTalkie.showSelectGuardWindow();
                        }
                    },
                },
                {
                    text: "Semua Personil",
                    callback: () => {
                        if (this.walkieTalkie.isActive) {
                            this.walkieTalkie.hideMenu();
                            this.walkieTalkie.showAllGuardsWindow();
                        }
                    },
                },
            ]
        );

        // Add interactive CCTV buttons
        // this.addCctvButton(415, 140, "cam-administrasi", "Tidak ada orang disini...");
        // this.addCctvButton(775, 235, "cam-lapangan", "Tidak ada orang disini...");

        // Add a timer
        this.initializeTimer();

        // Add a container to hold the room-guard text objects
        this.roomGuardDisplay = [];

        // Initial update for room-guard display
        this.updateRoomGuardDisplay();

    }

    // ########################## SCENE UPDATE #############################
    update() { }

    
    // ########################## DISPLAY ROOM AND GUARD #############################
    updateRoomGuardDisplay() {
        // Clear the previous display
        this.roomGuardDisplay.forEach(text => text.destroy());
        this.roomGuardDisplay = [];

        const roomGuardMap = {};

        // Build a map of rooms to guards
        this.guards.forEach(guard => {
            if (!roomGuardMap[guard.position]) {
                roomGuardMap[guard.position] = [];
            }
            roomGuardMap[guard.position].push(guard.name);
        });

        // Generate the display text dynamically using createText
        let yPosition = 90; // Starting y position for the text display
        this.roomNames.forEach(room => {
            const guardsInRoom = roomGuardMap[room.name] || [];
            const isEmpty = guardsInRoom.length === 0; // Check if the room is empty
            const displayText = `${room.name}: ${guardsInRoom.join(", ") || "Empty"}`;
            const textColor = isEmpty ? "#ff4c4c" : "#98cc92"; // Red if empty, green otherwise
            const textObject = createText(this, 250, yPosition, displayText, "18px", textColor);
            this.roomGuardDisplay.push(textObject);
            yPosition += 20; // Move to the next line
        });
    }


    // ########################## FIND PATH #############################
    findRoomByName(name) {
        return this.roomNames.find(room => room.name === name);
    }

    findPath(start, destination) {
        const queue = [[start]]; // Queue to store paths
        const visited = new Set(); // Set to track visited rooms

        while (queue.length > 0) {
            const path = queue.shift(); // Dequeue the first path
            const room = path[path.length - 1]; // Get the last room in the path

            if (room === destination) return path; // If destination is reached, return the path

            if (!visited.has(room)) {
                visited.add(room); // Mark the room as visited
                const roomData = this.findRoomByName(room); // Get room data
                if (roomData) {
                    // Combine connections and pathways into a single list of neighbors
                    const neighbors = [...(roomData.connections || []), ...(roomData.pathways || [])];
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            queue.push([...path, neighbor]); // Add new path to the queue
                        }
                    }
                }
            }
        }

        return null; // Return null if no path is found
    }

    moveGuard(guardName, destination) {
        const guard = this.guards.find(g => g.name === guardName);
        if (!guard) {
            console.log(`Guard ${guardName} not found.`);
            return;
        }

        const path = this.findPath(guard.position, destination);
        if (!path) {
            console.log(`No path found from ${guard.position} to ${destination}.`);
            return;
        }

        console.log(`Guard ${guardName} is navigating from ${guard.position} to ${destination}.`);

        let step = 0;
        const moveStep = () => {
            if (step < path.length) {
                guard.position = path[step];
                this.updateRoomGuardDisplay(); // Update the display after each step
                step++;
                if (step < path.length) {
                    setTimeout(moveStep, 1000); // Wait 1 second between steps
                } else {
                    console.log(`Guard ${guardName} has reached ${destination}.`);
                    this.updateRoomGuardDisplay(); // Final update after reaching destination
                }
            }
        };

        moveStep();
    }

    // ########################## ADD CCTV BUTTON #############################
    addCctvButton(x, y, title, message) {
        const button = this.add.image(x, y, "cctv").setScale(0.6).setInteractive();
        button.angle = 90; // Rotate the image
        button.on("pointerdown", () => {
            if (!this.isPopupActive) {
                const windowContent = createText(this, 0, 0, message, "18px", "#98cc92").setOrigin(0.5);
                this.windowMid.show(title, windowContent);
            }
        });
    }

    // ########################## SHOW MAP #############################
    showMap() {
        if (!this.isMapActive) {
            this.isMapActive = true;
            const map = this.add.image(650, 300, "prisonMap").setInteractive().setDepth(1);
            if (map) {
                map.on("pointerdown", () => {
                    this.isMapActive = false;
                    map.destroy();
                });
            }
        }
    }

    // ########################## TIMER #############################
    initializeTimer() {
        let currentTime = this.startTime; // Start at 06:00

        // Display the timer on the screen
        const timerText = createText(this, 10, 10, "Time: 06:00", "24px", "#ffffff");

        // Update the timer every second (real-life)
        this.time.addEvent({
            delay: 1000, // 1 second in real life equals 1 in-game minute
            callback: () => {
                currentTime.minutes++;
                if (currentTime.minutes >= 60) {
                    currentTime.minutes = 0;
                    currentTime.hours++;
                    if (currentTime.hours >= 24) {
                        currentTime.hours = 0; // Reset to 0 if it reaches midnight
                    }
                }

                // Format the time as HH:MM
                const formattedTime = `${String(currentTime.hours).padStart(2, "0")}:${String(currentTime.minutes).padStart(2, "0")}`;
                timerText.setText(`Time: ${formattedTime}`);
            },
            loop: true
        });
    }
}
