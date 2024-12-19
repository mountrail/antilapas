import { createButton } from "./button1.js";
// Create menu buttons
export function createMenu(scene, x, y, buttonsConfig) {
    const menuContainer = scene.add.container(x, y);

    buttonsConfig.forEach((button, index) => {
        
        const buttonText = createButton(scene, 0, index * 50, button.text, button.callback);
        buttonText.setInteractive().setOrigin(0.5, 0);
        
        // Add the button to the menu container
        menuContainer.add(buttonText);
    });

    return menuContainer;
}