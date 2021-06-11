import 'phaser';
import MainScene from './game';

const config = {
    width: 400,
    height: 600,
    type: Phaser.AUTO,
    audio: {
      disableWebAudio: true
    },
    physics: {
      default: 'arcade',
      arcade: {
        fps: 60,
        gravity: { y : 400 },
      }
    },
};

const game = new Phaser.Game(config);

game.scene.add('MainScene', MainScene);
game.scene.start('MainScene');
