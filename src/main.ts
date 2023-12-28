import Phaser from "phaser";
import { Benjamin } from "./benjamin";
import "./style.css";

class Woods extends Phaser.Scene {
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  player = new Benjamin(this);
  bg_1!: Phaser.GameObjects.Image;
  bg_2!: Phaser.GameObjects.Image;
  bg_3!: Phaser.GameObjects.Image;

  preload() {
    this.load.setBaseURL("");

    this.load.image("bg_1", "woods/background/background_layer_1.png");
    this.load.image("bg_2", "woods/background/background_layer_2.png");
    this.load.image("bg_3", "woods/background/background_layer_3.png");
    this.load.image("woods", "woods/tileset.png");

    this.load.audio("theme", ["audio/mushgroom_labyrinth.mp3"]);

    this.player.preload();
  }

  create() {
    const music = this.sound.add("theme");
    music.play();

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.bg_1 = this.add.image(centerX, centerY, "bg_1");
    this.bg_2 = this.add.image(centerX, centerY, "bg_2");
    this.bg_3 = this.add.image(centerX, centerY, "bg_3");
    let scaleX = this.cameras.main.width / this.bg_1.width;
    let scaleY = this.cameras.main.height / this.bg_1.height;
    let scale = Math.max(scaleX, scaleY);
    this.bg_1.setScale(scale).setScrollFactor(0);
    this.bg_2.setScale(scale).setScrollFactor(0);
    this.bg_3.setScale(scale).setScrollFactor(0);

    const level = [[14, 16, 16, 16, 16, 17]];
    const tileMapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
      data: level,
      tileWidth: 24,
      tileHeight: 24,
      width: 504,
      height: 360,
    };
    const map = this.make.tilemap(tileMapConfig);
    const tiles = map.addTilesetImage("woods");
    if (tiles) {
      // map.createLayer(0, tiles, 0, 0);
    }

    this.player.create();
    this.cameras.main.setBounds(0, 0, this.bg_1.width, this.bg_1.height);
    this.cameras.main.startFollow(this.player.guy, true, 1, 0, 0, 200);
  }

  update(time: number) {
    if (this.player.isAttacking) {
      this.player.chargeStart = null;
      return;
    }
    if (this.player.scene.input.keyboard) {
      const cursors = this.player.scene.input.keyboard.createCursorKeys();
      if (cursors.space.isUp && this.player.chargeStart !== null) {
        this.player.chargeStart = null;
      }
      if (cursors.space.isDown) {
        this.player.charge(time);
      } else if (cursors.left.isDown) {
        this.player.moveLeft();
        this.bg_1.x += 0.05;
        this.bg_2.x += 0.3;
        this.bg_3.x += 0.75;
      } else if (cursors.right.isDown) {
        this.player.moveRight();
        this.bg_1.x -= 0.05;
        this.bg_2.x -= 0.3;
        this.bg_3.x -= 0.75;
      } else {
        this.player.idle();
      }
    }
    this.player.update(time);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  zoom: 1,
  scene: Woods,
  backgroundColor: "#00000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  // canvas: (document.getElementById("canvas") || undefined) as
  //   | HTMLCanvasElement
  //   | undefined,
};

new Phaser.Game(config);
