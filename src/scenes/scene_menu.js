import { Scene } from 'phaser';
import { createText } from "../components/text1";
// Define the Menu Scene
export class MenuScene extends Scene {
    constructor() {
        super({ key: "MenuScene" });
    }

    preload() {
        this.load.image("background", "assets/background.png");
        this.load.font("JetBrainsMono", "assets/fonts/JetBrainsMono-Bold.woff2");
    }

    create() {
        // Add background image
        this.add
            .image(0, 0, "background")
            .setOrigin(0, 0)
            .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Add title text
        createText(this, 640, 200, "Simulasi Manajemen Lapas", "32px", "#98cc92").setOrigin(0.5);

        // Add play button with interactive effects
        const playButton = this.createButton(640, 400, "Main", () => this.scene.start("GameScene"));
        playButton.setOrigin(0.5);

        // Add footer text
        createText(this, 640, 500, "© 2024 Gunner Studio", "16px", "#98cc92").setOrigin(0.5);
    }

    createButton(x, y, label, callback) {
        const button = createText(this, x, y, label, "28px", "#98cc92", "#444")
            .setPadding(20, 10, 20, 10)
            .setInteractive();

        button.on("pointerover", () => button.setStyle({ backgroundColor: "#666", color: "#ffffff" }));
        button.on("pointerout", () => button.setStyle({ backgroundColor: "#444", color: "#98cc92" }));
        button.on("pointerdown", callback);

        return button;
    }
}