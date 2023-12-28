const CHARGE_THRESHOLD = 700;

export class Benjamin {
  scene!: Phaser.Scene;
  guy!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  isForward = true;
  isAttacking = false;
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

    this.scene.load.spritesheet("charge_ss", "character/charge.png", {
      frameWidth: 126,
      frameHeight: 39,
    });

    this.scene.load.spritesheet("attack_ss", "character/attack.png", {
      frameWidth: 126,
      frameHeight: 39,
    });
  }

  create() {
    this.guy = this.scene.physics.add.sprite(100, 450, "run_ss");

    this.guy.setBounce(0.2);
    this.guy.setCollideWorldBounds(true);
    this.guy.setScale(3);
    this.guy.setBodySize(20, 30, true);

    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("idle_ss", {
        start: 0,
        end: 4,
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("run_ss", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "charge",
      frames: this.scene.anims.generateFrameNumbers("charge_ss", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("attack_ss", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
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
        this.guy.setFlipX(this.isForward);
        this.guy.setVelocityX(0);
        this.guy.anims.play("charge", true);
        if (this.chargeStart === null || this.isAttacking) {
          this.chargeStart = time;
        }
        const duration = time - this.chargeStart;
        if (duration >= CHARGE_THRESHOLD && !this.isAttacking) {
          this.isAttacking = true;
          this.guy.setFlipX(this.isForward);
          this.guy.anims
            .startAnimation("attack")
            .on("animationcomplete", () => {
              this.isAttacking = false;
            });
        }
      } else if (cursors.left.isDown) {
        this.isForward = true;
        this.guy.setFlipX(this.isForward);
        this.guy.setVelocityX(-160);
        this.guy.anims.play("run", true);
      } else if (cursors.right.isDown) {
        this.isForward = false;
        this.guy.setFlipX(this.isForward);
        this.guy.setVelocityX(160);
        this.guy.anims.play("run", true);
      } else {
        this.guy.setVelocityX(0);
        this.guy.anims.play("idle", true);
      }
    }
  }
}
