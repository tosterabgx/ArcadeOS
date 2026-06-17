console.log("Space Invaders game loaded successfully!");

class GameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  checkCollision(obj) {
    return (this.x < obj.x + obj.width
      && this.x + this.width > obj.x
      && this.y < obj.y + obj.height
      && this.y + this.height > obj.y);
  }
}

class Bullet extends GameObject {
  constructor(x, y, width, height, color, dy) {
    super(x, y, width, height, color);
    this.dy = dy
  }

  update() {
    super.update(0, this.dy);
  }
}

class SpaceShip extends GameObject {
  constructor(x, y, width, height, color, canvasHeight) {
    super(x, y, width, height, color);

    this.canvasHeight = canvasHeight;

    this.bulletWidth = 4;
    this.bulletHeight = 8;
    this.bulletSpeed = 5;

    this.bulletColor = "#fff";

    this.bullets = [];
  }

  draw(ctx) {
    super.draw(ctx);

    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(ctx);
      this.bullets[i].update();

      if (this.bullets[i].y < 0 || this.bullets[i].y > this.canvasHeight) {
        this.bullets.splice(i, 1);
      }
    }
  }

  shoot() {
    this.bullets.push(new Bullet(
      this.x + this.width / 2 - this.bulletWidth / 2,
      this.y - this.bulletHeight,
      this.bulletWidth,
      this.bulletHeight,
      this.bulletColor,
      this.bulletSpeed
    ));
  }
}

class Player extends SpaceShip {
  constructor(x, y, width, height, color, canvasHeight, canvasWidth) {
    super(x, y, width, height, color, canvasHeight);
    this.canvasWidth = canvasWidth;

    this.bulletSpeed = -this.bulletSpeed;
  }

  update(dx, dy) {
    super.update(dx, dy);

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > this.canvasWidth) {
      this.x = this.canvasWidth - this.width;
    }
  }
}

class Asteroid {
  constructor(x, y, rockWidth, rockHeight, color, rockCount) {
    this.rocks = [];

    for (let i = 0; i < rockCount; i++) {
      for (let j = 0; j < rockCount; j++) {
        this.rocks.push(new GameObject(
          x + i * rockWidth,
          y + j * rockHeight,
          rockWidth,
          rockHeight,
          color
        ));
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rocks.length; i++) {
      this.rocks[i].draw(ctx);
    }
  }

  checkCollision(obj) {
    for (let i = 0; i < this.rocks.length; i++) {
      if (this.rocks[i].checkCollision(obj)) {
        return true;
      }
    }
    return false;
  }

  removeOnCollision(obj) {
    for (let i = 0; i < this.rocks.length; i++) {
      if (this.rocks[i].checkCollision(obj)) {
        this.rocks.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

let game = {};

game.canvas = document.querySelector("#space-invaders-canvas");
game.ctx = game.canvas.getContext("2d");

game.backgroundColor = "#110122";
game.playerColor = "#33ff00";
game.enemyColor = "#33ff00";
game.asteroidsColor = "#fff"

game.asteroidsCount = 8;
game.asteroidsRocks = 8;
game.asteroidsSpace = 85;

game.enemyLines = 8;
game.enemiesLine = 20;
game.enemySpace = 30;
game.enemyFireRate = 300;
game.enemyFireTimer = 0;
game.enemyDirection = 1;
game.enemyDownStep = 5;

game.playerSpeed = 5;

game.update = () => {
  game.ctx.fillStyle = game.backgroundColor;
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

  game.player.draw(game.ctx);

  for (let i = 0; i < game.asteroids.length; i++) {
    game.asteroids[i].draw(game.ctx);
  }

  for (let i = 0; i < game.enemies.length; i++) {
    game.enemies[i].draw(game.ctx);
    game.enemies[i].update(game.enemyDirection, 0);
  }

  if (game.enemies.length == 0) {
    game.restart();
  }

  if (game.enemyDirection == 1) {
    let closestToRightEnemy = game.enemies[0];
    for (let i = 1; i < game.enemies.length; i++) {
      if (game.enemies[i].x > closestToRightEnemy.x) {
        closestToRightEnemy = game.enemies[i];
      }
    }

    if (closestToRightEnemy.x + closestToRightEnemy.width > game.canvas.width) {
      game.enemyDirection = -1;

      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].update(0, game.enemyDownStep);
      }
    }
  } else {
    let closestToLeftEnemy = game.enemies[0];
    for (let i = 1; i < game.enemies.length; i++) {
      if (game.enemies[i].x < closestToLeftEnemy.x) {
        closestToLeftEnemy = game.enemies[i];
      }
    }

    if (closestToLeftEnemy.x < 0) {
      game.enemyDirection = 1;

      for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].update(0, game.enemyDownStep);
      }
    }
  }

  game.enemyFireTimer += Math.random() * 10;
  if (game.enemyFireTimer > game.enemyFireRate) {
    game.enemyFireTimer = 0;
    game.enemies[Math.floor(Math.random() * game.enemies.length)].shoot();
  }

  for (let i = 0; i < game.player.bullets.length; i++) {
    for (let j = 0; j < game.asteroids.length; j++) {
      if (game.asteroids[j].removeOnCollision(game.player.bullets[i])) {
        game.player.bullets.splice(i, 1);
        break;
      }
    }
  }

  for (let i = 0; i < game.enemies.length; i++) {
    for (let j = 0; j < game.enemies[i].bullets.length; j++) {
      for (let k = 0; k < game.asteroids.length; k++) {
        if (game.asteroids[k].removeOnCollision(game.enemies[i].bullets[j])) {
          game.enemies[i].bullets.splice(j, 1);
          break;
        }
      }
    }
  }

  for (let i = 0; i < game.player.bullets.length; i++) {
    for (let j = 0; j < game.enemies.length; j++) {
      if (game.enemies[j].checkCollision(game.player.bullets[i])) {
        game.enemies.splice(j, 1);
        game.player.bullets.splice(i, 1);
        break;
      }
    }
  }

  for (let i = 0; i < game.enemies.length; i++) {
    for (let j = 0; j < game.enemies[i].bullets.length; j++) {
      if (game.player.checkCollision(game.enemies[i].bullets[j])) {
        game.restart();
        break;
      }
    }
  }

  for (let i = 0; i < game.enemies.length; i++) {
    if (game.enemies[i].y + game.enemies[i].height > game.player.y) {
      game.restart();
      break;
    }
  }
}

game.keydown = (e) => {
  if (e.keyCode == 37 || e.keyCode == 65) {
    game.player.update(-game.playerSpeed, 0);
  } else if (e.keyCode == 39 || e.keyCode == 68) {
    game.player.update(game.playerSpeed, 0);
  } else if (e.keyCode == 32) {
    game.player.shoot();
  }
}

game.init = () => {
  window.onkeydown = game.keydown;

  game.interval = setInterval(game.update, 1000 / 60);

  game.player = new Player(
    game.canvas.width / 2 - 50,
    game.canvas.height - 50,
    20,
    20,
    game.playerColor,
    game.canvas.height,
    game.canvas.width
  );

  game.asteroids = [];
  for (let i = 0; i < game.asteroidsCount; i++) {
    game.asteroids.push(new Asteroid(
      game.asteroidsSpace + i * game.asteroidsSpace,
      game.canvas.height - 180,
      5,
      5,
      game.asteroidsColor,
      game.asteroidsRocks
    ));
  }

  game.enemies = [];
  for (let i = 0; i < game.enemyLines; i++) {
    for (let j = 0; j < game.enemiesLine; j++) {
      game.enemies.push(new SpaceShip(
        game.enemySpace + j * game.enemySpace,
        game.enemySpace + i * game.enemySpace,
        20,
        20,
        game.enemyColor,
        game.canvas.height
      ));
    }
  }
}

game.stop = () => {
  window.onkeydown = null;
  clearInterval(game.interval);
}

game.restart = () => {
  game.stop();
  game.init();
}
