import { createText } from "../components/text1";
import { createButton } from "../components/button1";
import { createMenu1 } from "../components/menu1";
import { createMenu2 } from "../components/menu2";
import { PopupWindow } from "../components/windows1";

export class WalkieTalkie {
    constructor(scene, x, y, buttonsConfig) {
        this.scene = scene;
        this.originalPosition = { x, y };
        this.buttonsConfig = buttonsConfig;
        this.targetPosition = { x: 640, y: 360 }; // Center position

        // Walkie-talkie icon
        this.icon = scene.add.image(x, y, "walkieTalkie")
            .setScale(0.4)
            .setInteractive()
            .setDepth(2);

        // Menu container
        this.menu = null;

        // State variables
        this.isActive = false;
        this.activeWindow = null; // Tracks the active window

        // Event listeners
        this.icon.on("pointerdown", () => {
            if (!this.isActive) {
                this.activate();
            }
        });

        // Window instances
        this.windowBig = new PopupWindow(
            this.scene, 640, 300, 750, 430,
            () => { }, // No-op for on show
            () => {
                this.activeWindow = null; // Clear active window on close
                this.deactivate(); // Explicitly deactivate
            }
        );

        this.windowMid = new PopupWindow(
            this.scene, 640, 300, 500, 300,
            () => { }, // No-op for on show
            () => {
                this.activeWindow = null; // Clear active window on close
                this.deactivate(); // Explicitly deactivate
            }
        );


        // Handle clicks outside the icon and menu
        this.scene.input.on("pointerdown", (pointer, gameObjects) => {
            if (
                this.isActive &&
                !gameObjects.includes(this.icon) &&
                (!this.menu || !this.menu.list.some((obj) => gameObjects.includes(obj))) &&
                !this.activeWindow
            ) {
                this.deactivate();
            }
        });
    }


    activate() {
        if (!this.scene.isPopupActive) {

            this.isActive = true;

            // Animate the walkie-talkie to the center
            this.scene.tweens.add({
                targets: this.icon,
                x: this.targetPosition.x,
                y: this.targetPosition.y,
                duration: 500,
                ease: "Power2",
            });

            // Show menu
            this.showMenu();
        }
    }

    deactivate() {
        this.isActive = false;

        // Animate the walkie-talkie back to its original position
        this.scene.tweens.add({
            targets: this.icon,
            x: this.originalPosition.x,
            y: this.originalPosition.y,
            duration: 500,
            ease: "Power2",
        });

        // Hide menu
        this.hideMenu();
    }

    showMenu() {
        this.scene.isPopupActive = true;
        this.menu = createMenu1(this.scene, this.targetPosition.x, this.targetPosition.y + 100, this.buttonsConfig).setDepth(2);
    }

    hideMenu() {
        this.scene.isPopupActive = false;
        if (this.menu) {
            this.menu.destroy();
            this.menu = null;
        }
    }

    showSelectGuardWindow() {
        const windowTitle = "Pilih Penjaga";
        const buttonsConfig = [];

        this.scene.guards.forEach((guard) => {
            const guardButton = {
                text: `${guard.name} - HP: ${guard.health}, DMG: ${guard.damage}`,
                callback: () => {
                    this.scene.isPopupActive = false;
                    this.windowBig.hide();
                    this.showSelectedGuardWindow(guard.name);
                },
            };
            buttonsConfig.push(guardButton);
        });

        const menu = createMenu2(this.scene, -350, -150, buttonsConfig);
        const windowContent = menu;

        this.windowBig.show(windowTitle, windowContent);
        this.activeWindow = this.windowBig; // Mark the window as active
    }

    showAllGuardsWindow() {
        const windowTitle = "Semua Personil...";
        const buttonsConfig = [
            {
                text: "Berpencar",
                callback: () => {
                    this.windowMid.show("Berpencar", "Semua penjaga sedang berpencar");
                },
            },
            {
                text: "Kembali ke Barak",
                callback: () => {
                    this.windowMid.show("Kembali ke Barak", "Semua penjaga kembali ke barak");
                },
            },
        ];

        const menu = createMenu1(this.scene, 0, -60, buttonsConfig);
        const windowContent = menu;
        this.windowMid.show(windowTitle, windowContent);
        this.activeWindow = this.windowMid; // Mark the window as active
    }


    showSelectedGuardWindow(name) {
        const windowTitle = name;
        const buttonsConfig = [];

        this.scene.roomNames.forEach((room) => {
            const roomButton = {
                text: room,
                callback: () => {
                    this.scene.isPopupActive = false;
                    this.windowBig.hide();
                    this.windowMid.show("Cek Ruangan", `Siap laksanakan, ${name} otw ke ${room}.`);
                }
            }
            buttonsConfig.push(roomButton);
        });
        const menu = createMenu2(this.scene, -350, -150, buttonsConfig);
        const windowContent = menu;

        // Store the popup window instance in a property
        this.windowBig.show(windowTitle, windowContent);
    }
}
