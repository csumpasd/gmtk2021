const gameObstacleSpeed = 2;
const playerSpeed = 5;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with heldK
const arrowKeys = [38, 37, 40, 39];

let gameObstacles = [];
let frame = 0;
let x = false;

// called on body load
function init() {
  playerRed = new player(10, 50, 50, wasdKeys, "red");
  playerBlue = new player(10, 150, 50, arrowKeys, "blue");
  gameArea.init();
}


function player(x, y, diameter, keys, color) {
  this.x = x;
  this.y = y;
  this.d = diameter;
  this.keys = keys;
  this.dir = 0;
  this.vel = 0;

  this.update = function() {
    //movement
    let forceX = 0;
    let forceY = 0;

    if ( held[this.keys[0]] ) {
      forceY -= 1;
    }
    if ( held[this.keys[1]] ) {
      forceX -= 1;
    }
    if ( held[this.keys[2]] ) {
      forceY += 1;
    }
    if ( held[this.keys[3]] ) {
      forceX += 1;
    }

    let forceLength = Math.sqrt(Math.pow(forceX, 2) + Math.pow(forceY, 2));
    if (forceX != 0) {
      forceX /= forceLength;
    }
    if (forceY != 0) {
      forceY /= forceLength;
    }

    forceX *= playerSpeed;
    forceY *= playerSpeed;





    this.x += forceX;
    this.y += forceY;

    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.x >= gameArea.canvas.width - this.d) {
      this.x = gameArea.canvas.width - this.d;
    }
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.y >= gameArea.canvas.height - this.d) {
      this.y = gameArea.canvas.height - this.d;
    }

    //drawing
    let ctx = gameArea.context;
    ctx.beginPath();
    ctx.arc(this.x+(this.d / 2), this.y+(this.d / 2), (this.d / 2), 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };
}



function obstacle(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.draw = function() {
    gameArea.context.fillStyle = color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  }
}


// called every frame
function gameLoop() {
  gameArea.clear();
  playerRed.update();
  playerBlue.update();

  frame++;

  // create new obstacles, 1-n chance of obstacle/frame
  if (frame >= 60 && x == false) {
    let obstacleX = Math.floor(Math.random() *(gameArea.canvas.width - 150));
    gameObstacles.push(new obstacle(obstacleX, 0, 150, 25, "white"));
    frame = 0;

    if (obstacleX >= (gameArea.canvas.width / 2)) {
      x = true;
    } else if (obstacleX < (gameArea.canvas.width / 2)) {
      x = false;
    }
  } else if (frame >= 60 && x == true){
    let obstacleX = Math.floor(Math.random() *((gameArea.canvas.width - 150) - gameArea.canvas.width / 2));
    gameObstacles.push(new obstacle(obstacleX, 0, 150, 25, "white"));
    frame = 0;

    if (obstacleX >= (gameArea.canvas.width / 2 + 150)) {
      x = true;
    } else if (obstacleX < (gameArea.canvas.width / 2)) {
      x = false;
    }
  }

  // go through every obstacle to move & draw it
  for (i = 0; i < gameObstacles.length; i += 1) {
    gameObstacles[i].y += gameObstacleSpeed;
    gameObstacles[i].draw();
  }

}
//Math.floor(Math.random() *
// create gamearea and canvas
let gameArea = {
  canvas : document.createElement("canvas"),
  init : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 50;

    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    this.interval = setInterval(gameLoop, 10);

  },
  clear : function() {
    this.context.fillStyle = "#1f2023";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
};








let held = []; // index is keycode, value is boolean storing if that key is pressed

window.addEventListener("keydown",
  function(e) {
    held[e.keyCode] = true;
    changeType = "d";
  },
false);

window.addEventListener("keyup",
  function(e) {
    held[e.keyCode] = false;
    changeType = "u";
  },
false);
