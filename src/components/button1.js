import { createText } from "./text1";

export function createButton(scene, x, y, label, callback) {
    const button = createText(scene, x, y, label, "20px", "#98cc92", "#282828")
        .setPadding(10, 5, 10, 5)
        .setInteractive();

    button.on("pointerdown", callback);
    return button;
}