import { Scene } from 'phaser';
import { createText } from "../components/text1";
import { createButton, } from "../components/button1";
import { createMenu1, } from "../components/menu1";
import { createMenu2, } from "../components/menu2";
import { PopupWindow, } from "../components/windows1";
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
        this.popupWindowMedium = new PopupWindow(this, 640, 300, 500, 300, () => {
            // this.isPopupActive = false;
        });
        this.popupWindowBig = new PopupWindow(this, 640, 300, 750, 430, () => {
            // this.isPopupActive = false;
        });


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

        // Add interactive buttons
        this.admiCctvButton = this.add.image(415, 140, "cctv").setScale(0.6).setInteractive();
        this.admiCctvButton.angle = 90; // Rotates the image by 45 degrees

        this.admiCctvButton.on("pointerdown", () => {
            if (!this.isPopupActive) {
                const windowTitle = ("cam-administrasi");
                const windowContent = createText(this, 0, 0, "Tidak ada orang disini...", "18px", "#98cc92").setOrigin(0.5);
                this.popupWindowMedium.show(windowTitle, windowContent)
            }
        });

        this.lapnCctvButton = this.add.image(775, 235, "cctv").setScale(0.6).setInteractive();
        this.lapnCctvButton.angle = 90; // Rotates the image by 45 degrees
        this.lapnCctvButton.on("pointerdown", () => {
            if (!this.isPopupActive) {
                const windowTitle = ("cam-lapangan");
                const windowContent = createText(this, 0, 0, "Tidak ada orang disini...", "18px", "#98cc92").setOrigin(0.5);
                this.popupWindowMedium.show(windowTitle, windowContent)
            }
        });

        this.walkieTalkie = this.add.image(100, 660, "walkieTalkie").setScale(0.4).setInteractive();

        // Walkie-talkie functionality
        this.walkieTalkieOriginalPosition = { x: 100, y: 660 };
        this.walkieTalkieTargetPosition = { x: 640, y: 360 };

        this.isPopupActive = false;
        this.isWalkieTalkieActive = false;

        // Handle clicking the walkie-talkie
        this.walkieTalkie.on("pointerdown", () => {
            if (!this.isPopupActive) {
                this.transitionToMiddle();
            }
        });

        // Handle clicking elsewhere
        this.input.on("pointerdown", (pointer, gameObjects) => {
            if (
                !this.isPopupActive &&
                !gameObjects.includes(this.walkieTalkie) &&
                (!this.walkieTalkieMenu || !this.walkieTalkieMenu.list.some((obj) => gameObjects.includes(obj)))
            ) {
                this.transitionToHidden();
            }
        });
    }

    // Show guard selection UI
    showSelectGuardWindow() {
        const windowTitle = "Pilih Penjaga";
        const buttonsConfig = [];

        this.guards.forEach((guard) => {
            const guardButton = {
                text: `${guard.name} - HP: ${guard.health}, DMG: ${guard.damage}`,
                callback: () => {
                    this.isPopupActive = false;
                    this.popupWindowBig.hide();
                    this.showSelectedGuardWindow(guard.name);
                },
            };
            buttonsConfig.push(guardButton);
        });

        const menu = createMenu2(this, -350, -150, buttonsConfig);
        const windowContent = menu;

        // Store the popup window instance in a property
        this.popupWindowBig.show(windowTitle, windowContent);
    }

    showSelectedGuardWindow(name) {
        const windowTitle = name;
        const buttonsConfig = [];

        this.roomNames.forEach((room) => {
            const roomButton = {
                text: room,
                callback: () => {
                    this.isPopupActive = false;
                    this.popupWindowBig.hide();
                    this.popupWindowMedium.show("Cek Ruangan", `Siap laksanakan, ${name} otw ke ${room}.`);
                }
            }
            buttonsConfig.push(roomButton);
        });
        const menu = createMenu2(this, -350, -150, buttonsConfig);
        const windowContent = menu;

        // Store the popup window instance in a property
        this.popupWindowBig.show(windowTitle, windowContent);
    }

    showAllGuardsWindow() {
        const windowTitle = ("Semua Personil...");
        const buttonsConfig = [
            {
                text: "Berpencar",
                callback: () => { this.popupWindowMedium.show("Berpencar", "Semua penjaga sedang berpencar") },
            },
            {
                text: "Kembali ke Barak",
                callback: () => { this.popupWindowMedium.show("Kembali ke Barak", "Semua penjaga kembali ke barak") },
            },
        ];

        const menu = createMenu1(this, 0, -60, buttonsConfig);
        const windowContent = menu;
        this.popupWindowMedium.show(windowTitle, windowContent)
    }

    // Transition walkie-talkie to the middle
    transitionToMiddle() {
        if (this.isWalkieTalkieActive == false) {
            this.isWalkieTalkieActive = true;

            // Animate the walkie-talkie to the center
            this.tweens.add({
                targets: this.walkieTalkie,
                x: this.walkieTalkieTargetPosition.x,
                y: this.walkieTalkieTargetPosition.y,
                duration: 500,
                ease: "Power2",
            });

            // Show menu buttons
            this.showWalkieTalkieMenu();
        }
    }

    // Transition walkie-talkie back to hidden position
    transitionToHidden() {
        this.isWalkieTalkieActive = false;

        // Animate the walkie-talkie back to its original position
        this.tweens.add({
            targets: this.walkieTalkie,
            x: this.walkieTalkieOriginalPosition.x,
            y: this.walkieTalkieOriginalPosition.y,
            duration: 500,
            ease: "Power2",
        });

        // Hide menu buttons
        this.hideWalkieTalkieMenu();
    }

    // Show walkie-talkie menu buttons
    showWalkieTalkieMenu() {
        const buttonsConfig = [
            {
                text: "Pilih Personil",
                callback: () => {
                    if (!this.isPopupActive) {
                        // this.isPopupActive = true;
                        this.walkieTalkieMenu.destroy();
                        this.showSelectGuardWindow();
                    }
                },
            },
            {
                text: "Semua Personil",
                callback: () => {
                    if (!this.isPopupActive) {
                        // this.isPopupActive = true;
                        this.walkieTalkieMenu.destroy();
                        this.showAllGuardsWindow();
                    }
                },
            },
        ];

        this.walkieTalkieMenu = createMenu1(this, 640, 460, buttonsConfig);
    }

    // Hide walkie-talkie menu buttons
    hideWalkieTalkieMenu() {
        if (this.walkieTalkieMenu) {
            this.walkieTalkieMenu.destroy();
        }
    }

}