import { createText } from "./text1";

export function createButton(scene, x, y, label, callback) {
    const button = createText(scene, x, y, label, "18px", "#ffffff", "#444")
        .setPadding(10, 5, 10, 5)
        .setInteractive();
    button.on("pointerover", () => button.setStyle({ backgroundColor: "#666", color: "#98cc92" }));
    button.on("pointerout", () => button.setStyle({ backgroundColor: "#444", color: "#ffffff" }));

    button.on("pointerdown", callback);
    return button;
}