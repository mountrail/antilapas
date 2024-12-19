import { createText } from "../components/text1";
import { createButton, } from "../components/button1";

export function createWindows(scene, x, y, width, height, title, content, onClose) {
    // Background with outline
    const background = scene.add.rectangle(x, y, width, height, 0x282828)
        .setOrigin(0.5)
        .setStrokeStyle(4, 0x98cc92); // Adding outline with green color

    // Title text
    const titleText = createText(scene, x - width / 2 + 20, y - height / 2 + 10, title, "22px", "#98cc92");

    // Content text
    const contentText = createText(scene, x, y, content, "18px", "#ffffff").setOrigin(0.5);

    // Close button
    const closeButton = createButton(scene, x + width / 2 - 40, y - height / 2 + 10, "X", onClose);

    // Container for all elements
    const container = scene.add.container(0, 0, [background, titleText, contentText, closeButton]);

    return container;
}