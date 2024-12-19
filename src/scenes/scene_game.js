import { Scene } from 'phaser';
import { createText } from "../components/text1";
import { createButton, } from "../components/button1";
import { createMenu, } from "../components/button_menu";
import { createWindows, } from "../components/windows1";

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

        // Add background and map
        this.background = this.add.image(0, 0, "background");
        this.background.setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.add.image(650, 300, "prisonMap").setInteractive();

        // Add interactive buttons
        this.admiCctvButton = this.add.image(415, 140, "cctv").setScale(0.6).setInteractive();
        this.admiCctvButton.angle = 90; // Rotates the image by 45 degrees

        this.admiCctvButton.on("pointerdown", () => {
            if (!this.isPopupActive) {
                this.showPopup("cam-administrasi", "Tidak ada orang disini");
            }
        });

        this.lapnCctvButton = this.add.image(775, 235, "cctv").setScale(0.6).setInteractive();
        this.lapnCctvButton.angle = 90; // Rotates the image by 45 degrees
        this.lapnCctvButton.on("pointerdown", () => {
            if (!this.isPopupActive) {
                this.showPopup("cam-lapangan", "Tidak ada orang disini");
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

        // Popup setup
        this.createPopup();
    }

    // Show guard selection UI
    showGuardSelection() {
        this.isPopupActive = true;

        const guardMenuContainer = this.add.container(640, 360);
        // Background with outline

        const background = this.add
            .rectangle(0, 0, 700, 500, 0x282828)
            .setOrigin(0.5)// Background with outline
            .setStrokeStyle(4, 0x98cc92) // Adding outline with green color
            .setDepth(1); // Lower depth
        guardMenuContainer.add(background);

        const titleText = createText(this, -100, -220, "Pilih Personil", "24px", "#98cc92");
        guardMenuContainer.add(titleText);

        this.guards.forEach((guard, index) => {
            const guardButton = createText(this, 
                -300 + (index % 2) * 300,
                -150 + Math.floor(index / 2) * 50,
                `${guard.name} - HP: ${guard.health}, DMG: ${guard.damage}`,
                "18px",
                "#ffffff",
                "#444"
            )
                .setInteractive()
                .setPadding(10, 5, 10, 5);

            guardButton.on("pointerover", () => guardButton.setStyle({ backgroundColor: "#666", color: "#98cc92" }));
            guardButton.on("pointerout", () => guardButton.setStyle({ backgroundColor: "#444", color: "#ffffff" }));
            guardButton.on("pointerdown", () => {
                this.isPopupActive = false;
                guardMenuContainer.destroy();
                this.showGuardPopup(guard.name, `HP: ${guard.health}\nDamages: ${guard.damage}`)
            });

            guardMenuContainer.add(guardButton);
        });

        const closeButton = createButton(this, 300, -220, "X", () => {
            this.isPopupActive = false;
            guardMenuContainer.destroy();
        });
        guardMenuContainer.add(closeButton);

        guardMenuContainer.setDepth(2); // Ensure it's behind the popup
    }

    // Show popup UI for guard information
    showGuardPopup(title) {
        this.isPopupActive = true;

        const roomNames = [
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
        const guardPopupContainer = this.add.container(640, 360);

        const background = this.add
            .rectangle(0, 0, 700, 400, 0x282828)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0x98cc92); // Add outline
        guardPopupContainer.add(background);

        const titleText = createText(this, 0, -160, `Check: ${title}`, "24px", "#98cc92");
        guardPopupContainer.add(titleText);

        roomNames.forEach((room, index) => {
            const button = createText(this, 
                -200 + (index % 3) * 200, // Positioning buttons in 3 columns
                -80 + Math.floor(index / 3) * 50, // Rows based on index
                room,
                "18px",
                "#ffffff",
                "#444"
            )
                .setInteractive()
                .setPadding(10, 5, 10, 5);

            button.on("pointerover", () => button.setStyle({ backgroundColor: "#666", color: "#98cc92" }));
            button.on("pointerout", () => button.setStyle({ backgroundColor: "#444", color: "#ffffff" }));
            button.on("pointerdown", () => {
                this.isPopupActive = false;
                guardPopupContainer.destroy();
                this.showPopup(`Checking ${room}`, `Siap laksanakan, ${title} otw ke ${room}.`)
            }).setDepth(4);

            guardPopupContainer.add(button);
        });

        const closeButton = createButton(this, 300, -160, "X", () => {
            this.isPopupActive = false;
            guardPopupContainer.destroy();
        });
        guardPopupContainer.add(closeButton).setDepth(3);
    }



    showAllGuardsActions() {
        this.isPopupActive = true;

        const allGuardsMenu = this.add.container(640, 360);
        const background = this.add
            .rectangle(0, 0, 700, 300, 0x282828)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0x98cc92); // Adding outline with green color;
        allGuardsMenu.add(background);

        const titleText = createText(this, 0, -120, "Semua Personil", "24px", "#98cc92");
        allGuardsMenu.add(titleText);

        // Create "Berpencar" Button
        const scatterButton = createText(this, 
            0,
            -50,
            "Berpencar",
            "20px",
            "#ffffff",
            "#444"
        )
            .setInteractive()
            .setPadding(10, 5, 10, 5);
        scatterButton.on("pointerover", () => scatterButton.setStyle({ backgroundColor: "#666", color: "#98cc92" }));
        scatterButton.on("pointerout", () => scatterButton.setStyle({ backgroundColor: "#444", color: "#ffffff" }));
        scatterButton.on("pointerdown", () => {
            this.isPopupActive = false;
            allGuardsMenu.destroy();
            this.showPopup("Berpencar", "Semua personil sedang berpencar.");
        });
        allGuardsMenu.add(scatterButton);

        // Create "Kembali ke Barak" Button
        const regroupButton = createText(this, 
            0,
            50,
            "Kembali ke Barak",
            "20px",
            "#ffffff",
            "#444"
        )
            .setInteractive()
            .setPadding(10, 5, 10, 5);
        regroupButton.on("pointerover", () => regroupButton.setStyle({ backgroundColor: "#666", color: "#98cc92" }));
        regroupButton.on("pointerout", () => regroupButton.setStyle({ backgroundColor: "#444", color: "#ffffff" }));
        regroupButton.on("pointerdown", () => {
            this.isPopupActive = false;
            allGuardsMenu.destroy();
            this.showPopup("Kembali ke Barak", "Semua personil kembali ke barak.");
        });
        allGuardsMenu.add(regroupButton);

        // Add a Close Button
        const closeButton = createButton(this, 300, -120, "X", () => {
            this.isPopupActive = false;
            allGuardsMenu.destroy();
        });
        allGuardsMenu.add(closeButton);
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
        const buttonConfig = [
            {
                text: "Pilih Personil",
                callback: () => { this.walkieTalkieMenu.destroy(); this.showGuardSelection() },
            },
            {
                text: "Semua Personil",
                callback: () => { this.walkieTalkieMenu.destroy(); this.showAllGuardsActions() },
            },
        ];

        this.walkieTalkieMenu = createMenu(this, 640, 460, buttonConfig);
    }


    // Hide walkie-talkie menu buttons
    hideWalkieTalkieMenu() {
        if (this.walkieTalkieMenu) {
            this.walkieTalkieMenu.destroy();
        }
    }

    // Show the popup
    showPopup(title, content) {
        this.isPopupActive = true;
        this.popupElements.setVisible(true).setDepth(3);
        const [background, titleText, contentText] = this.popupElements.list;
        titleText.setText(title);
        contentText.setText(content);
    }

    // Hide the popup and return to walkie-talkie scene B
    hidePopup() {
        this.isPopupActive = false;
        this.popupElements.setVisible(false);
    }

    // Create popup elements
    createPopup() {
        this.popupElements = createWindows(this, 640, 360, 500, 300, "", "", () => this.hidePopup());
        this.hidePopup();
    }

    

    
}