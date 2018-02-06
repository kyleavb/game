var background = document.getElementById("background");
var ctxBack = background.getContext("2d");
var play1 = document.getElementById("play1");
var ctxPlay1 = play1.getContext("2d");
var play2 = document.getElementById("play2");
var ctxPlay2 = play2.getContext("2d");
var monster = document.getElementById("monster");
var ctxMonster = monster.getContext("2d");
var ui = document.getElementById("ui");
var ctxUi = ui.getContext("2d");
background.width = $(window).innerWidth();
play1.width = $(window).innerWidth();
play2.width = $(window).innerWidth();
monster.width = $(window).innerWidth();
ui.width = $(window).innerWidth();
background.height = $(window).innerHeight();
play1.height = $(window).innerHeight();
play2.height = $(window).innerHeight();;
monster.height = $(window).innerHeight();;
ui.height = $(window).innerHeight();

//Image Loader
//----------------Player1 Image -----------------------------
var player1AttackRight = new Image;
player1AttackRight.src = "img/player1/player1AttackRight.png"
var player1AttackLeft = new Image;
player1AttackLeft.src = "img/player1/player1AttackLeft.png"
var player1IdleRight = new Image;
player1IdleRight.src = "img/player1/player1IdleRight.png"
var player1IdleLeft = new Image;
player1IdleLeft.src = "img/player1/player1IdleLeft.png"
var player1RunRight = new Image;
player1RunRight.src = "img/player1/player1RunRight.png";
var player1RunLeft = new Image;
player1RunLeft.src = "img/player1/player1RunLeft.png"
//----------------Player2 Image -----------------------------
var player2AttackRight = new Image;
player2AttackRight.src = "img/player2/player2AttackRight.png"
var player2AttackLeft = new Image;
player2AttackLeft.src = "img/player2/player2AttackLeft.png"
var player2IdleRight = new Image;
player2IdleRight.src = "img/player2/player2IdleRight.png"
var player2IdleLeft = new Image;
player2IdleLeft.src = "img/player2/player2IdleLeft.png"
var player2RunRight = new Image;
player2RunRight.src = "img/player2/player2RunRight.png";
var player2RunLeft = new Image;
player2RunLeft.src = "img/player2/player2RunLeft.png"

function sprite(options){
  var that = {};
  //Positional things
  that.x = options.x,
  that.y = options.y,
  frameIndex = 0,
  that.tickCount = 0,
  that.move = options.move,
  that.moveSpeed = options.moveSpeed,
  that.ticksPerFrame = options.ticksPerFrame,
  that.numberOfFrames = options.numberOfFrames,
  that.loop = options.loop,
  that.context = options.context,
  that.width = options.width,
  that.height = options.height,
  that.image = options.image,

  that.render = function(){
    that.context.clearRect(that.x,that.y, that.width, that.height);
    if(that.move){
      that.x += that.moveSpeed;
    }
    that.context.drawImage(
      that.image,
      0,//Source Start X
      frameIndex * that.height / that.numberOfFrames, // Source Start Y
      that.width,//Soruce xSize
      that.height / that.numberOfFrames,//sorce ySize height
      that.x,
      that.y,
      that.width,
      that.height / that.numberOfFrames);
  },

  that.update = function(){
    this.tickCount += 1;
    if(that.tickCount >= that.ticksPerFrame){
      that.tickCount =0;
      if(frameIndex < that.numberOfFrames -1){
        frameIndex += 1;
      }else if (that.loop){
        frameIndex =0;
      }
    }
  }
  return that;
}

function updatePosition(obj){
    //update velocity
    obj.vx += obj.ax;
    obj.vy += obj.ay;

    //cheat's friction (friction = 0.97)
    obj.vx *= friction;
    obj.vy *= friction;

    //update position
    obj.x += obj.vx;
    obj.y += obj.vy;
}

function gameInit(){
  //Load splash screen
  // user Inputs to check game type

}

function gameLoop(){
  player1.update();
  player2.update();
  player1.render();
  player2.render();
  window.requestAnimationFrame(gameLoop);
}

var player1 = sprite({
  x: 30,
  y: ($(window).innerHeight()-150),
  context: ctxPlay1,
  width: 46,
  height: 879,
  image: player1IdleRight,
  numberOfFrames: 10,
  ticksPerFrame: 4,
  loop: true,
  facing: "right"
});

var player2 = sprite({
  x: 30,
  y: ($(window).innerHeight()-150),
  context: ctxPlay2,
  width: 58,
  height: 1000,
  image: player2IdleRight,
  numberOfFrames: 10,
  ticksPerFrame: 20,
  loop: true,
  facing: "right"
});

//When finished loading last image, run gameLoop
player1RunLeft.onload = function(){
  player2.render();
  player1.render();
  gameLoop();
}

//KeyInput function
$(document).keydown(function(e){
  console.log(e.keyCode);
//---------------------Player1 Key Set-------------------
  if(e.keyCode === 39){//move right
    player1.context.clearRect(player1.x,player1.y, player1.width, player1.height);
    player1.image = player1RunRight;
    player1.facing = "right";
    player1.loop = true;
    player1.ticksPerFrame = 1;
    player1.width = 72;
    player1.height = 917;
    player1.move = true;
    player1.moveSpeed = 10;
  }
  if(e.keyCode === 37){//move left
    player1.context.clearRect(player1.x,player1.y, player1.width, player1.height);
    player1.image = player1RunLeft;
    player1.facing = "left";
    player1.loop = true;
    player1.ticksPerFrame = 1;
    player1.width = 72;
    player1.height = 917;
    player1.move = true;
    player1.moveSpeed = -10;
  }
  if(e.keyCode === 32){ //Attack
    player1.context.clearRect(player1.x,player1.y, player1.width, player1.height);
    if(player1.facing === "right"){
      player1.image = player1AttackRight;
    }else{
      player1.image = player1AttackLeft;
    }
    player1.loop = true;
    player1.ticksPerFrame = 2;
    player1.width = 107;
    player1.height = 991;
    player1.move = false;
    player1.moveSpeed = 0;
  }
  if(e.keyCode === 38){//up key

  }
  if(e.keyCode === 40){//Down key

  }
//---------------------Player2 Key Set-------------------
  if(e.keyCode === 68){//right D key
    player2.context.clearRect(player2.x,player1.y, player2.width, player2.height);
    player2.image = player2RunRight;
    player2.facing = "right";
    player2.loop = true;
    player2.ticksPerFrame = 1;
    player2.width = 75;
    player2.height = 1041;
    player2.move = true;
    player2.moveSpeed = 10;
  }
  if(e.keyCode === 65){//Left A key
    player2.context.clearRect(player2.x,player1.y, player2.width, player2.height);
    player2.image = player2RunLeft;
    player2.facing = "left";
    player2.loop = true;
    player2.ticksPerFrame = 1;
    player2.width = 75;
    player2.height = 1041;
    player2.move = true;
    player2.moveSpeed = -10;
  }
  if(e.keyCode === 70){
    if(player2.facing === "right"){
      player2.image = player2AttackRight;
    }else{
      player2.image = player2AttackLeft;
    }
    player2.loop = true;
    player2.ticksPerFrame = 2;
    player2.width = 104;
    player2.height = 1137;
    player2.move = false;
    player2.moveSpeed = 0;
  }

});

$(document).keyup(function(e){
  if(e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 32){
    player1.context.clearRect(player1.x,player1.y, player1.width, player1.height);
    if (player1.facing === "right") {
      player1.image = player1IdleRight;
    }else{
      player1.image = player1IdleLeft;
    }
    player1.loop = true;
    player1.ticksPerFrame = 4;
    player1.width = 46;
    player1.height = 879;
    player1.move = false
    player1.moveSpeed = 0;
  }
  if(e.keyCode === 87 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 70){
    player2.context.clearRect(player2.x,player2.y, player2.width, player2.height);
    if (player2.facing === "right") {
      player2.image = player2IdleRight;
    }else{
      player2.image = player2IdleLeft;
    }
    player2.loop = true;
    player2.ticksPerFrame = 4;
    player2.width = 58;
    player2.height = 1001;
    player2.move = false
    player2.moveSpeed = 0;
  }
});
