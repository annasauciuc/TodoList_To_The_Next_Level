import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.width = 40;
    this.height = 40;    
    var spin = this.animations.add('spin');
    this.animations.play('spin', 3, true);
  }

  update () {
    // this.angle += 1
  }
}
