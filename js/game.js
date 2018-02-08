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
  canvas[i].width = $(window).innerWidth()-30;
  canvas[i].height = $(window).innerHeight()-30;
}
var playerMoveSpeed = 5;
var playerJumpSpeed = 25;
var landable = [];
var currentEnemy = [];
var gravity = .98;
var friction = 0.96;
ctxUi.font = "12px Arial";
ctxUi.fillStyle = "red";
//Image Loader
//----------------Player1 Image -----------------------------
var player1AttackRight = new Image;
player1AttackRight.src = "img/player1/player1AttackRight.png";
var player1AttackLeft = new Image;
player1AttackLeft.src = "img/player1/player1AttackLeft.png";
var player1IdleRight = new Image;
player1IdleRight.src = "img/player1/player1IdleRight.png";
var player1IdleLeft = new Image;
player1IdleLeft.src = "img/player1/player1IdleLeft.png";
var player1RunRight = new Image;
player1RunRight.src = "img/player1/player1RunRight.png";
var player1RunLeft = new Image;
player1RunLeft.src = "img/player1/player1RunLeft.png";
var player1JumpRight = new Image;
player1JumpRight.src = "img/player1/player1JumpRight.png";
var player1JumpLeft = new Image;
player1JumpLeft.src = "img/player1/player1JumpLeft.png";
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
  that.onGround = options.onGround;
  that.attacking = false;
  that.canJump = true;
  that.isJumping = false;
  that.life = 3,
  that.dead = false;
  that.hittable = true;
  that.facing = "right";
  frameIndex = 0,
  that.tickCount = 0,
  that.ticksPerFrame = 5;
  that.numberOfFrames = options.numberOfFrames,
  that.loop = true,
  that.context = options.context,
  that.idleRight = options.idleRight,
  that.idleLeft = options.idleLeft,
  that.runRight = options.runRight,
  that.runLeft = options.runLeft,
  that.attackLeft = options.attackLeft,
  that.attackRight = options.attackRight,
  that.jumpLeft = options.jumpLeft,
  that.jumpRight = options.jumpRight,
  that.img = options.img,

  that.render = function(){
    that.context.drawImage(
      that.img,
      0,//Source Start X
      frameIndex * that.img.height / that.numberOfFrames, // Source Start Y
      that.img.width,//Soruce xSize
      that.img.height / that.numberOfFrames,//sorce ySize height
      that.x,
      that.y,
      that.img.width,
      that.img.height / that.numberOfFrames);
  },

  that.update = function(){
    if(this.life){
      this.tickCount += 1;
      if(that.tickCount >= that.ticksPerFrame){
        that.tickCount =0;
        if(frameIndex < that.numberOfFrames - 1){
          frameIndex += 1;
        }else if (that.loop){
          frameIndex =0;
        }
      }
      updatePosition(that);
      if(this.attacking){
        var hits = []
        checkCollisions(this, hits);
      }
    }else{

    }
  }
  return that;
}

function checkCollisions(obj, hits){
  var playerHitBox = {x:obj.x, y:obj.y, width:obj.img.width, height: obj.img.height}
  currentEnemy.forEach(function(item){
    var enemyHitBox = {x: item.x, y:item.y, width: item.img.width,height: item.img.height}
    if (playerHitBox.x < enemyHitBox.x + enemyHitBox.width && playerHitBox.x + playerHitBox.width > enemyHitBox.x && playerHitBox.y < enemyHitBox.y + enemyHitBox.height && playerHitBox.height + playerHitBox.y > enemyHitBox.y) {
      if(item.hittable){
        item.hittable = false;
        item.life -= 1;
        console.log("hit!");
        if(item.life <= 0){
          console.log("dude be dead");
          item.dead = true;
        }else{
          setTimeout(function(){
            item.hittable = true;
          }, 1000);
        }
      }
      hits.push(item);
    }
  })
}

function updatePosition(obj){
  if(obj.x > play1.width - 30){
    obj.vX  -= 7
  }else if(obj.x < 0){
    obj.vX += 7
  }

  obj.vX *= friction;
  obj.vY *= friction;
  obj.vX *= gravity;
  obj.x += obj.vX;
  obj.y += obj.vY;

  //Falling
  if(!obj.onGround){
    obj.vY *= friction;
    obj.vY += gravity;
    obj.y += obj.vY;
  }
  for(var i=0; i<landable.length; i++){//Detect Landable
    if(obj.x > landable[i].xStart && obj.x < landable[i].xEnd && obj.y>landable[i].yStart && obj.y < landable[i].yEnd){
      obj.onGround = true;
      obj.isJumping = false;
      obj.canJump = true;
      obj.vY = 0;
    }
  }

  if(Math.round(obj.vX) === 0 && !obj.attacking && !obj.isJumping){
    obj.vX = 0
    obj.img = obj.facing === "left" ? obj.idleLeft: obj.idleRight;
    obj.imgWidth = obj.img.width;
    obj.imgHeight = obj.img.height;
  }
}

function randomNum(max){
  return Math.floor(Math.random() * max);
}

function createGround(){
  var numOfTile = background.width / 256;
  var tilePos = 0;
  for(var i=0; i<= numOfTile; i++){
    var rock = groundObject({
      xStart:tilePos,
      xEnd: tilePos+groundTile.width,
      yStart: background.height - groundTile.height,
      yEnd: background.height,
      img: groundTile
    })
    landable.push(rock);
    tilePos += 255;
  }
  var x = randomNum(background.width)
  var y = randomNum(background.height)
  var rando = groundObject({
    xStart: x,
    xEnd: x+groundTile.width,
    yStart: y,
    yEnd: y+20,
    img: groundTile
  })
  landable.push(rando);
}

function updateGround(x){
  landable.forEach(function(item){
    item.xStart += x;
  })
}


function gameLoop(){
  ctxBack.clearRect(0,0, background.width, background.height)
  landable.forEach(function(item){
    ctxBack.drawImage(item.img, item.xStart, item.yStart)
  });
  while (currentEnemy.length < 1){
    spawnEnemy();
  }
  ctxMonster.clearRect(0,0, monster.width, monster.height)
  for(var i=0;i<currentEnemy.length; i++){
    currentEnemy[i].update();
    currentEnemy[i].render();
  }
  ctxUi.clearRect(0,0,ui.width,ui.height);


  //---Debug Display
  ctxUi.fillText("Player1 Pos: ("+ player1.x.toFixed(3) + ", " + player1.y.toFixed(3) + ")",10,50);
  ctxUi.fillText("Player1 Velocity: ("+ player1.vX + ", " + player1.vY + ")",10,65);
  ctxUi.strokeText("Player2 Pos: (X: "+ player2.x.toFixed(3) + ", Y: " + player2.y.toFixed(3) + ")",300,50);
  ctxUi.strokeText("Player2 Velocity: (X: "+ player2.vX + ", Y: " + player2.vY.toFixed(3) + ")",300,65);
  //---Debug Display
  player1.context.clearRect(0,0, play1.width, play1.height);
  player2.context.clearRect(0,0, play2.width, play2.height);
  player1.update();
  player2.update();
  player1.render();
  player2.render();
  window.requestAnimationFrame(gameLoop);
}




var player1 = sprite({
  x: 50,
  y: 30,
  context: ctxPlay1,
  img: player1IdleRight,
  numberOfFrames: 10,
  facing: "right",
  onGround: false,
  idleLeft: player1IdleLeft,
  idleRight: player1IdleRight,
  runLeft: player1RunLeft,
  runRight: player1RunRight,
  attackLeft: player1AttackLeft,
  attackRight: player1AttackRight,
  jumpLeft: player1JumpLeft,
  jumpRight: player1JumpRight
});

var player2 = sprite({
  x: 50,
  y: 30,
  context: ctxPlay2,
  img: player2IdleRight,
  numberOfFrames: 10,
  facing: "right",
  onGround: false,
  idleLeft: player2IdleLeft,
  idleRight: player2IdleRight,
  runLeft: player2RunLeft,
  runRight: player2RunRight,
  attackLeft: player2AttackLeft,
  attackRight: player2AttackRight
});

function spawnEnemy(){
  var temp = sprite({
    x: 200,
    y: 30,
    context: ctxMonster,
    img: maleZomRight,
    numberOfFrames: 10,
    loop: true,
    facing: "right",
    onGround: false,
    idleLeft: maleZomRight,
    idleRight: maleZomRight,
    runLeft: maleZomRight,
    runRight: maleZomRight,
    attackLeft: maleZomRight,
    attackRight: maleZomRight
  });
  currentEnemy.push(temp);
}

//When finished loading last image, run gameLoop
groundTile.onload = function(){
  player2.render();
  player1.render();
  createGround();
  gameLoop();
}

//KeyInput function
$(document).keydown(function(e){
  if(e.keyCode === 39){//move right
    player1.vX += playerMoveSpeed;
    player1.img = player1RunRight;
    player1.facing = "right";
  }
  if(e.keyCode === 37){//move left
    player1.vX -= playerMoveSpeed;
    player1.img = player1RunLeft;
    player1.facing = "left";
  }
  if(e.keyCode === 32){ //Attack
    player1.attacking = true;
    player1.img = player1.facing === "left" ? player1AttackLeft : player1AttackRight;
  }
  if(e.keyCode === 38 && player1.canJump){//up key
    player1.img = player1.facing === "left" ? player1JumpLeft : player1JumpRight;
    player1.isJumping = true;
    player1.canJump = false;
    player1.onGround = false;
    player1.vY -= playerJumpSpeed;
  }
  if(e.keyCode === 40){//Down key

  }
  if(e.keyCode === 68){//right D key && player2
    player2.vX += playerMoveSpeed;
    player2.facing = "right";
    player2.img = player2RunRight;

  }
  if(e.keyCode === 65){//Left A key
    player2.vX -= playerMoveSpeed;
    player2.facing = "left";
    player2.img = player2RunLeft;
  }
  if(e.keyCode === 70){//P2 Attack F key
    player2.attacking = true;
    player2.img = player2.facing === "left" ? player2AttackLeft : player2AttackRight;
  }
  if(e.keyCode === 87 && player2.canJump){//P2 Jump
    player2.isJumping = true;
    player2.canJump = false;
    player2.onGround = false;
    player2.vY -= playerJumpSpeed;
  }
});

$(document).keyup(function(e){
  if(e.keyCode === 32){
    player1.attacking = false;
  }
  if(e.keyCode === 70){
    player2.attacking = false;
  }
});
