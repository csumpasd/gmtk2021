const gameObstacleSpeed = 2;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with heldK
const arrowKeys = [38, 37, 40, 39];

let gameObstacles = [];

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

  this.update = function() {
    //movement

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

  // create new obstacles, 1-n chance of obstacle/frame
  if (Math.random() > 0.99) {
    let obstacleX = Math.floor(Math.random() * (gameArea.canvas.width - 30));
    gameObstacles.push(new obstacle(obstacleX, 100, 30, 10, "white"));
  }

  // go through every obstacle to move & draw it
  for (i = 0; i < gameObstacles.length; i += 1) {
    gameObstacles[i].y += gameObstacleSpeed;
    gameObstacles[i].draw();
  }

  showKeysInHtml();
}

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






















// display keys in html
function showKeysInHtml() {
  if ( held[wasdKeys[0]] ) {
    document.getElementById('w').innerHTML = "w"
  }
  else {
    document.getElementById('w').innerHTML = ""
  }


  if ( held[wasdKeys[1]] ) {
    document.getElementById('a').innerHTML = "a"
  }
  else {
    document.getElementById('a').innerHTML = ""
  }


  if ( held[wasdKeys[2]] ) {
    document.getElementById('s').innerHTML = "s"
  }
  else {
    document.getElementById('s').innerHTML = ""
  }


  if ( held[wasdKeys[3]] ) {
    document.getElementById('d').innerHTML = "d"
  }
  else {
    document.getElementById('d').innerHTML = ""
  }
}



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
