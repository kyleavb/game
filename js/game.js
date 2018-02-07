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
var canvas = $(".game");
for(var i=0;i<canvas.length;i++){
  canvas[i].width = $(window).innerWidth();
  canvas[i].height = $(window).innerHeight();
}
var landable = [];
var currentEnemy = [];
var gravity = .5;
var friction = 0.97;

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
//----------------Enemery Images -----------------------------
//Male
var maleZomRight = new Image;
maleZomRight.src = "img/maleZombie/maleZombieRight.png";
var maleZomLeft = new Image;
maleZomLeft.src = "img/maleZombie/maleZombieLeft.png";
//----------------Game Images -----------------------------
var groundTile = new Image;
groundTile.src = "img/ground/Tile_11.png"


//ground object constructor
function groundObject(options){
  var ret = {};
  ret.xStart = options.xStart;
  ret.xEnd = options.xEnd;
  ret.yStart = options.yStart;
  ret.yEnd = options.yEnd;
  ret.img = options.img;
  return ret;
}
//sprite constructor
function sprite(options){
  var that = {};
  that.x = options.x;
  that.y = options.y;
  that.vX = 0;
  that.vY = 0;
  that.move = false;
  that.onGround = options.onGround,
  that.isJumping = false,
  that.life = 3,
  that.facing = "right";
  frameIndex = 0,
  that.tickCount = 0,
  that.ticksPerFrame = 3;
  that.numberOfFrames = options.numberOfFrames,
  that.loop = options.loop,
  that.context = options.context,
  that.imgWidth = options.imgWidth,
  that.imgHeight = options.imgHeight,
  that.img = options.img,

  that.render = function(){
    that.context.drawImage(
      that.img,
      0,//Source Start X
      frameIndex * that.imgHeight / that.numberOfFrames, // Source Start Y
      that.imgWidth,//Soruce xSize
      that.imgHeight / that.numberOfFrames,//sorce ySize height
      that.x,
      that.y,
      that.imgWidth,
      that.imgHeight / that.numberOfFrames);
  },

  that.update = function(){
    updatePosition(that);
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
  for(var i=0; i<landable.length; i++){
    if(obj.x > landable[i].xStart && obj.x < landable[i].xEnd && obj.y > landable[i].yEnd){
      obj.onGround = true;
      obj.vY = 0;
    }
  }
  if(obj.move){
    if(obj.facing === "right"){
      obj.vX += .5;
    }else{
      obj.vX -= .5;
    }
    obj.vY += 0;
    obj.vX *= friction;
    obj.vY *= friction;
    obj.x += obj.vX;
    obj.y += obj.vY;
  }
  //Falling
  if(!obj.onGround){
    obj.vY += gravity;
    obj.y += obj.vY;
  }
}

function createGround(){
  var numOfTile = background.width / 256;
  var tilePos = 0;
  for(var i=0; i<= numOfTile; i++){
    var rock = groundObject({
      xStart:tilePos,
      xEnd: tilePos+groundTile.width,
      yStart: background.height - 225,
      yEnd: background.height - 200,
      img: groundTile
    })
    landable.push(rock);
    tilePos += 255;
  }
}

function spawnEnemy(){
  var temp = sprite({
    x: 200,
    y: 30,
    context: ctxMonster,
    imgWidth: 86,
    imgHeight: 1039,
    img: maleZomRight,
    numberOfFrames: 10,
    loop: true,
    facing: "right",
    onGround: false,
    move: false
  });
  currentEnemy.push(temp);
}

function updateGround(){
  //nove griound when needed
}

function gameLoop(){
  landable.forEach(function(item){
    updateGround(item);
    ctxBack.drawImage(item.img, item.xStart, item.yStart)
  });
  console.log("loop");
  while (currentEnemy.length < 3){
    spawnEnemy()a;
  }
  for(var i=0;i<currentEnemy.length; i++){
    currentEnemy[i].update();
    currentEnemy[i].render();
  }
  player1.context.clearRect(player1.x,player1.y, player1.imgWidth, player1.imgHeight);
  player1.update();
  player2.context.clearRect(player2.x,player1.y, player2.imgWidth, player2.imgHeight);
  player2.update();
  player1.render();
  player2.render();
  window.requestAnimationFrame(gameLoop);
}

var player1 = sprite({
  x: 30,
  y: 30,
  context: ctxPlay1,
  imgWidth: 46,
  imgHeight: 879,
  img: player1IdleRight,
  numberOfFrames: 10,
  loop: true,
  facing: "right",
  onGround: false,
  move: false
});

var player2 = sprite({
  x: 30,
  y: 30,
  context: ctxPlay2,
  imgWidth: 58,
  imgHeight: 1000,
  img: player2IdleRight,
  numberOfFrames: 10,
  loop: true,
  facing: "right",
  onGround: false,
  move: false
});
//When finished loading last image, run gameLoop
player1RunLeft.onload = function(){
  player2.render();
  player1.render();
  createGround();
  gameLoop();
}

//KeyInput function
$(document).keydown(function(e){
  if(e.keyCode === 39){//move right
    player1.img = player1RunRight;
    player1.facing = "right";
    player1.loop = true;
    player1.imgWidth = 72;
    player1.imgHeight = 917;
  }
  if(e.keyCode === 37){//move left
    player1.img = player1RunLeft;
    player1.facing = "left";
    player1.loop = true;
    player1.imgWidth = 72;
    player1.imgHeight = 917;
    player1.move = true;
    player1.moveSpeed = -5;
  }
  if(e.keyCode === 32){ //Attack
    if(player1.facing === "right"){
      player1.img = player1AttackRight;
    }else{
      player1.img = player1AttackLeft;
    }
    player1.loop = true;
    player1.imgWidth = 107;
    player1.imgHeight = 991;
    player1.move = false;
    player1.moveSpeed = 0;
  }
  if(e.keyCode === 38){//up key
    player1.loop = false;
    player1.imgWidth = 107;
    player1.imgHeight = 991;
    player1.isJumping = true;
  }
  if(e.keyCode === 40){//Down key

  }
  if(e.keyCode === 68){//right D key
    player2.img = player2RunRight;
    player2.facing = "right";
    player2.loop = true;
    player2.imgWidth = 75;
    player2.imgHeight = 1041;
    player2.move = true;
    player2.moveSpeed = 5;
  }
  if(e.keyCode === 65){//Left A key
    player2.img = player2RunLeft;
    player2.facing = "left";
    player2.loop = true;
    player2.imgWidth = 75;
    player2.imgHeight = 1041;
    player2.move = true;
  }
  if(e.keyCode === 70){
    if(player2.facing === "right"){
      player2.img = player2AttackRight;
    }else{
      player2.img = player2AttackLeft;
    }
    player2.loop = true;
    player2.imgWidth = 104;
    player2.imgHeight = 1137;
    player2.move = false;
    player2.moveSpeed = 0;
  }

});

$(document).keyup(function(e){
  player1.context.clearRect(player1.x,player1.y, player1.imgWidth, player1.imgHeight);
  player2.context.clearRect(player2.x,player1.y, player2.imgWidth, player2.imgHeight);
  if(e.keyCode === 40 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 32){
    if (player1.facing === "right") {
      player1.img = player1IdleRight;
    }else{
      player1.img = player1IdleLeft;
    }
    player1.loop = true;
    player1.imgWidth = 46;
    player1.imgHeight = 879;
    player1.move = false
    //player1.vX = 0;
  }
  if(e.keyCode === 87 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 70){
    if (player2.facing === "right") {
      player2.img = player2IdleRight;
    }else{
      player2.img = player2IdleLeft;
    }
    player2.loop = true;
    player2.imgWidth = 58;
    player2.imgHeight = 1001;
    player2.move = false
    //dplayer2.vX = 0;
  }
});
