const obstacleSpeed = 2;
const obstacleWidth = 150;
const playerSpeed = 10;
const playerAccel = 0.3;
const friction = 0.985;
const frameLength = 10;

const saucerWidth = 120;
const saucerRatio = 754/538;
const saucerHeight = saucerWidth / saucerRatio;

const cloudWidht = 200;
const cloudRatio = 972/620;
const cloudHeight = cloudWidht / cloudRatio;

const beamRatio = 754/1381;
const beamHeight = saucerHeight / 538 * 1381;
const beamRotateCenter = 242/1381 * saucerHeight;
const beamSegment = 122/1381 * saucerHeight;

const cowWidth = 75;
const cowRatio = 160/102;
const cowHeight = cowWidth / cowRatio;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with if ( held [] )

let gameObstacles = [];
let currentFrame = 0;
let currentSide = 0;

// called on body load
function init() {
  playerSaucer = new saucer(window.innerWidth/2 - saucerWidth/2 , 300, wasdKeys);
  playerCow = new cow(window.innerWidth/2 - cowWidth/2, window.innerHeight * 0.9 -700 - cowHeight/2);
  gameArea.init();  ///////////////////////////////////////////////////////////////////////////////////
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
    this.context.fillStyle = "#60a5ea";
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


    let n = Math.ceil((Math.random() / 2) * 10);
    let cloudImg = document.getElementById("cloud" + n);

    // gameArea.context.fillStyle = color;
    // gameArea.context.fillRect(this.x, this.y, this.width, this.height);

    let obstacleX = Math.floor( Math.random() * ( gameArea.canvas.width/2 - obstacleWidth ) );
    gameObstacles.push( new obstacle( (obstacleX + ( currentSide % 2 * gameArea.canvas.width/2 ) ), -200, obstacleWidth, 25, cloudImg) );
    currentSide += 1;

  }

  // go through every obstacle to move & draw it
  for ( i = 0; i < gameObstacles.length; i += 1 ) {
    gameObstacles[i].y += obstacleSpeed;
    gameObstacles[i].draw();
  }

}


function saucer(x, y, keys) {
  this.x = x;
  this.y = y;
  this.xc = x + saucerWidth/2; // horizontal center
  this.yc = y + saucerHeight/2; // vertical center
  this.width = saucerWidth;
  this.height = saucerHeight;
  this.keys = keys;
  this.vx = 0;
  this.vy = 0;

  this.update = function() {

    this.xc = this.x + saucerWidth/2;
    this.yc = this.y + saucerHeight/2;

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
    let ctx = gameArea.context;
    let saucerImgOff = document.getElementById("saucer");
    let beamImages = [];
    for ( i = 1; i <= 7; i += 1 ) {
      beamImages[i] = "saucer_on_" + i*2;
    }

    let saucerDistance = (Math.sqrt(Math.pow(playerSaucer.xc - playerCow.xc, 2) + Math.pow(playerSaucer.yc - playerCow.yc, 2)));
    if ( ( playerCow.y - playerSaucer.yc >= -5 ) && ( saucerDistance <= 300 ) ) {
      // ctx.save();
      // ctx.translate(playerSaucer.xc,playerSaucer.yc);
      // ctx.rotate(playerCow.dir + Math.PI / 2);
      // ctx.drawImage(saucerImgOff, -saucerWidth/2, -saucerHeight/2, saucerWidth, saucerHeight);
      // ctx.restore();


      let beamImgId = "saucer2"; //if something goes wrong, this should be a backup

      let beamSize = Math.min(14, Math.floor( ( saucerDistance - 60 ) / beamSegment / 2 * 0.6 + 1) * 2 );

      beamImgId = "saucer" + Math.max( 2, beamSize );
      let beamImg = document.getElementById(beamImgId);

      ctx.save();
      ctx.translate(playerSaucer.xc,playerSaucer.yc);
      ctx.rotate(playerCow.dir + Math.PI / 2);
      ctx.drawImage(beamImg, -saucerWidth/2, -saucerHeight/2, saucerWidth, beamHeight);
      ctx.restore();
    }
    else {
      ctx.drawImage(saucerImgOff, playerSaucer.x, playerSaucer.y, saucerWidth, saucerHeight);
    }
  }
}


function cow(x, y) {
  this.x = x;
  this.y = y;
  this.xc = this.x + cowWidth/2; // horizontal center
  this.yc = this.y + cowHeight/2; // vertical center
  this.width = cowWidth;
  this.height = cowHeight;
  this.dir = 0;
  this.vel = 0;
  this.grav = 0;
  this.beam = false;

  this.update = function() {

    this.xc = this.x + cowWidth/2;
    this.yc = this.y + cowHeight/2;

    let dirX = (playerSaucer.xc - playerCow.xc) * 0.5;
    let dirY = (playerSaucer.yc - playerCow.yc) * 0.5;
    this.dir = Math.atan2(dirY, dirX);
    let saucerDistance = (Math.sqrt(Math.pow(playerSaucer.xc - playerCow.xc, 2) + Math.pow(playerSaucer.yc - playerCow.yc, 2)));

    if ( ( saucerDistance <= 300 ) && ( saucerDistance >= 70 ) && ( playerCow.y - playerSaucer.yc >= 15 ) ) {
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
    // ctx.lineWidth = 5;
    // ctx.beginPath();
    // ctx.moveTo(playerCow.x + playerCow.width/2, playerCow.y + playerCow.height/2);
    // ctx.lineTo(playerCow.x + playerCow.width/2 + Math.cos(this.dir) * 100, playerCow.y + playerCow.height/2 + Math.sin(this.dir) * 100);
    // ctx.stroke();


    let scaredCowImg = document.getElementById("scared_cow");
    let cowImg = document.getElementById("cow");
    if ( ( saucerDistance <= 300 ) && ( playerCow.y - playerSaucer.yc >= -5 ) ) {
      gameArea.context.drawImage(scaredCowImg, playerCow.x, playerCow.y, cowWidth, cowHeight);
    }
    else {
      gameArea.context.drawImage(cowImg, playerCow.x, playerCow.y, cowWidth, cowHeight);
    }

    //drawCircle(this);
  }
}



function drawCircle(thingie) {
  let ctx = gameArea.context;
  ctx.beginPath();
  ctx.arc(thingie.x+(thingie.width / 2), thingie.y+(thingie.width / 2), (thingie.width / 2), 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
}


function testIfOutOfBounds(thingie) {
  if (thingie.x <= 0) {
    thingie.x = 0;
    thingie.vx = 0;
  }
  if (thingie.y <= 0) {
    thingie.y = 0;
    thingie.vy = 0;
  }
  if (thingie.x + thingie.width >= gameArea.canvas.width) {
    thingie.x = gameArea.canvas.width - thingie.width;
    thingie.vx = 0;
  }
  if (thingie.y + thingie.height >= gameArea.canvas.height) {
    thingie.y = gameArea.canvas.height - thingie.height;
    thingie.vy = 0;
  }
}


function obstacle(x, y, width, height, img) {
  this.x = x;
  this.y = y;
  this.width = cloudWidht;
  this.height = cloudHeight;
  this.img = img;

  this.draw = function() {
    gameArea.context.drawImage(this.img, this.x,  this.y, this.width, this.height);
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
