import 'phaser';
import sky from '../assets/sky.jpeg';
import ground from '../assets/ground.jpeg';
import obstacle from '../assets/obstacle.jpeg';
import bird from '../assets/bird.png';

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
        gravity: {y : 400},
      }
    },
};

const game = new Phaser.Game(config);

class MainScene extends Phaser.Scene {
    private ground: Phaser.Physics.Arcade.StaticGroup;
    private obstacles: Phaser.Physics.Arcade.StaticGroup[];
    private player: Phaser.Physics.Arcade.Sprite;
    private keyboard: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerRotation = 0;
    private readonly minimalVelocity = -240;
    private readonly velocityIncrease = 80;
    private collieded = false;

    constructor() {
        super('MainScene');
    }

     public preload(): void{
      this.loadAssets();
      this.keyboard = this.input.keyboard.createCursorKeys();
    }

     public create(): void {
        this.add.image(200, 300, 'sky').setScale(1.4);
        this.player = this.physics.add.sprite(200, 300, 'bird').setScale(2.4);
        this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 2}),
          frameRate: 10,
          repeat: -1,
        })
        this.player.anims.play('fly');
        this.createGround();
        this.createObstacles();
        this.physics.add.collider(this.player, this.ground);
    }

    public update(): void {
      if(!this.collieded) {
        this.moveBackground();
        this.moveObstacles();
        this.handleCollideObstacled();
      }
      this.handleControl();
    }

    private handleControl(): void {
      if (this.keyboard.space.isDown) {
        if (this.player.body.velocity.y >= this.minimalVelocity) {
          if (!this.collieded) {
            this.player.setVelocityY(this.player.body.velocity.y - this.velocityIncrease);
          }

          if(this.playerRotation >= -1) {
            this.setPlayerRotation();
          }
        }
      }
      if (this.playerRotation <= 1 && this.keyboard.space.isUp) {
        this.setPlayerRotation();
      }
    }

    private setPlayerRotation(): void {
      this.playerRotation = this.player.body.velocity.y * 0.003 
      this.player.setRotation(this.playerRotation);
    }

    private loadAssets(): void {
      this.load.image('sky', sky);
      this.load.image('ground', ground);
      this.load.image('obstacle', obstacle);
      this.load.spritesheet('bird', bird, {frameWidth: 18, frameHeight: 18, spacing: 11});
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
      this.obstacles = [this.physics.add.staticGroup(), this.physics.add.staticGroup()];
      this.obstacles.forEach(this.configureObstacle);
      this.obstacles[0].children.iterate(({x, y}: any) => console.log(x, y))
    }

    private configureObstacle(obstacle: Phaser.Physics.Arcade.StaticGroup, obstacleIndex: number): void {
      const startOfGap = Math.floor(Math.random() * 6) + 3;

        for (let i = 0; i < 10; i++) {
          if(i === startOfGap || i+1 === startOfGap || i+2 === startOfGap) {
            continue;
          }
        obstacle.create(400 + obstacleIndex * 250 , 50 * i, 'obstacle').setScale(0.1).setOrigin(0, 0).refreshBody();
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

    private handleCollideObstacled(): void {
      this.obstacles.forEach((obstacle) => {
        obstacle.children.iterate((item: any) => {
         if (this.checkIfCollide(this.player, item)) {
           this.collieded = true;
         }
        })
      })
    }

    private checkIfCollide(player: Phaser.Physics.Arcade.Sprite, obstacle: any): boolean {
      const playerBounds = player.getBounds();
      const obstacleBounds = obstacle.getBounds();

      return Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, obstacleBounds);
    }
}

game.scene.add('MainScene', MainScene);
game.scene.start('MainScene');
