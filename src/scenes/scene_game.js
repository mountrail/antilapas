import { Scene } from 'phaser';
import { createText } from "../components/text1";
import { createButton, } from "../components/button1";
import { createMenu1, } from "../components/menu1";
import { createMenu2, } from "../components/menu2";
import { PopupWindow, } from "../components/windows1";
import { WalkieTalkie, } from "../components/walkieTalkie";

// Define the Game Scene
export class GameScene extends Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.load.image("prisonMap", "assets/prison-map.png");
        this.load.image("cctv", "assets/cctv.png");
        this.load.image("walkieTalkie", "assets/walkie-talkie.png");
    }

    create() {

        this.isPopupActive = false;

        // Create the popup window
        this.windowMid = new PopupWindow(this, 640, 300, 500, 300);
        this.windowBig = new PopupWindow(this, 640, 300, 750, 430);

        // add guard
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

        this.roomNames = [
            "Administrasi",
            "Ruang Serbaguna",
            "Barak",
            "Ruang Medis",
            "Kantin",
            "Kamar Mandi",
            "Lapangan",
            "Lorong A",
            "Lorong B",
            "Lorong C",
            "Lorong D",
            "Pagar Kiri",
            "Pagar Kanan",
            "Pagar Bawah",
        ];
        // Add background and map
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.add.image(650, 300, "prisonMap").setInteractive();

        // Instantiate WalkieTalkie
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

        // Add interactive buttons
        this.admiCctvButton = this.add.image(415, 140, "cctv").setScale(0.6).setInteractive();
        this.admiCctvButton.angle = 90; // Rotates the image by 45 degrees

        this.admiCctvButton.on("pointerdown", () => {
            if (!this.isPopupActive) {
                const windowTitle = ("cam-administrasi");
                const windowContent = createText(this, 0, 0, "Tidak ada orang disini...", "18px", "#98cc92").setOrigin(0.5);
                this.windowMid.show(windowTitle, windowContent)
            }
        });

        this.lapnCctvButton = this.add.image(775, 235, "cctv").setScale(0.6).setInteractive();
        this.lapnCctvButton.angle = 90; // Rotates the image by 45 degrees
        this.lapnCctvButton.on("pointerdown", () => {
            if (!this.isPopupActive) {
                const windowTitle = ("cam-lapangan");
                const windowContent = createText(this, 0, 0, "Tidak ada orang disini...", "18px", "#98cc92").setOrigin(0.5);
                this.windowMid.show(windowTitle, windowContent)
            }
        });

    }





}