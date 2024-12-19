import { LoadingScene } from './scenes/scene_loading';
import { MenuScene } from './scenes/scene_menu';
import { GameScene } from './scenes/scene_game';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#282828',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        LoadingScene,
        MenuScene,
        GameScene,
    ]
};

export default new Phaser.Game(config);
