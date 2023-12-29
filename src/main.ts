import Phaser from "phaser";
import { Rec } from "./rec";
import "./style.css";

function getRelativePositionToCanvas(
  gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  camera: Phaser.Cameras.Scene2D.Camera
) {
  return {
    x: (gameObject.x - camera.worldView.x) * camera.zoom,
    y: (gameObject.y - camera.worldView.y) * camera.zoom,
  };
}

class Woods extends Phaser.Scene {
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  player = new Rec(this);
  bg_1!: Phaser.GameObjects.TileSprite;
  bg_2!: Phaser.GameObjects.TileSprite;
  bg_3!: Phaser.GameObjects.TileSprite;

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

    this.bg_1 = this.add
      .tileSprite(
        0,
        0,
        this.textures.get("bg_1").getSourceImage().width,
        this.textures.get("bg_1").getSourceImage().height,
        "bg_1"
      )
      .setOrigin(0)
      .setScrollFactor(0, 1);
    this.bg_2 = this.add
      .tileSprite(
        0,
        0,
        this.textures.get("bg_2").getSourceImage().width,
        this.textures.get("bg_2").getSourceImage().height,
        "bg_2"
      )
      .setOrigin(0)
      .setScrollFactor(0, 1);
    this.bg_3 = this.add
      .tileSprite(
        0,
        0,
        this.textures.get("bg_3").getSourceImage().width,
        this.textures.get("bg_3").getSourceImage().height,
        "bg_3"
      )
      .setOrigin(0)
      .setScrollFactor(0, 1);
    this.bg_1.setScale(
      this.cameras.main.width /
        this.textures.get("bg_1").getSourceImage().width,
      this.cameras.main.height /
        this.textures.get("bg_1").getSourceImage().height
    );
    this.bg_2.setScale(
      this.cameras.main.width /
        this.textures.get("bg_2").getSourceImage().width,
      this.cameras.main.height /
        this.textures.get("bg_2").getSourceImage().height
    );
    this.bg_3.setScale(
      this.cameras.main.width /
        this.textures.get("bg_3").getSourceImage().width,
      this.cameras.main.height /
        this.textures.get("bg_3").getSourceImage().height
    );

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
    this.cameras.main.startFollow(this.player.guy, true, 1, 0, -200, 200);
    this.cameras.main.setDeadzone(200, 0);
    this.add.text(0, 0, "Hello World", { font: '"Press Start 2P"' });
  }

  update(time: number) {
    const playerCameraPos = getRelativePositionToCanvas(
      this.player.guy,
      this.cameras.main
    ).x;
    if (this.player.isAttacking || this.player.isStartingCharge) {
      this.player.chargeStart = null;
      return;
    }
    if (this.player.scene.input.keyboard) {
      const cursors = this.player.scene.input.keyboard.createCursorKeys();
      if (cursors.space.isUp && this.player.chargeStart !== null) {
        this.player.chargeStart = null;
      }
      if (cursors.space.isDown) {
        if (!this.player.isCharging) {
          this.player.startCharge();
        } else {
          this.player.charge(time);
        }
      } else if (cursors.left.isDown) {
        this.player.moveLeft();
        if (playerCameraPos <= 101) {
          this.bg_1.tilePositionX -= 0.05;
          this.bg_2.tilePositionX -= 0.3;
          this.bg_3.tilePositionX -= 0.75;
        }
      } else if (cursors.right.isDown) {
        this.player.moveRight();
        if (playerCameraPos >= 299) {
          this.bg_1.tilePositionX += 0.05;
          this.bg_2.tilePositionX += 0.3;
          this.bg_3.tilePositionX += 0.75;
        }
      } else {
        this.player.idle();
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  zoom: 1,
  scene: Woods,
  backgroundColor: "#00000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

new Phaser.Game(config);
