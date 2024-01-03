const CHARGE_THRESHOLD = 300;

export class Rec {
  scene!: Phaser.Scene;
  guy!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  isForward = false;
  isAttacking = false;
  isStartingCharge = false;
  isCharging = false;
  chargeStart: number | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload() {
    this.scene.load.spritesheet("idle_ss", "character/idle.png", {
      frameWidth: 126,
      frameHeight: 39,
    });

    this.scene.load.spritesheet("run_ss", "character/run.png", {
      frameWidth: 126,
      frameHeight: 39,
    });

    this.scene.load.spritesheet(
      "start_charge_ss",
      "character/start_charge.png",
      {
        frameWidth: 126,
        frameHeight: 39,
      }
    );

    this.scene.load.spritesheet("charge_ss", "character/charge.png", {
      frameWidth: 126,
      frameHeight: 39,
    });

    this.scene.load.spritesheet("attack_ss", "character/attack.png", {
      frameWidth: 126,
      frameHeight: 39,
    });

    this.scene.load.spritesheet("death_ss", "character/death.png", {
      frameWidth: 126,
      frameHeight: 39,
    });

    this.scene.load.spritesheet("hit_ss", "character/hit.png", {
      frameWidth: 126,
      frameHeight: 39,
    });
  }

  create() {
    this.guy = this.scene.physics.add.sprite(100, 350, "run_ss");

    this.guy.setBounce(0.2);
    this.guy.setCollideWorldBounds(true);
    this.guy.setScale(3);
    this.guy.setBodySize(20, 30, true);

    const FRAME_RATE = 10;
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("idle_ss", {
        start: 0,
        end: 4,
      }),
      frameRate: FRAME_RATE / 2,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("run_ss", {
        start: 0,
        end: 7,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "start_charge",
      frames: this.scene.anims.generateFrameNumbers("start_charge_ss", {
        start: 0,
        end: 1,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "charge",
      frames: this.scene.anims.generateFrameNumbers("charge_ss", {
        start: 0,
        end: 3,
      }),
      frameRate: FRAME_RATE,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("attack_ss", {
        start: 0,
        end: 7,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "hit",
      frames: this.scene.anims.generateFrameNumbers("hit_ss", {
        start: 0,
        end: 1,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "death",
      frames: this.scene.anims.generateFrameNumbers("death_ss", {
        start: 0,
        end: 4,
      }),
      frameRate: FRAME_RATE,
      repeat: 0,
    });
  }

  update(time: number) {
    if (this.isAttacking) {
      this.chargeStart = null;
      return;
    }
    if (this.scene.input.keyboard) {
      const cursors = this.scene.input.keyboard.createCursorKeys();
      if (cursors.space.isUp && this.chargeStart !== null) {
        this.chargeStart = null;
      }
      if (cursors.space.isDown) {
        this.charge(time);
      } else if (cursors.left.isDown) {
        this.moveLeft();
      } else if (cursors.right.isDown) {
        this.moveRight();
      } else {
        this.idle();
      }
    }
  }

  attack() {
    this.isAttacking = true;
    this.guy.setFlipX(this.isForward);
    this.guy.anims.startAnimation("attack").on("animationcomplete", () => {
      this.isAttacking = false;
      this.isCharging = false;
      this.isStartingCharge = false;
    });
  }

  startCharge() {
    this.isStartingCharge = true;
    this.guy.setFlipX(this.isForward);
    this.guy.setVelocityX(0);
    this.guy.anims
      .startAnimation("start_charge")
      .on("animationcomplete", () => {
        this.isAttacking = false;
        this.isStartingCharge = false;
        this.charge(null);
      });
  }

  charge(time: number | null) {
    this.isCharging = true;
    this.guy.setFlipX(this.isForward);
    this.guy.setVelocityX(0);
    this.guy.anims.play("charge", true);
    if (time !== null) {
      if (this.chargeStart === null || this.isAttacking) {
        this.chargeStart = time;
      }

      const duration = time - this.chargeStart;
      if (duration >= CHARGE_THRESHOLD && !this.isAttacking) {
        this.attack();
      }
    }
  }

  moveLeft() {
    this.isForward = true;
    this.guy.setFlipX(this.isForward);
    this.guy.setVelocityX(-160);
    this.guy.anims.play("run", true);
  }

  moveRight() {
    this.isForward = false;
    this.guy.setFlipX(this.isForward);
    this.guy.setVelocityX(160);
    this.guy.anims.play("run", true);
  }

  idle() {
    this.guy.setVelocityX(0);
    this.guy.anims.play("idle", true);
  }
}
