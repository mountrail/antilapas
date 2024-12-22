import { createText } from "../components/text1";
import { createButton } from "../components/button1";

export class PopupWindow {
    constructor(scene, x, y, width, height, onOpen, onClose) {
        if (onOpen) onOpen();
        this.scene = scene;

        // Background with outline
        this.background = scene.add.rectangle(x, y, width, height, 0x282828)
            .setOrigin(0.5)
            .setStrokeStyle(4, 0x98cc92);

        // Title text
        this.titleText = createText(
            scene,
            x - width / 2 + 20, // Position at left edge with some padding
            y - height / 2 + 10, // Position near the top edge with some padding
            "",
            "22px",
            "#98cc92"
        );

        // Content container
        this.contents = scene.add.container(x, y);

        // Close button
        this.closeButton = createButton(
            scene,
            x + width / 2 - 40, // Position at the right edge with padding
            y - height / 2 + 10, // Position near the top edge with padding
            "X",
            () => {
                this.hide();
                if (onClose) onClose();
            }
        );

        // Container for all elements
        this.container = scene.add.container(0, 0, [
            this.background,
            this.titleText,
            this.contents,
            this.closeButton,
        ])
            .setDepth(3)
            .setVisible(false); // Initially hidden

        // this.isPopupActive = false; // Tracks popup state
    }



    show(title, content) {
        this.titleText.setText(title);
        this.contents.removeAll(true); // Clear previous content

        if (typeof content === "string") {
            // If content is a string, create and add text
            const contentText = createText(this.scene, 0, 0, content, "18px", "#ffffff").setOrigin(0.5);
            this.contents.add(contentText);
        } else if (content) {
            // If content is a Phaser object or container, add it directly
            this.contents.add(content);
        }

        this.container.setVisible(true);
        this.scene.isPopupActive = true;
    }


    hide() {
        this.container.setVisible(false);
        this.scene.isPopupActive = false;

    }


}
