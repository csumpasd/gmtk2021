let gameSize = Math.min(880, (0.7 * Math.min(window.innerWidth, window.innerHeight * 0.8)));
let obstacleSpeed = 2;
const obstacleWidth = 150;
const playerSpeed = 20;
const playerAccel = 0.4;
const friction = 0.985;
const frameLength = 16.66666;
const beamTimeOut = 1;
const cloudRarity = 15;
const gameSpeedUp = 0.05;

const saucerWidth = gameSize * 0.16;
const saucerRatio = 754/538;
const saucerHeight = saucerWidth / saucerRatio;

const cloudWidth = gameSize * 0.14;
const cloudRatio = 972/620;
const cloudHeight = cloudWidth / cloudRatio;

const beamRatio = 754/1381;
const beamHeight = saucerHeight / 538 * 1381;
const beamRotateCenter = 242/1381 * saucerHeight;
const beamSegment = 122/1381 * saucerHeight * gameSize/720;

const cowWidth = gameSize * 0.13;
const cowRatio = 160/102;
const cowHeight = cowWidth / cowRatio;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with if ( held [] )

let gameObstacles = [];
let currentFrame = 0;
let currentSide = 0;
let closestObstacle = 0;
let closestDistance;
let minDistance;
let gameStarted = false;
let gameFailed = false;

// called on body load
function init() {
  playerSaucer = new saucer(gameSize/2 - saucerWidth/2 , 100, wasdKeys);
  playerCow = new cow(gameSize/2 - cowWidth/2, gameSize * 1.4 * 0.99 - cowHeight/2);
  cowField = new ground();
  gameArea.init();
}


// create gamearea and canvas
let gameArea = {
  canvas : document.createElement("canvas"),
  init : function() {
    this.canvas.width = gameSize;
    this.canvas.height = gameSize * 1.4;

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
  cowField.update();
  playerSaucer.update();
  playerCow.update();

  if ( gameStarted ) {
    gameAudio.play();

    currentFrame += 1;
    playerCow.timeSinceCloud += 1;

    if ( currentFrame % 10 == 0 ) {
      obstacleSpeed += gameSpeedUp;
    }

    if ( currentFrame % Math.max(1, Math.floor(cloudRarity * 2000 / Math.sqrt(obstacleSpeed) / gameArea.canvas.width) ) == 0 ) {


      let randomCloud = Math.ceil(Math.random() * 5);
      let cloudImg = document.getElementById("cloud" + randomCloud);

      let obstacleX = Math.floor( Math.random() * ( gameArea.canvas.width/2 ) );
      gameObstacles.push( new obstacle( (obstacleX + ( currentSide % 2 * gameArea.canvas.width/2 - cloudWidth/2) ), -200, cloudWidth, cloudHeight, cloudImg) );
      currentSide += 1;

    }


    minDistance = 69420;
    // go through every obstacle to move & draw it
    for ( i = 0; i < gameObstacles.length; i += 1 ) {

      if ( gameObstacles[i].visible == 1 ) {
        obstacleDistance = (Math.sqrt(Math.pow(playerSaucer.xc - ( gameObstacles[i].x + gameObstacles[i].width/2), 2) + Math.pow(playerSaucer.yc - ( gameObstacles[i].y + gameObstacles[i].height/2), 2)));
        if ( obstacleDistance < minDistance ) {
          minDistance = obstacleDistance;
          closestObstacle = i;
        }

        gameObstacles[i].testIfVisible();
        gameObstacles[i].y += obstacleSpeed;
        gameObstacles[i].draw();
      }
    }

  }

  if ( gameFailed ) {
    gameAudio.pause();
    let ctx = gameArea.context;
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    ctx.fillText("You let your cow die", gameArea.canvas.width/2, gameArea.canvas.height/2);
    ctx.font = "20px Arial";
    ctx.fillText("(and also lost the game)", gameArea.canvas.width/2, gameArea.canvas.height/2 + 40);
    clearInterval(gameArea.interval);
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
    if ( ( playerCow.y - playerSaucer.yc >= -5 ) && ( saucerDistance <= gameSize/3 ) && ( playerCow.timeSinceCloud >= beamTimeOut / frameLength * 1000 ) ) {


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
  this.timeSinceCloud = beamTimeOut / frameLength * 1000;

  this.update = function() {

    this.xc = this.x + cowWidth/2;
    this.yc = this.y + cowHeight/2;

    let dirX = (playerSaucer.xc - playerCow.xc) * 0.5;
    let dirY = (playerSaucer.yc - playerCow.yc) * 0.5;
    this.dir = Math.atan2(dirY, dirX);
    let saucerDistance = (Math.sqrt(Math.pow(playerSaucer.xc - playerCow.xc, 2) + Math.pow(playerSaucer.yc - playerCow.yc, 2)));


    // if ( gameObstacles.length >= 1 ) {
    //   testBeamIntersects(gameObstacles[closestObstacle]);
    // }

    if ( ( minDistance <= playerSaucer.width / 2 ) && ( gameStarted ) ) {
      this.timeSinceCloud = 0;
    }


    if ( ( saucerDistance <= gameSize / 3 ) && ( saucerDistance >= gameSize / 11 ) && ( playerCow.y - playerSaucer.yc >= 15 ) && ( this.timeSinceCloud >= beamTimeOut / frameLength * 1000 ) ) {
        this.vel = 3 * saucerDistance/100;
        this.beam = true;
        if ( this.y <= gameSize * 0.67 ) {
          gameStarted = true;
        }
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
      this.grav += gameSize * 0.00005;
      this.y += this.grav;
    }
    else {
      this.grav = 0;
    }

    if ( ( this.y >= gameSize * 1.4 * 0.88 ) && (currentFrame <= 160) ) {
      this.y = gameSize * 1.4 * 0.88;
    }

    if ( this.y > gameArea.canvas.height ) {
      gameFailed = true;
    }
    // vector tests

    // let ctx = gameArea.context;
    // ctx.strokeStyle = 'white';
    // if ( this.beam == 1 ) {
    //   ctx.strokeStyle = 'red';
    // }
    // ctx.lineWidth = 5;
    // ctx.beginPath();
    // ctx.moveTo(playerCow.x + playerCow.width/2, playerCow.y + playerCow.height/2);
    // ctx.lineTo(playerCow.x + playerCow.width/2 + Math.cos(this.dir) * 100, playerCow.y + playerCow.height/2 + Math.sin(this.dir) * 100);
    // ctx.stroke();


    let scaredCowImg = document.getElementById("scared_cow");
    let cowImg = document.getElementById("cow");
    if ( ( saucerDistance <= 300 ) && ( playerCow.y - playerSaucer.yc >= -5 ) && ( this.timeSinceCloud >= beamTimeOut / frameLength * 1000 ) ) {
      gameArea.context.drawImage(scaredCowImg, playerCow.x, playerCow.y, cowWidth, cowHeight);
    }
    else {
      gameArea.context.drawImage(cowImg, playerCow.x, playerCow.y, cowWidth, cowHeight);
    }

    //drawCircle(this);
  }
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
  this.width = width;
  this.height = height;
  this.visible = 1;
  this.img = img;

  this.draw = function() {
    gameArea.context.drawImage(this.img, this.x,  this.y, this.width, this.height);
  }

  this.testIfVisible = function() {
    if ( this.y > gameArea.canvas.height ) {
      this.visible = 0;
    }
  }

}


function ground() {
  this.x = 0;
  this.y = gameArea.canvas.height - ( gameArea.canvas.height * 1688 / 2250 );
  this.width = gameArea.canvas.width;
  this.height = gameArea.canvas.height * 1688 / 2250;

  this.update = function() {
    let groundImg = document.getElementById("ground");
    gameArea.context.drawImage(groundImg, this.x, gameArea.canvas.height - gameArea.canvas.width * 1688 / 2250 + currentFrame * gameSize/500, gameArea.canvas.width, (gameArea.canvas.width * 1688 / 2250));
  }
}



//keyevents
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

let gameAudio = new Audio("sounds/cowfinity_track.mp3");
gameAudio.addEventListener("ended", function() {
  this.currentTime = 0;
  this.play();
}, false);
