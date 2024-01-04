import Phaser from "phaser";
import { Rec } from "./rec";
import { Droid } from "./droid";
import "./style.css";

const WIDTH = 720;
const HEIGHT = 480;

function getRelativePositionToCanvas(
  gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  camera: Phaser.Cameras.Scene2D.Camera
) {
  return {
    x: (gameObject.x - camera.worldView.x) * camera.zoom,
    y: (gameObject.y - camera.worldView.y) * camera.zoom,
  };
}

function shouldBackgroundMove(
  followedObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
) {
  return (
    followedObject.x > 30 + WIDTH / 2 && followedObject.x < 2130 - WIDTH / 2
  );
}

class Woods extends Phaser.Scene {
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  player = new Rec(this);
  baddies = [new Droid(this)];
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
    this.baddies.forEach((droid) => droid.preload());

    this.load.tilemapTiledJSON("map", "woods/level_1.json");
  }

  create() {
    const music = this.sound.add("theme");
    music.play();

    this.physics.world.setBounds(
      0,
      0,
      WIDTH * 3,
      HEIGHT,
      true,
      true,
      true,
      true
    );
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

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("platforms", "woods");
    const platforms = map.createLayer("dirt", tileset || "", 0, 0);

    this.player.create();
    this.baddies.forEach((droid) => droid.create());
    this.cameras.main.startFollow(this.player.guy, true, 1, 0);
    this.cameras.main.setBounds(0, 0, WIDTH * 3, HEIGHT);
    this.cameras.main.useBounds = true;
    // this.cameras.main.setDeadzone(200, 0);

    if (platforms) {
      platforms.setCollisionByExclusion([-1], true);
      this.physics.add.collider(platforms, this.player.guy);
      this.baddies.forEach((droid) =>
        this.physics.add.collider(platforms, droid.robot)
      );
    }
  }

  update(time: number) {
    // Player movement
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
        if (shouldBackgroundMove(this.player.guy)) {
          this.bg_1.tilePositionX -= 0.05;
          this.bg_2.tilePositionX -= 0.3;
          this.bg_3.tilePositionX -= 0.75;
        }
      } else if (cursors.right.isDown) {
        this.player.moveRight();
        if (shouldBackgroundMove(this.player.guy)) {
          this.bg_1.tilePositionX += 0.05;
          this.bg_2.tilePositionX += 0.3;
          this.bg_3.tilePositionX += 0.75;
        }
      } else {
        this.player.idle();
      }
    }

    // Droid movement
    this.baddies.forEach((droid) => droid.update(this.player, time));
  }
}

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
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
