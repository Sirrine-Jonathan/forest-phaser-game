import Phaser from "phaser";
import { Benjamin } from "./benjamin";

class Woods extends Phaser.Scene {
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  player = new Benjamin(this);

  preload() {
    this.load.setBaseURL("");

    this.load.image("bg_1", "woods/background/background_layer_1.png");
    this.load.image("bg_2", "woods/background/background_layer_2.png");
    this.load.image("bg_3", "woods/background/background_layer_3.png");
    this.load.image("woods", "woods/tileset.png");

    this.player.preload();
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    let bg_1 = this.add.image(centerX, centerY, "bg_1");
    let bg_2 = this.add.image(centerX, centerY, "bg_2");
    let bg_3 = this.add.image(centerX, centerY, "bg_3");
    let scaleX = this.cameras.main.width / bg_1.width;
    let scaleY = this.cameras.main.height / bg_1.height;
    let scale = Math.max(scaleX, scaleY);
    bg_1.setScale(scale).setScrollFactor(0);
    bg_2.setScale(scale).setScrollFactor(0);
    bg_3.setScale(scale).setScrollFactor(0);

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
      map.createLayer(0, tiles, 0, 0);
    }

    this.player.create();

    //  this.cameras.main.startFollow(this.player.guy, false, 0.1, 0.1, 0, 0);
  }

  update(time: number) {
    this.player.update(time);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  zoom: 1,
  scene: Woods,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

new Phaser.Game(config);
