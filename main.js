const CW = 800;
const CH = 450;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with heldK
const arrowKeys = [38, 37, 40, 39];


// called on body load
function init() {
  redPlayer = new player(10, 50, 50, 50, wasdKeys, "red");
  bluePlayer = new player(10, 150, 50, 50, arrowKeys, "blue");
  gameArea.init();
}

// define player
function player(x, y, width, height, keys, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.keys = keys;

  this.update = function() {
    movePlayer(this);
    gameArea.context.fillStyle = color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
}

function movePlayer(playerToMove) {
    if (held[playerToMove.keys[0]]) {
      playerToMove.y -= 2;
    }
    if (held[playerToMove.keys[1]]) {
      playerToMove.x -= 2;
    }
    if (held[playerToMove.keys[2]]) {
      playerToMove.y += 2;
    }
    if (held[playerToMove.keys[3]]) {
      playerToMove.x += 2;
    }
}


// called every frame
function updateGame() {
  gameArea.clear();
  redPlayer.update();
  bluePlayer.update();
  showKeysInHtml();
}

// create gamearea and canvas
let gameArea = {
  canvas : document.createElement("canvas"),
  init : function() {
    this.canvas.width = CW;
    this.canvas.height = CH;

    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    this.interval = setInterval(updateGame, 10);

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
