import { createText } from "../components/text1";
import { createButton } from "../components/button1";
import { createMenu1 } from "../components/menu1";
import { createMenu2 } from "../components/menu2";
import { PopupWindow } from "../components/windows1";

export class WalkieTalkie {
    constructor(scene, x, y, buttonsConfig) {
        // Initialize properties
        this.scene = scene;
        this.originalPosition = { x, y }; // Starting position of the walkie-talkie
        this.buttonsConfig = buttonsConfig; // Button configurations for the menu
        this.targetPosition = { x: 640, y: 360 }; // Center position for the walkie-talkie

        // Create the walkie-talkie icon
        this.WtImage = this.createIcon(x, y);
        this.WtMenu = null; // Menu container, initially null
        this.isActive = false; // State to track if the walkie-talkie is active
        this.activeWindow = null; // Tracks the currently active popup window

        // Create popup windows
        this.windowBig = this.createPopupWindow(750, 430); // Large popup window
        this.windowMid = this.createPopupWindow(500, 300); // Medium popup window

        // Add event listeners
        this.addPointerDownListener();
        this.addSceneInputListener();
    }

    // Creates the walkie-talkie icon and sets up interactions
    createIcon(x, y) {
        return this.scene.add.image(x, y, "walkieTalkie")
            .setScale(0.4)
            .setInteractive()
            .setDepth(2)
            .on("pointerdown", () => {
                if (!this.isActive) this.activate();
            });
    }

    // Creates a reusable popup window instance
    createPopupWindow(width, height) {
        return new PopupWindow(
            this.scene, 640, 300, width, height,
            () => { }, // Callback for when the window is shown (currently no-op)
            () => {
                this.activeWindow = null; // Clear the active window reference
                this.deactivate(); // Deactivate the walkie-talkie when the window closes
            }
        );
    }

    // Adds an event listener for the walkie-talkie icon
    addPointerDownListener() {
        this.WtImage.on("pointerdown", () => {
            if (!this.isActive) {
                this.activate();
            }
        });
    }

    // Adds an event listener to handle clicks outside the walkie-talkie and its menu
    addSceneInputListener() {
        this.scene.input.on("pointerdown", (pointer, gameObjects) => {
            if (
                this.isActive &&
                !gameObjects.includes(this.WtImage) && !this.activeWindow
            ) {
                this.deactivate();
            }
        });
    }

    // Activates the walkie-talkie and shows the menu
    activate() {
        if (!this.scene.isPopupActive) {
            this.isActive = true; // Set active state
            this.animateIcon(this.targetPosition.x, this.targetPosition.y); // Move icon to center
            this.showMenu(); // Display the menu
        }
    }

    // Deactivates the walkie-talkie and hides the menu
    deactivate() {
        this.isActive = false; // Set inactive state
        this.animateIcon(this.originalPosition.x, this.originalPosition.y); // Move icon back to original position
        this.hideMenu(); // Hide the menu
    }

    // Animates the walkie-talkie icon to a target position
    animateIcon(x, y) {
        this.scene.tweens.add({
            targets: this.WtImage,
            x,
            y,
            duration: 500, // Animation duration
            ease: "Power2", // Easing function
        });
    }

    // Displays the menu at the target position
    showMenu() {
        this.scene.isPopupActive = true; // Mark popup as active
        this.WtMenu = createMenu1(this.scene, this.targetPosition.x, this.targetPosition.y + 100, this.buttonsConfig).setDepth(2);
    }

    // Hides and destroys the menu
    hideMenu() {
        this.scene.isPopupActive = false; // Mark popup as inactive
        if (this.WtMenu) {
            this.WtMenu.destroy();
            this.WtMenu = null;
        }
    }

    // Displays a window to select a guard
    showSelectGuardWindow() {
        const windowTitle = "Pilih Penjaga";
        const buttonsConfig = this.scene.guards.map((guard) => ({
            text: `${guard.name} - HP: ${guard.health}, DMG: ${guard.damage}`, // Button label
            callback: () => {
                this.scene.isPopupActive = false; // Deactivate popup state
                this.windowBig.hide(); // Hide the big window
                this.showSelectedGuardWindow(guard.name); // Show details for the selected guard
            },
        }));

        this.displayWindow(this.windowBig, windowTitle, createMenu2(this.scene, -350, -150, buttonsConfig));
    }

    showAllGuardsWindow() {
        const windowTitle = "Semua Personil...";
        const buttonsConfig = [
            {
                text: "Berpencar",
                callback: () => {
                    this.windowMid.show("Berpencar", "Semua penjaga sedang berpencar");

                    const availableRooms = this.scene.roomNames; // Get the list of available rooms
                    const assignedRooms = new Set(); // To ensure guards are sent to different rooms

                    this.scene.guards.forEach((guard) => {
                        let randomRoom;

                        // Assign a random room that hasn't been used yet (if possible)
                        do {
                            randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
                        } while (assignedRooms.has(randomRoom) && assignedRooms.size < availableRooms.length);

                        assignedRooms.add(randomRoom); // Mark the room as assigned
                        this.scene.moveGuard(guard.name, randomRoom.name); // Move the guard to the assigned room
                    });
                },
            },
            {
                text: "Kembali ke Barak",
                callback: () => {
                    this.windowMid.show("Kembali ke Barak", "Semua penjaga kembali ke barak");
                    this.scene.guards.forEach((guard) => {
                        this.scene.moveGuard(guard.name, "Barak"); // Command each guard to move to the "Barak" room
                    });
                },
            },
        ];

        this.displayWindow(this.windowMid, windowTitle, createMenu1(this.scene, 0, -60, buttonsConfig));
    }


    // Displays a window for a selected guard with room options
    showSelectedGuardWindow(name) {
        const windowTitle = name; // Window title is the guard's name
        const buttonsConfig = this.scene.roomNames.map((room) => ({
            text: room.name, // Button label is the room name
            callback: () => {
                this.scene.isPopupActive = false; // Deactivate popup state
                this.windowBig.hide(); // Hide the big window
                this.windowMid.show("Cek Ruangan", `Siap laksanakan, ${name} otw ke ${room.name}.`); // Show confirmation message
                this.scene.moveGuard(name, room.name);
            },
        }));

        this.displayWindow(this.windowBig, windowTitle, createMenu2(this.scene, -350, -150, buttonsConfig));
    }

    // Helper function to display a window with a title and content
    displayWindow(window, title, content) {
        window.show(title, content); // Show the window
        this.activeWindow = window; // Mark the window as active
    }
}
