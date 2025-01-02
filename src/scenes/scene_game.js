import { Scene } from 'phaser';
import { createText } from "../components/text1";
import { PopupWindow } from "../components/windows1";
import { WalkieTalkie } from "../components/walkieTalkie";
import { createButton } from '../components/button1';
import { Guard } from "../components/guard";

// Define the Game Scene
export class GameScene extends Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    // ########################## SCENE PRELOAD #############################
    preload() {
        this.load.image("prisonMap", "assets/prison-map.png");
        this.load.image("cctv", "assets/cctv.png");
        this.load.image("walkieTalkie", "assets/walkie-talkie.png");
        this.startTime = { hours: 6, minutes: 0 };
    }

    // ########################## SCENE CREATE #############################
    create() {
        this.isPopupActive = false;
        this.isMapActive = false;

        this.windowMid = new PopupWindow(this, 640, 300, 500, 300);
        this.windowBig = new PopupWindow(this, 640, 300, 750, 430);

        this.guards = [
            new Guard(this, "Thorne", 100, 20, "Administrasi", "#ff4c4c"),
            new Guard(this, "Blaze", 90, 25, "Barak"),
            new Guard(this, "Raven", 120, 15, "Ruang Medis"),
            new Guard(this, "Axel", 110, 18, "Lorong A"),
            new Guard(this, "Vex", 80, 30, "Lorong B"),
            new Guard(this, "Drake", 95, 22, "Lorong C"),
            new Guard(this, "Nyx", 100, 20, "Kantin"),
            new Guard(this, "Zephyr", 110, 16, "Lapangan"),
            new Guard(this, "Jinx", 85, 28, "Kamar Mandi"),
            new Guard(this, "Echo", 130, 10, "Pagar Kiri"),
        ];

        this.roomNames = [
            { name: "Administrasi", connections: ["Ruang Serbaguna", "Barak", "Ruang Medis", "Pagar Kanan", "Pagar Kiri", "Keluar"], navTime: 6, cam: "cam-administrasi" },
            { name: "Barak", connections: ["Administrasi", "Ruang Medis"], navTime: 4 },
            { name: "Ruang Serbaguna", connections: ["Administrasi", "Lorong A"], navTime: 4 },
            { name: "Ruang Medis", connections: ["Barak", "Administrasi", "Lorong D"], navTime: 4 },
            { name: "Lorong A", connections: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "Ruang Serbaguna", "Lapangan"], pathways: ["Lorong B", "Lorong D"], navTime: 10 },
            { name: "Lorong B", connections: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "Kantin"], pathways: ["Lorong A", "Lorong C"], navTime: 10 },
            { name: "Lorong C", connections: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "Kamar Mandi", "Lapangan"], pathways: ["Lorong B", "Lorong D"], navTime: 10 },
            { name: "Lorong D", connections: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "Ruang Medis"], pathways: ["Lorong A", "Lorong C"], navTime: 10 },
            { name: "Kantin", connections: ["Lorong B"], navTime: 4 },
            { name: "Kamar Mandi", connections: ["Lorong C"], navTime: 4 },
            { name: "Lapangan", connections: ["Lorong A", "Lorong C"], cam: "cam-lapangan", navTime: 10 },
            { name: "Pagar Kiri", connections: ["Administrasi"], pathways: ["Pagar Belakang"], navTime: 12 },
            { name: "Pagar Kanan", connections: ["Administrasi"], pathways: ["Pagar Belakang"], navTime: 12 },
            { name: "Pagar Belakang", pathways: ["Pagar Kiri", "Pagar Kanan"], navTime: 12 },
        ];

        this.background = this.add.image(0, 0, "background").setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        createButton(this, 250, 490, "Buka Peta", () => this.showMap());

        this.walkieTalkie = new WalkieTalkie(this, 100, 660, [
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
        ]);

        this.initializeTimer();
        this.roomGuardDisplay = [];
        this.updateRoomGuardDisplay();
    }

    // ########################## SCENE UPDATE #############################
    update() { }

    // ########################## DISPLAY ROOM AND GUARD #############################
    updateRoomGuardDisplay() {
        this.roomGuardDisplay.forEach(text => text.destroy());
        this.roomGuardDisplay = [];

        const roomGuardMap = {};
        this.guards.forEach(guard => {
            if (!roomGuardMap[guard.position]) {
                roomGuardMap[guard.position] = [];
            }
            roomGuardMap[guard.position].push(guard.name);
        });

        let yPosition = 90;
        this.roomNames.forEach(room => {
            const guardsInRoom = roomGuardMap[room.name] || [];
            const displayText = `${room.name}: ${guardsInRoom.join(", ") || "Empty"}`;
            const textColor = guardsInRoom.length === 0 ? "#ff4c4c" : "#98cc92";
            const textObject = createText(this, 250, yPosition, displayText, "18px", textColor);
            this.roomGuardDisplay.push(textObject);
            yPosition += 20;
        });
    }

    // ########################## GUARD ACTIONS #############################
    moveGuard(guardName, destination) {
        const guard = this.guards.find(g => g.name === guardName);
        if (guard) guard.moveTo(destination);
    }

    clearAllGuardCommands() {
        this.guards.forEach(guard => guard.cancelMovement());
        console.log("All guard commands have been cleared.");
    }

    // ########################## ADD CCTV BUTTON #############################
    addCctvButton(x, y, title, message) {
        const button = this.add.image(x, y, "cctv").setScale(0.6).setInteractive();
        button.angle = 90;
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
