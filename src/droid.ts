import { Rec } from "./rec";

export class Droid {
  scene!: Phaser.Scene;
  robot!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  isForward = false;
  isWaking = false;
  isAwake = false;
  isAttacking = false;
  isMoving = false;
  lastChange: number | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.spritesheet("droid_wake_ss", "droid_zapper/wake.png", {
      frameWidth: 31,
      frameHeight: 41,
    });

    this.scene.load.spritesheet("droid_run_ss", "droid_zapper/run.png", {
      frameWidth: 31,
      frameHeight: 41,
    });

    this.scene.load.spritesheet("droid_attack_ss", "droid_zapper/attack.png", {
      frameWidth: 31,
      frameHeight: 41,
    });
  }

  create() {
    this.robot = this.scene.physics.add.sprite(1000, 340, "droid_wake_ss");
    this.robot.setBounce(0.2);
    this.robot.setCollideWorldBounds(true);
    this.robot.setScale(2);
    this.robot.setBodySize(31, 41, true);

    const FRAME_RATE = 10;
    this.scene.anims.create({
      key: "droid_wake",
      frames: this.scene.anims.generateFrameNumbers("droid_wake_ss", {
        start: 0,
        end: 5,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "droid_run",
      frames: this.scene.anims.generateFrameNumbers("droid_run_ss", {
        start: 0,
        end: 5,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "droid_attack",
      frames: this.scene.anims.generateFrameNumbers("droid_attack_ss", {
        start: 0,
        end: 9,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
  }

  update(player: Rec, time: number) {
    console.log("-----update-----");
    if (
      !this.isAwake &&
      !this.isWaking &&
      !this.isAttacking &&
      !this.isMoving &&
      this.shouldAwake(player)
    ) {
      console.log("is awaking");
      this.isWaking = true;
      this.robot.anims
        .startAnimation("droid_wake")
        .on("animationcomplete", () => {
          console.log("finished waking");
          this.isAwake = true;
          this.isWaking = false;
          this.isAttacking = false;
          this.isMoving = false;
          this.lastChange = time;
        });
    } else if (this.isAwake && !this.isWaking) {
      if (this.shouldStopMoving(player)) {
        if (!this.isAttacking && this.lastChange == null) {
          console.log("is attacking");
          this.isAttacking = true;
          this.robot.anims
            .startAnimation("droid_attack")
            .on("animationcomplete", () => {
              console.log("finished attacking");
              this.isAwake = true;
              this.isWaking = false;
              this.isAttacking = false;
              this.isMoving = false;
              this.lastChange = time;
            });
        } else if (!this.isAttacking || this.isMoving) {
          this.stop();
          this.isMoving = false;
          console.log("waiting to attack");
        }
      } else {
        console.log("should not attack, just move");
        this.isMoving = true;
        this.isForward = this.getShouldMoveForward(player);
        if (this.isForward) {
          console.log("moving right");
          this.moveRight();
        } else {
          console.log("moving left");
          this.moveLeft();
        }
      }
    } else {
      console.log("idle");
      this.robot.setVelocityX(0);
      this.robot.setFlipX(!this.isForward);
    }
  }

  getShouldMoveForward(player: Rec) {
    return this.robot.x - player.guy.x < 0;
  }

  getDistance(player: Rec) {
    return Math.abs(this.robot.x - player.guy.x);
  }

  shouldAwake(player: Rec) {
    const distance = this.getDistance(player);
    return distance <= 200;
  }

  shouldStopMoving(player: Rec) {
    const distance = this.getDistance(player);
    // console.log({ distance, robot: this.robot.x, guy: player.guy.x });
    return distance <= 70;
  }

  moveRight() {
    this.isForward = true;
    this.robot.setFlipX(!this.isForward);
    this.robot.setVelocityX(140);
    this.robot.anims.play("droid_run", true);
  }

  moveLeft() {
    this.isForward = false;
    this.robot.setFlipX(!this.isForward);
    this.robot.setVelocityX(-140);
    this.robot.anims.play("droid_run", true);
  }

  stop() {
    this.robot.setVelocityX(0);
    this.robot.anims.stop();
  }
}
