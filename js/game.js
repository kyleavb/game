var background = document.getElementById("background");
var ctxBack = background.getContext("2d");
var monster = document.getElementById("monster");
var ctxMonster = monster.getContext("2d");
var play1 = document.getElementById("play1");
var ctxPlay1 = play1.getContext("2d");
var play2 = document.getElementById("play2");
var ctxPlay2 = play2.getContext("2d");
var ui = document.getElementById("ui");
var ctxUi = ui.getContext("2d");
var canvas = $(".game");
for(var i=0;i<canvas.length;i++){
  canvas[i].width = $(window).innerWidth()-30;
  canvas[i].height = $(window).innerHeight()-30;
}
var moreZombies = true;
var distance = 0;
var maxEnemy = 50;
var maxDetail = 50;
var debug = false;
var monsterMoveSpeed = 2;
var playerMoveSpeed = 5;
var playerJumpSpeed = 25;
var detail = [];
var backgroundDetail = [];
var landable = [];
var currentEnemy = [];
var gravity = .98;
var friction = 0.96;
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
var maleZomIdleLeft = new Image;
maleZomIdleLeft.src = "img/maleZombie/maleZombieIdleLeft.png";
var maleZomIdleRight= new Image;
maleZomIdleRight.src = "img/maleZombie/maleZombieIdleRight.png";
var maleZomDie = new Image;
maleZomDie.src = "img/maleZombie/maleZombieDie.png";
//Female
var femaleZomRight = new Image;
femaleZomRight.src = "img/femaleZombie/femaleZombieWalkRight.png";
var femaleZomLeft = new Image;
femaleZomLeft.src = "img/femaleZombie/femaleZombieWalkLeft.png";
femaleZomIdleRight = new Image;
femaleZomIdleRight.src = "img/femaleZombie/femaleZombieIdleRight.png"
femaleZomIdleLeft = new Image;
femaleZomIdleLeft.src = "img/femaleZombie/femaleZombieIdleLeft.png"
//----------------Game Images -----------------------------
for(var i=0;i<21;i++){
  backgroundDetail[i] = new Image;
  backgroundDetail[i].src = "img/Objects/Object_"+ (i+1) + ".png";
}

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
  that.type = options.type;
  that.id = options.id;
  that.canMove = true;
  that.moveFrame = options.moveFrame;
  that.move = false;
  that.onGround = options.onGround;
  that.groundBelow = false;
  that.attacking = false;
  that.canJump = true;
  that.isJumping = false;
  that.life = 1,
  that.dead = false;
  that.hittable = true;
  that.score = 0;
  that.facing = "right";
  that.frameIndex = 0,
  that.tickCount = 0,
  that.ticksPerFrame = 2;
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
  that.die = options.die,
  that.img = options.img,

  that.render = function(){
    that.context.drawImage(
      that.img,
      0,//Source Start X
      that.frameIndex * that.img.height / that.numberOfFrames, // Source Start Y
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
        if(that.frameIndex < that.numberOfFrames - 1){
          that.frameIndex += 1;
        }else if (that.loop){
          that.frameIndex =0;
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
        $('.hit')[0].play();
        item.hittable = false;
        item.life -= 1;
        obj.score += 10;
        if(item.life <= 0){
          item.dead = true;
          if(item.type === "enemy"){//Dead Enemy
            item.vX = 0;
            item.canMove = false;
            //item.loop = false;
            item.img = item.die;
            setTimeout(function(){
              currentEnemy.splice(currentEnemy.indexOf(item), 1);
            },300);
          }
        }else{
          var blink = setInterval(function(){
            item.img.style.opacity = .10;
          }, 250);
          setTimeout(function(){
            clearInterval(blink)
            item.hittable = true;
          }, 500);
        }
      }
      hits.push(item);
    }
  })
}

function updatePosition(obj){
  if(obj.vY > 0){
    obj.isJumping = false;
  }

  if(obj.x > play1.width - 350 && obj.moveFrame === true){
    obj.x = obj.x-10
    updateGround(-obj.vX)
  }else if(obj.x < 10 && obj.moveFrame === true){
    obj.vX += 7
  }
  if(!obj.onGround || !obj.groundBelow){
    obj.vY *= friction;
    obj.vY += gravity;
    obj.y += obj.vY;
  }
  obj.groundBelow = false;
  for(var i=0; i<landable.length; i++){//Detect Landable
    if(obj.x > landable[i].xStart && obj.x < landable[i].xEnd && obj.y>landable[i].yStart && obj.y < landable[i].yEnd && !obj.isJumping){
      obj.onGround = true;
      obj.groundBelow = true;
      obj.canJump = true;
      obj.vY = 0;
    }
  }

  obj.vX *= friction;
  obj.vY *= friction;
  obj.vX *= gravity;
  //obj.vY += gravity;
  obj.x += obj.vX;
  obj.y += obj.vY;

  if(Math.round(obj.vX) === 0 && !obj.attacking && !obj.isJumping){
    obj.vX = 0
    obj.img = obj.facing === "left" ? obj.idleLeft: obj.idleRight;
    obj.imgWidth = obj.img.width;
    obj.imgHeight = obj.img.height;
  }

  if(Math.round(obj.vY) === 0){
    obj.vY = 0
  }
}

function randomNum(max){
  return Math.floor(Math.random() * max);
}

function createGround(){
  var numOfTile = background.width*2 / 256;
  var tilePos = 0;
  for(var i=0; i<= numOfTile; i++){
    var rock = groundObject({
      xStart:tilePos,
      xEnd: tilePos+groundTile.width,
      yStart: background.height - groundTile.height + 50,
      yEnd: background.height,
      img: groundTile
    })
    landable.push(rock);
    tilePos += 255;
  }
  //Foilage add
  for(var i=0;i<maxDetail; i++){
    var detailNum = randomNum(21);
    var backObj = groundObject({
      xStart: randomNum(background.width *2),
      yStart: background.height - backgroundDetail[detailNum].height - 90,
      img: backgroundDetail[detailNum]
    });
    detail.push(backObj);
  }


}

function updateGround(x){
  landable.forEach(function(item){
    item.xStart += x;
    item.xEnd += x;
  });
  for(var i=0; i<currentEnemy.length; i++){
    currentEnemy[i].x += x;
  }
  detail.forEach(function(item){
    item.xStart += x;
  })
}

function moveMonsters(obj){
  obj.canMove = false;
  var moveDir = randomNum(2) == true ? true:false;
  var moveDuration = randomNum(3000) + 1;
  if(moveDir){
    obj.facing = "right";
    obj.img=obj.runRight;
    obj.vX = monsterMoveSpeed;
  }else{
    obj.facing = "left";
    obj.img = obj.runLeft;
    obj.vX = -monsterMoveSpeed;
  }
  setTimeout(function(){
    obj.canMove = true;
  },moveDuration);
}

function checkView(){
  currentEnemy.forEach(function(item){
    if(item.x < 0 || item.y > background.height){
      currentEnemy.splice(currentEnemy.indexOf(item),1);
    }
  })
  landable.forEach(function(item){
    if(item.xEnd < 0 ){
      landable.splice(landable.indexOf(item), 1);
    }
  })
  detail.forEach(function(item){
    if(item.xEnd < 0 ){
      detail.splice(detail.indexOf(item), 1);
    }
  })
}

function checkGameOver(){
  //if() 2 player check
  window.requestAnimationFrame(gameLoop);
}

//------------------------GAME LOOOOOOOOOPPPP------------------------------
function gameLoop(){
  checkView();
  if(currentEnemy.length <=0)
  if(moreZombies){
    spawnEnemy(maxEnemy);
  }
  ctxBack.clearRect(0,0, background.width, background.height)
  landable.forEach(function(item){//redraw background
    ctxBack.drawImage(item.img, item.xStart, item.yStart)
  });
  detail.forEach(function(item){
    ctxBack.drawImage(item.img, item.xStart, item.yStart)
  });
  ctxMonster.clearRect(0,0, monster.width, monster.height)
  for(var i=0;i<currentEnemy.length; i++){
    currentEnemy[i].update();
    if(currentEnemy[i].canMove){
      moveMonsters(currentEnemy[i])
    }
    currentEnemy[i].render();
  }
  ctxUi.clearRect(0,0,ui.width,ui.height);
  //---Debug Display
  if(debug){
    ctxUi.font = "12px Arial";
    ctxUi.fillStyle = "red";
    ctxUi.fillText("Player1 Pos: (X: "+ player1.x.toFixed(3) + ", Y: " + player1.y.toFixed(3) + ")",10,50);
    ctxUi.fillText("Player1 Velocity: (X: "+ player1.vX + ", Y: " + player1.vY + ")",10,65);
    ctxUi.fillText("Player1 onGround: " + player1.onGround,10,80);
    ctxUi.fillText("Player1 isJumping: " + player1.isJumping,10,95);
    ctxUi.fillText("Player1 groundBelow: " + player1.groundBelow,10,110);
    ctxUi.fillText("Player1 Score: " + player1.score,10,125);
    ctxUi.strokeText("Player2 Pos: (X: "+ player2.x.toFixed(3) + ", Y: " + player2.y.toFixed(3) + ")",300,50);
    ctxUi.strokeText("Player2 Velocity: (X: "+ player2.vX + ", Y: " + player2.vY.toFixed(3) + ")",300,65);
    ctxUi.strokeText("Player2 loop: " + player2.loop,300,80);
    ctxUi.strokeText("Player2 Distance: "+ distance, 300,95)
    ctxUi.strokeText("Player2 groundBelow: "+ player2.groundBelow, 300,110)
    ctxUi.strokeText("Player2 Score: "+ player2.score, 300,125)
    ctxUi.fillStyle = "blue";
    ctxUi.strokeText("Enemy Pos: (X: "+ currentEnemy[0].x.toFixed(3) + ", Y: " + currentEnemy[0].y.toFixed(3) + ")",600,50);
    ctxUi.strokeText("Enemy Velocity: (X: "+ currentEnemy[0].vX + ", Y: " + currentEnemy[0].vY.toFixed(3) + ")",600,65);
    ctxUi.strokeText("Enemy onGround: " + currentEnemy[0].onGround,600,80);
    ctxUi.strokeText("Enemy Life: "+ currentEnemy[0].life, 600,95)
    ctxUi.strokeText("Enemy Count: "+ currentEnemy.length, 600,110)
    ctxUi.strokeText("Enemy Score: "+ currentEnemy[0].score, 600,125)
  }
  //---Debug Display

  player1.context.clearRect(0,0, play1.width, play1.height);
  player2.context.clearRect(0,0, play2.width, play2.height);
  player1.update();
  player2.update();
  player1.render();
  player2.render();
  checkGameOver();

}


var player1 = sprite({
  x: 50,
  y: 30,
  type: 'player',
  id: 1,
  context: ctxPlay1,
  img: player1IdleRight,
  numberOfFrames: 10,
  facing: "right",
  onGround: false,
  moveFrame: true,
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
  type: 'player',
  id: 2,
  context: ctxPlay2,
  img: player2IdleRight,
  numberOfFrames: 10,
  facing: "right",
  onGround: false,
  moveFrame: true,
  idleLeft: player2IdleLeft,
  idleRight: player2IdleRight,
  runLeft: player2RunLeft,
  runRight: player2RunRight,
  attackLeft: player2AttackLeft,
  attackRight: player2AttackRight
});

function spawnEnemy(num){
  for(var i = 0; i<num;i++){
    var flip = randomNum(2) == true ? true: false;
    if(flip){
      var temp = sprite({
        x: randomNum(background.width),
        y: 30,
        type: 'enemy',
        id: currentEnemy.length,
        context: ctxMonster,
        img: maleZomRight,
        numberOfFrames: 10,
        loop: true,
        facing: "right",
        onGround: false,
        moveFrame: false,
        die: maleZomDie,
        idleLeft: maleZomIdleLeft,
        idleRight: maleZomIdleRight,
        runLeft: maleZomLeft,
        runRight: maleZomRight,
        attackLeft: maleZomRight,
        attackRight: maleZomRight
      });
    }else{
      var temp = sprite({
        x: randomNum(background.width),
        y: 30,
        type: 'enemy',
        id: currentEnemy.length,
        context: ctxMonster,
        img: femaleZomRight,
        numberOfFrames: 10,
        loop: true,
        facing: "right",
        onGround: false,
        die: maleZomDie,
        idleLeft: femaleZomIdleLeft,
        idleRight: femaleZomIdleRight,
        runLeft: femaleZomLeft,
        runRight: femaleZomRight,
        attackLeft: maleZomRight,
        attackRight: maleZomRight
      })
    }
    currentEnemy.push(temp);
  }
}

//When finished loading last image, run gameLoop
groundTile.onload = function(){
  //$('.music')[0].play();
  player2.render();
  player1.render();
  spawnEnemy(maxEnemy);
  createGround();
  gameLoop();
}

//KeyInput function
$(document).keydown(function(e){
  if(e.keyCode === 187){//Toggle Debug
    if(debug){
      debug = false;
    }else{
      debug = true;
    }
  }
  if(e.keyCode === 39){//move right
    $('.step')[0].play();
    player1.vX += playerMoveSpeed;
    player1.img = player1RunRight;
    player1.facing = "right";
  }
  if(e.keyCode === 37){//move left
    $('.step')[0].play();
    player1.vX -= playerMoveSpeed;
    player1.img = player1RunLeft;
    player1.facing = "left";
  }
  if(e.keyCode === 32){ //Attack
    $('.sword')[0].play();
    player1.attacking = true;
    player1.img = player1.facing === "left" ? player1AttackLeft : player1AttackRight;
  }
  if(e.keyCode === 38 && player1.canJump){//up key
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
    $('.sword')[0].play();
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
//gameInit();
