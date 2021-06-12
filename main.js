const obstacleSpeed = 2;
const obstacleWidth = 150;
const playerSpeed = 10;
const playerAccel = 0.3;
const friction = 0.985;
const frameLength = 10;

const saucerSize = 50;
const cowSize = 30;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with if ( held [] )

let gameObstacles = [];
let currentFrame = 0;
let currentSide = 0;

// called on body load
function init() {
  playerSaucer = new saucer(window.innerWidth/2 - saucerSize/2 , 300, saucerSize, wasdKeys);
  playerCow = new cow(window.innerWidth/2 - cowSize/2, window.innerHeight * 0.9 - cowSize/2, cowSize);
  gameArea.init();
}


// create gamearea and canvas
let gameArea = {
  canvas : document.createElement("canvas"),
  init : function() {
    this.canvas.width = window.innerWidth - window.innerWidth * 0.02;
    this.canvas.height = window.innerHeight - window.innerWidth * 0.02;

    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    this.interval = setInterval(gameLoop, frameLength);

  },
  clear : function() {
    this.context.fillStyle = "#1f2023";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
};


// called every frame
function gameLoop() {
  gameArea.clear();
  playerSaucer.update();
  playerCow.update();

  currentFrame += 1;

  if ( currentFrame % 60 == 0 ) {
    let obstacleX = Math.floor( Math.random() * ( gameArea.canvas.width/2 - obstacleWidth ) );
    gameObstacles.push( new obstacle( (obstacleX + ( currentSide % 2 * gameArea.canvas.width/2 ) ), -200, obstacleWidth, 25, "white") );
    currentSide += 1;
  }

  // go through every obstacle to move & draw it
  for (i = 0; i < gameObstacles.length; i += 1) {
    gameObstacles[i].y += obstacleSpeed;
    gameObstacles[i].draw();
  }

}


function saucer(x, y, size, keys) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.keys = keys;
  this.vx = 0;
  this.vy = 0;

  this.update = function() {

    let forceX = 0;
    let forceY = 0;
    // test for held keys
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

    // normalize force vector
    let forceLength = Math.sqrt(Math.pow(forceX, 2) + Math.pow(forceY, 2));
    if ( forceX != 0 ) {
      forceX /= forceLength;
    }
    if ( forceY != 0 ) {
      forceY /= forceLength;
    }

    // apply force to character
    if ( ( forceY < 0 ) && ( this.vy > -playerSpeed ) ){
      this.vy -= playerAccel;
    }
    if ( ( forceX < 0 ) && ( this.vx > -playerSpeed ) ){
      this.vx -= playerAccel;
    }
    if ( ( forceY > 0 ) && ( this.vy < playerSpeed ) ){
      this.vy += playerAccel;
    }
    if ( ( forceX > 0 ) && ( this.vx < playerSpeed ) ){
      this.vx += playerAccel;
    }

    this.vx *= friction;
    this.vy *= friction;

    this.x += this.vx;
    this.y += this.vy;

    testIfOutOfBounds(this);
    drawCircle(this);
  }
}


function cow(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.dir = 0;
  this.vel = 0;
  this.grav = 0;
  this.beam = false;

  this.update = function() {

    let dirX = (playerSaucer.x + playerSaucer.size/2 - playerCow.x - playerCow.size/2) * 0.5;
    let dirY = (playerSaucer.y + playerSaucer.size/2 - playerCow.y - playerCow.size/2) * 0.5;
    this.dir = Math.atan2(dirY, dirX);
    let saucerDistance = (Math.sqrt(Math.pow(playerSaucer.x - playerCow.x, 2) + Math.pow(playerSaucer.y - playerCow.y, 2)));

    if ( ( saucerDistance <= 300 ) && ( saucerDistance >= 100 ) && ( playerCow.y - playerSaucer.y >= 50 ) ) {
        this.vel = 2 * saucerDistance/100;
        this.beam = true;
    }
    else {
      this.vel /= 1.1;
      this.beam = false;
    }


    let velX = this.vel * Math.cos(this.dir);
    let velY = this.vel * Math.sin(this.dir);

    this.x += velX;
    this.y += velY;

    if ( this.beam == false ) {
      this.grav += 0.05;
      this.y += this.grav;
    }
    else {
      this.grav = 0;
    }

    let ctx = gameArea.context;
    ctx.strokeStyle = 'white';
    if ( this.beam == 1 ) {
      ctx.strokeStyle = 'red';
    }
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(playerCow.x + playerCow.size/2, playerCow.y + playerCow.size/2);
    ctx.lineTo(playerCow.x + playerCow.size/2 + Math.cos(this.dir) * 100, playerCow.y + playerCow.size/2 + Math.sin(this.dir) * 100);
    ctx.stroke();

    testIfOutOfBounds(this);
    drawCircle(this);
  }
}


function drawCircle(thingie) {
  let ctx = gameArea.context;
  ctx.beginPath();
  ctx.arc(thingie.x+(thingie.size / 2), thingie.y+(thingie.size / 2), (thingie.size / 2), 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
}


function testIfOutOfBounds(thingie) {
  if (thingie.x <= 0) {
    thingie.x = 0;
  }
  if (thingie.y <= 0) {
    thingie.y = 0;
  }
  if (thingie.x + thingie.size >= gameArea.canvas.width) {
    thingie.x = gameArea.canvas.width - thingie.size;
  }
  if (thingie.y + thingie.size >= gameArea.canvas.height) {
    thingie.y = gameArea.canvas.height - thingie.size;
  }
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

// TODO eztmegcsinalni
function ground(x, y, height) {
  this.x = x;
  this.y = y;
  this.width =
  this.height = height;
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
