const CW = 800;
const CH = 450;

const wasdKeys = [87, 65, 83, 68]; //wasd keycodes for use with heldK



function init() {
  player = new character(10, 50, 50, 50, wasdKeys);
  gameArea.init();
}


function character(x, y, width, height, keys) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.keys = keys;

  this.move = function() {
    if (held[this.keys[0]]) {
      this.y -= 2;
    }
    if (held[this.keys[1]]) {
      this.x -= 2;
    }
    if (held[this.keys[2]]) {
      this.y += 2;
    }
    if (held[this.keys[3]]) {
      this.x += 2;
    }
}




  this.draw = function() {
    gameArea.context.fillStyle = "white";
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
    this.context.fillStyle = "#1f2023";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function updateGame() {
  gameArea.clear();
  player.move();
  player.draw();
  htmlUpdate();
}




// display keys in html
function htmlUpdate() {
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
