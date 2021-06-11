const CW = 800;
const CH = 450;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with heldK



function init() {
  negyzet = new rectt(10, 50, 50, 50, "black");
  gameArea.init();
}


function rectt(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.move = function() {

  }

  this.draw = function() {
    gameArea.context.fillStyle = color;
    gameArea.context.fillRect(this.x, this.y, this.width, this.height);
  };
}

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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function updateGame() {
  gameArea.clear();
  negyzet.draw();
  htmlUpdate();
}

function htmlUpdate() {
  if ( held[wasdKeys[0]] ) {
    document.getElementById('w').innerHTML = "w = true"
  }
  else {
    document.getElementById('w').innerHTML = "w = false"
  }
  if ( held[wasdKeys[1]] ) {
    document.getElementById('a').innerHTML = "a = true"
  }
  else {
    document.getElementById('a').innerHTML = "a = false"
  }
  if ( held[wasdKeys[2]] ) {
    document.getElementById('s').innerHTML = "s = true"
  }
  else {
    document.getElementById('s').innerHTML = "s = false"
  }
  if ( held[wasdKeys[3]] ) {
    document.getElementById('d').innerHTML = "d = true"
  }
  else {
    document.getElementById('d').innerHTML = "d = false"
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
