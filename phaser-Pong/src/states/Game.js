/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'
import { Sound } from 'phaser-ce';

export default class extends Phaser.State {
  init() { }

  preload() {
  }

  update() {
    const H = game.height;
    const W = game.width;

    // PLAYER 1
    if (this.wKey.isDown && this.player1.y >= 20) {
      this.player1.y -= 15;
    } else if (this.sKey.isDown && this.player1.y <= H - 20 - 100){
      this.player1.y += 15;
    }

    //PLAYER 2
    if (this.uKey.isDown && this.player2.y >= 20) {
      this.player2.y -= 15;
    } else if (this.dKey.isDown && this.player2.y <= H - 20 - 100){
      this.player2.y += 15;
    }

    //BALL
    if (this.ball.y <= 20 || this.ball.y >= H - 20 - 40){
      this.ballMoveY *= -1;
      // mySound.play();
    }
    function sound(src) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "none");
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
      this.play = function(){
          this.sound.play();
      }
      this.stop = function(){
          this.sound.pause();
      }    
  }
  const mySound = new sound('assets/pong-sound.mp3');
  const leftBounded = this.ball.x <= 40 + 20;
  const rightBounded = this.ball.x >= W - 20 - 40 - 40;

  const p1Hits = this.player1.y < this.ball.y + this.ball.height && this.player1.y + this.player1.height > this.ball.y;
  const p2Hits = this.player2.y < this.ball.y+this.ball.height && this.player2.y + this.player2.height > this.ball.y;
  
  if((leftBounded && p1Hits || rightBounded && p2Hits) && !this.scored) {
    this.ballMoveX *= -1;
    mySound.play();

  } else if (leftBounded && !p1Hits) {
  this.scored = true;
  this.onScore.dispatch(2);
  //mySound.play();

  } else if (rightBounded && !p2Hits) {
    this.scored = true;
    this.onScore.dispatch(1);
    //mySound.play();
  }

  this.ball.x += this.ballMoveX;
  this.ball.y += this.ballMoveY;
}
  create() {
    // ball = game.add.sprite(150, 600, 'ball');
    // ball.animation.add('spin');
    // this.ball.animation.play('spin', 5, true);
    

    this.ball = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ball'
    });

    this.game.add.existing(this.ball);
    this.onScore = new Phaser.Signal();
    this.player1Score = 0;
    this.player2Score = 0;
    this.ballSpeed = 10;

    const H = game.height;
    const W = game.width;  

    const walls = game.add.group();

    this.uKey = game.input.keyboard.addKey(Phaser.Keyboard.UP); 
    this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN); 

    this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W); 
    this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S); 

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);


    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.UP, 
      Phaser.Keyboard.DOWN, 
      Phaser.Keyboard.W, 
      Phaser.Keyboard.S, 
      Phaser.Keyboard.SPACEBAR
    ]);

    this.globalScore = this.add.text(this.world.centerX, 80, `${this.player1Score}-${this.player2Score}`, {
      font: '100px Courier',
      fill: '#FFFFFF',
    });

    this.globalScore.anchor.setTo(0.5);
    const createRectangle = (x, y , width, height, color, parent) => {
      const graphics = game.add.graphics(x, y);
      graphics.beginFill(color);
      graphics.drawRect( 0, 0, width, height);
      graphics.endFill();
      if (parent) {
        parent.add(graphics);
      }
      return graphics;
    }
    createRectangle (0, 0, W, 20, 0xFFFFFF, walls);
    createRectangle (0, H - 20, W, 20, 0xFFFFFF, walls);
    this.player1 = createRectangle(40, (H / 2) - 50, 20, 100, 0xFFFFFF);
    this.player2 = createRectangle(W - 40, (H / 2) - 50, 20, 100, 0xFFFFFF);

    //this.ball = createRectangle((W / 2) - 20, (H / 2) - 20, 40, 40, 0xFFFFFF);

    this.prepareGame();
  }

  setScore(player) {
    if (player === 1) {
      this.player1Score++;
    }else {
      this.player2Score++;
    }

    this.globalScore.setText(`${this.player1Score}-${this.player2Score}`);
    game.time.events.add(900, this.prepareGame, this);

    if (this.player1Score == 10) {
      this.globalScore.setText('Player 1 won')
    } else  if (this.player2Score == 10) {
      this.globalScore.setText('Player 2 won')
    }
    
  }

  prepareGame() {
    this.ball.position.setTo((game.width / 2) - 20, (game.height / 2) -20);
    this.ballMoveX = 0;
    this.ballMoveY = 0;
    this.onScore.addOnce(this.setScore, this);
    this.scored = false;
    this.player1.position.setTo((40), (game.height / 2) - 50);
    this.player2.position.setTo((game.width - 40), (game.height / 2) - 50);

    this.spaceKey.onDown.addOnce(() => {
      this.ballMoveX = Math.round(Math.random(1)) ? this.ballSpeed : -this.ballSpeed;
      this.ballMoveY = Math.round(Math.random(1)) ? this.ballSpeed : -this.ballSpeed;
    
    }, this);

    this.pauseKey.onDown.addOnce(() => {
      this.ballMoveX = 0;
      this.ballMoveY = 0;
    }, this);
  }
}
