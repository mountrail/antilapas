import { createButton } from "./button1.js";
// Create menu buttons
export function createMenu2(scene, x, y, buttonsConfig) {
    const menuContainer = scene.add.container(x, y);

    buttonsConfig.forEach((button, index) => {
        const column = index % 2; // Determine column (0 or 1)
        const row = Math.floor(index / 2); // Determine row

        const buttonSet = createButton(
            scene,
            column * 300, // Column position, adjust 150 for column width
            row * 50,     // Row position, adjust 50 for row height
            button.text,
            button.callback
        );

        // Set the button's origin to top-left for proper alignment
        buttonSet.setInteractive().setOrigin(0, 0).setPadding(10, 5, 10, 5);

        // Add the button to the menu container
        menuContainer.add(buttonSet);
    });

    return menuContainer;
}
