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
    private obstacles: Phaser.Physics.Arcade.Group[];

    constructor() {
        super('MainScene');
    }

     public preload(): void{
      this.loadAssets();
    }

     public create(): void {
        this.add.image(200, 300, 'sky').setScale(1.4);
        this.createGround();
        this.createObstacles();
    }

    public update(): void {
      this.moveBackground();
      this.moveObstacles();
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

    private createObstacles(): void {
      this.obstacles = [this.physics.add.group(), this.physics.add.group()];
      this.obstacles.forEach(this.configureObstacle);
    }

    private configureObstacle(obstacle: Phaser.Physics.Arcade.Group, obstacleIndex: number): void {
      const startOfGap = Math.floor(Math.random() * 7) + 2;

        for (let i = 0; i < 10; i++) {
          if(i === startOfGap || i+1 === startOfGap) {
            continue;
          }
        obstacle.create(400 + obstacleIndex * 250 , 50 * i, 'obstacle').setScale(0.1).setOrigin(0, 0);
      };

    }

    private moveObstacles(): void {
      this.obstacles.forEach(obstacle => {
        obstacle.setX(obstacle.getFirst(true).x - 1);
        if(obstacle.getFirst(true).x === -50) {
          obstacle.clear();
          this.configureObstacle(obstacle, 0)
        }
      })
    }
}

game.scene.add('MainScene', MainScene);
game.scene.start('MainScene');
