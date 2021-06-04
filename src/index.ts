import 'phaser';
import sky from '../assets/sky.jpeg';
import ground from '../assets/ground.jpeg';
import obstacle from '../assets/obstacle.jpeg';

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
        gravity: {y : 0},
      }
    },
};

const game = new Phaser.Game(config);

class MainScene extends Phaser.Scene {
    private ground: Phaser.Physics.Arcade.StaticGroup;
    private obstacle: Phaser.Physics.Arcade.Group;

    constructor() {
        super('MainScene');
    }

     public preload(): void{
      this.loadAssets();
    }

     public create(): void {
        this.add.image(200, 300, 'sky').setScale(1.4);
        this.createGround();
    }

    public update(): void {
      this.moveBackground();
    }

    private loadAssets(): void {
      this.load.image('sky', sky);
      this.load.image('ground', ground);
      this.load.image('obstacle', obstacle);
    }

    private createGround() {
      this.ground = this.physics.add.staticGroup();
      for (let i = 0; i < 6; i++) {
        this.ground.create(i * 100, 500, 'ground').setScale(0.2).setOrigin(0, 0);
      }
    }

    private moveBackground(): void {
        this.ground.children.iterate((item: any) => {
          item.x -= 1;
          if (item.x === -100) {
            item.x = 500;
          }
          item.refreshBody();
        })
    }

    private createObstacle(): void {
      this.obstacle = this.physics.add.group();
      for (let i = 0; i < 10; i++) {
        this.obstacle.create(0, 50 * i, 'obstacle').setScale(0.1).setOrigin(0, 0);
      }
    }
}

game.scene.add('MainScene', MainScene);
game.scene.start('MainScene');
