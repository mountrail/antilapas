import { Scene } from 'phaser';
import { createText } from "../components/text1";
import { PopupWindow } from "../components/windows1";
import { WalkieTalkie } from "../components/walkieTalkie";

// Define the Game Scene
export class GameScene extends Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        // Load assets required for the scene
        this.load.image("prisonMap", "assets/prison-map.png");
        this.load.image("cctv", "assets/cctv.png");
        this.load.image("walkieTalkie", "assets/walkie-talkie.png");

        // declare variables
        this.startTime = { hours: 6, minutes: 0 };
    }

    create() {
        this.isPopupActive = false; // Tracks if a popup is active

        // Create popup windows for different purposes
        this.windowMid = new PopupWindow(this, 640, 300, 500, 300);
        this.windowBig = new PopupWindow(this, 640, 300, 750, 430);

        // Add guards with their attributes
        this.guards = [
            { name: "Dan", health: 100, damage: 20 },
            { name: "Max", health: 90, damage: 25 },
            { name: "Joe", health: 120, damage: 15 },
            { name: "Jay", health: 110, damage: 18 },
            { name: "Moe", health: 80, damage: 30 },
            { name: "Doe", health: 95, damage: 22 },
            { name: "May", health: 100, damage: 20 },
            { name: "Zen", health: 110, damage: 16 },
            { name: "Sal", health: 85, damage: 28 },
            { name: "Zoe", health: 130, damage: 10 },
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

        this.add.image(650, 300, "prisonMap").setInteractive();

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
        this.addCctvButton(415, 140, "cam-administrasi", "Tidak ada orang disini...");
        this.addCctvButton(775, 235, "cam-lapangan", "Tidak ada orang disini...");

        // Add a timer
        this.initializeTimer();
    }

    // Helper function to add CCTV buttons
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

    // Initialize and start the timer
    initializeTimer() {
        let currentTime = this.startTime; // Start at 06:00

        // Display the timer on the screen
        const timerText = this.add.text(10, 10, "Time: 06:00", { fontSize: "20px", color: "#FFFFFF" });

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
