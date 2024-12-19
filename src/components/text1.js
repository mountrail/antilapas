export function createText(scene, x, y, text, fontSize, color, backgroundColor = null) {

    return scene.add.text(x, y, text, {
        fontSize,
        fontFamily: "JetBrainsMono",
        color,
        backgroundColor,
    });
}