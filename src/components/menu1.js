import { createButton } from "./button1.js";
// Create menu buttons
export function createMenu1(scene, x, y, buttonsConfig) {
    const menuContainer = scene.add.container(x, y);

    buttonsConfig.forEach((button, index) => {

        const buttonSet = createButton(scene, 0, index * 50, button.text, button.callback);
        buttonSet.setInteractive().setOrigin(0.5, 0);

        // Add the button to the menu container
        menuContainer.add(buttonSet);
    });

    return menuContainer;
}