import { Scene } from 'phaser';

export class LoadingScene extends Scene {
    constructor() {
        super("LoadingScene")
    }
    create() {
        this.add.text(30, 30, "Now Loading...", { fill: "yellow" });
        this.scene.start("MenuScene");
    }

}