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
for(var i=0;i<canvas.length;i++){//Setting width/height of canvas to size of display frame
  canvas[i].width = $(window).innerWidth();
  canvas[i].height = $(window).innerHeight();
}
var tilePos = 0;
var gameStart = false;
var debug = false;
var startPlayer2 = false;
var player2 = {};
var distance = 0;
var maxEnemy = 20;
var maxDetail = 25;
var monsterMoveSpeed = 5;
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
for(var i=0;i<21;i++){//creating array of background objects
  backgroundDetail[i] = new Image;
  backgroundDetail[i].src = "img/Objects/Object_"+ (i+1) + ".png";
}
var titleNinja = new Image;
titleNinja.src = "img/Objects/ninja_logo.png";
var titleVs = new Image;
titleVs.src = "img/Objects/VS.png";
var titleZombies = new Image;
titleZombies.src = "img/Objects/zombies.png";
var titleRampage = new Image;
titleRampage.src = "img/Objects/rampage.png";
var platStart = new Image;
platStart.src = "img/ground/Platform/platStart.png";
var platFill = new Image;
platFill.src = "img/ground/Platform/platFill.png";
var platEnd = new Image;
platEnd.src = "img/ground/Platform/platEnd.png"
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

  that.render = function(){//Draw new sprite frame
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

  that.update = function(){//Update Frame Index for animation and Position
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
      if(this.attacking){
        checkCollisions(this);//make attack check collision
      };
    };
  };
  return that;
};

function checkCollisions(obj){
  var attackerHitBox = {x:obj.x, y:obj.y, width:obj.img.width, height: obj.img.height / obj.numberOfFrames};
  if(obj.type === "player"){//----------------PLAYER ATTACK-------------------------
    currentEnemy.forEach(function(item){
      var enemyHitBox = {x: item.x, y:item.y, width: item.img.width, height: item.img.height / item.numberOfFrames};
      if (attackerHitBox.x < enemyHitBox.x + enemyHitBox.width && attackerHitBox.x + attackerHitBox.width > enemyHitBox.x && attackerHitBox.y < enemyHitBox.y + enemyHitBox.height && attackerHitBox.height + attackerHitBox.y > enemyHitBox.y){
        if(item.hittable){//Checks if colided item is Hitable
          $('.hit')[0].play();
          item.hittable = false;
          item.life -= 1;
          obj.score += 10;
          if(item.life <= 0){//Life Zero--Die
            item.dead = true;
            item.vX = 0;
            item.img = item.die;
            item.canMove = false;
            setTimeout(function(){//Remove dead enemy from currentEnemy array after 300 MS
              currentEnemy.splice(currentEnemy.indexOf(item), 1);
            },400);
          }else{//Not Dead
            var blink = setInterval(function(){//Make Image Flash --!!!! Not working
              item.img.style.opacity = .10;
            }, 250);
            setTimeout(function(){//after 500ms set hitable to true
              clearInterval(blink)
              item.hittable = true;
            }, 500);
          }
        }
      }
    });
  }else{ //Monster Attack
    //Not Impimented yet
  }
};

function updatePosition(obj){
  if(obj.vY > 0){//if no longer going up for jump - used for detecting on ground
    obj.isJumping = false;
  }
  if(obj.x > play1.width - 350 && obj.moveFrame === true){//scroll Right
    obj.x = obj.x-10; //keep player relativly in position
    updateBackgroundItems(-obj.vX); //move background Elements to left while player keeps pushing frame
  }else if(obj.x < 10 && obj.moveFrame === true){//keep players from going back (left)
    obj.vX += 7
  };
  if(!obj.onGround || !obj.groundBelow){//add gravity if not on ground or no ground below
    obj.vY *= friction;
    obj.vY += gravity;
    obj.y += obj.vY;
  }
  obj.groundBelow = false; //force below to prove ground
  for(var i=0; i<landable.length; i++){//Detect Landable land
    if(obj.x > landable[i].xStart && obj.x < landable[i].xEnd && obj.y>landable[i].yStart && obj.y < landable[i].yEnd && !obj.isJumping){
      obj.onGround = true;
      obj.groundBelow = true;
      obj.canJump = true;
      obj.vY = 0;
    }
  }
  //Move Object by velocity
  obj.vX *= friction;
  obj.vY *= friction;
  obj.vX *= gravity;
  obj.x += obj.vX;
  obj.y += obj.vY;

  if(Math.round(obj.vX) === 0 && !obj.attacking && !obj.isJumping){//when near 0 xV stop character and change animation to idel when stopped
    obj.vX = 0
    obj.img = obj.facing === "left" ? obj.idleLeft: obj.idleRight;
    obj.imgWidth = obj.img.width;
    obj.imgHeight = obj.img.height;
  }
}

function randomNum(max, min){//Randomization function
if(min){
  return Math.random() * (max - min) + min;
}
  return Math.floor(Math.random() * max);
}

function getLastX(arr){
  var temp = 0;
  for(var i=0; i<arr.length; i++){
    if(arr[i].xEnd > 0){
      temp = i;
    };
  };
  return arr[temp];
}

function createGround(){ //creates baseline floor for game 2x width of screen width
  var numOfTile = background.width*2 / groundTile.width;
  if(tilePos > 0){
    var end = getLastX(landable);
    tilePos = end.xEnd;
  }

  for(var i=0; i<= numOfTile; i++){
    var rock = groundObject({
      xStart:tilePos,
      xEnd: tilePos+groundTile.width,
      yStart: background.height - groundTile.height + 50,
      yEnd: background.height,
      img: groundTile
    })
    landable.push(rock);
    tilePos += groundTile.width;
  }
}

function createBackgroundDetail(offScreen){//create background detail
  if(!offScreen){
    for(var i=0;i<maxDetail; i++){
      var detailNum = randomNum(21);
      var backObj = groundObject({
        xStart: randomNum(background.width*2),
        yStart: background.height - backgroundDetail[detailNum].height - 90,
        img: backgroundDetail[detailNum]
      });
      detail.push(backObj);
    }
  }
  if(offScreen){
    for(var i=0;i<maxDetail; i++){
      var detailNum = randomNum(21);
      var backObj = groundObject({
        xStart: randomNum(background.width + getLastX(landable).xEnd, background.width),
        yStart: background.height - backgroundDetail[detailNum].height - 90,
        img: backgroundDetail[detailNum]
      });
      detail.push(backObj);
    }
  }
}

function updateBackgroundItems(x){//moves all things not Players
  if(gameStart){
    landable.forEach(function(item){//cycle through landable objects
      item.xStart += x;
      item.xEnd += x;
    });
    currentEnemy.forEach(function(item){//cycle through Enemy
      item.x += x;
    });
    detail.forEach(function(item){//cycle through background detail
      item.xStart += x;
    });
  }else{
    landable.forEach(function(item){//cycle through landable objects
      item.xStart += x;
      item.xEnd += x;
    });
    detail.forEach(function(item){//cycle through background detail
      item.xStart += x;
    });
  }
};

function moveMonsters(obj){//to move monsters
  obj.canMove = false; //instantly changes to false so they wont keep warping
  var moveDir = randomNum(2) == true ? true:false; //50/50 for direction
  var moveDuration = randomNum(3000) + 1; //how long till can move again
  if(moveDir){//move right
    obj.facing = "right";
    obj.img=obj.runRight;
    obj.vX = monsterMoveSpeed;
  }else{//move left
    obj.facing = "left";
    obj.img = obj.runLeft;
    obj.vX = -monsterMoveSpeed;
  };
  setTimeout(function(){//set timeout till can move again
    obj.canMove = true;
  },moveDuration);
};

function checkView(){//see if non player objects have moved out of frame
  currentEnemy.forEach(function(item){//Check enemy
    if(item.x < 0 || item.y > background.height){
      currentEnemy.splice(currentEnemy.indexOf(item),1);
    };
  });
  landable.forEach(function(item){//check landable ground
    if(item.xEnd < 0 ){
      landable.splice(landable.indexOf(item), 1);
    };
  });
  detail.forEach(function(item){//check details
    if(item.xEnd < 0 ){
      detail.splice(detail.indexOf(item), 1);
    };
  });
  if(player1.y > background.height){
    player1.dead = true;
  }
  if(startPlayer2 && player2.y > background.height){
    player2.dead = true;
  }
};

function checkGameOver(){//if player death --!!!! not implemented THEY ARE IMORTAL!
  if(player1.dead === false || player2.dead === false){
    window.requestAnimationFrame(gameLoop)
  }
  if(startPlayer2 && player2.dead === true && player1.dead === true){
    console.log("2 player one");
    $('body').fadeOut(1000);
    $('.music')[0].pause();
    $('.lose')[0].play();
    setTimeout(function(){
      $('.gameover')[0].play();
    },1500)
  }
  if(!startPlayer2 && player1.dead === true){
    console.log("1 player death");
    $('body').fadeOut(1000);
    $('.music')[0].pause();
    $('.lose')[0].play();
    setTimeout(function(){
      $('.gameover')[0].play();
    },1500)
  }
}
//------------------------GAME LOOOOOOOOOPPPP------------------------------
function gameLoop(){
  if(gameStart){
    checkView();//Remove any thing out of frame
    if(currentEnemy.length <=0){//if no enemy spawn more
      spawnEnemy(randomNum(maxEnemy)+1);//spawn number between 1-max
    };
    ctxBack.clearRect(0,0, background.width, background.height);//clear background
    landable.forEach(function(item){//redraw platforms
      ctxBack.drawImage(item.img, item.xStart, item.yStart);
    });
    detail.forEach(function(item){//draw background detail
      ctxBack.drawImage(item.img, item.xStart, item.yStart)
    });
    ctxMonster.clearRect(0,0, monster.width, monster.height);//clear monster frame
    for(var i=0;i<currentEnemy.length; i++){//cycle through currentEnemy array
      if(currentEnemy[i].canMove){
        moveMonsters(currentEnemy[i])//move monster obj
      };
      updatePosition(currentEnemy[i]);
      currentEnemy[i].update();//update from SPRITE object
      currentEnemy[i].render();//draw that zombro
    };
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
      if(startPlayer2){
        ctxUi.strokeText("Player2 Pos: (X: "+ player2.x.toFixed(3) + ", Y: " + player2.y.toFixed(3) + ")",300,50);
        ctxUi.strokeText("Player2 Velocity: (X: "+ player2.vX + ", Y: " + player2.vY.toFixed(3) + ")",300,65);
        ctxUi.strokeText("Player2 loop: " + player2.loop,300,80);
        ctxUi.strokeText("Player2 Distance: "+ distance, 300,95);
        ctxUi.strokeText("Player2 groundBelow: "+ player2.groundBelow, 300,110);
        ctxUi.strokeText("Player2 Score: "+ player2.score, 300,125);
      }
      if(currentEnemy.length > 0){
        ctxUi.strokeText("Enemy Pos: (X: "+ currentEnemy[0].x.toFixed(3) + ", Y: " + currentEnemy[0].y.toFixed(3) + ")",600,50);
        ctxUi.strokeText("Enemy Velocity: (X: "+ currentEnemy[0].vX + ", Y: " + currentEnemy[0].vY.toFixed(3) + ")",600,65);
        ctxUi.strokeText("Enemy onGround: " + currentEnemy[0].onGround,600,80);
        ctxUi.strokeText("Enemy Life: "+ currentEnemy[0].life, 600,95);
        ctxUi.strokeText("Enemy Count: "+ currentEnemy.length, 600,110);
        ctxUi.strokeText("Enemy Score: "+ currentEnemy[0].score, 600,125);
      };
    };
    //---Debug Display
    if(player1.dead === false){
      player1.context.clearRect(0,0, play1.width, play1.height);
      updatePosition(player1);
      player1.update();
      player1.render();
    }
    if(startPlayer2 && player2.dead === false){
      player2.context.clearRect(0,0, play2.width, play2.height);
      updatePosition(player2);
      player2.update();
      player2.render();
    };
    //window.requestAnimationFrame(gameLoop);
    checkGameOver();//see if game is over OR calls loop again

  }else if(!gameStart){//UI SPLASH
    ctxUi.clearRect(0,0,ui.width,ui.height);
    ctxBack.clearRect(0,0, background.width, background.height);
    player1.context.clearRect(0,0, play1.width, play1.height);
    player2.context.clearRect(0,0, play2.width, play2.height);

    landable.forEach(function(item){//redraw platforms
      ctxBack.drawImage(item.img, item.xStart, item.yStart);
    });
    detail.forEach(function(item){//draw background detail
      ctxBack.drawImage(item.img, item.xStart, item.yStart)
    });

    ctxUi.drawImage(titleNinja, (background.width/2) -100, 50);
    ctxUi.drawImage(titleVs, (background.width/2) -30, 200);
    ctxUi.drawImage(titleZombies, (background.width/2)-100, 300);

    ctxMonster.clearRect(0,0, monster.width, monster.height);//clear monster frame
    for(var i=0;i<currentEnemy.length; i++){//cycle through currentEnemy array
      currentEnemy[i].img = currentEnemy[i].runRight;
      currentEnemy[i].update();//update from SPRITE object
      currentEnemy[i].render();//draw that zombro
    };

    player1.update();
    player1.render();
    player2.update();
    player2.render();
    updateBackgroundItems(-8);
    checkView();
    if(landable.length < 8){
      createGround();
      createBackgroundDetail(true);
    }
    window.requestAnimationFrame(gameLoop);
  }
}

var player1 = sprite({ //Player 1 sprite obj
  x: 50,
  y: 30,
  type: 'player',
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
function addPlayer(){
  if(startPlayer2 && gameStart){
    player2 = sprite({ //player 2
      x: 50,
      y: 30,
      type: 'player',
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
  };
  player2.render();
};

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

function playGame(){
  $('body').fadeOut(1000);
  $('body').fadeIn(2000);
  setTimeout(function(){
    ctxUi.clearRect(0,0,ui.width,ui.height);
    ctxBack.clearRect(0,0, background.width, background.height);
    player1.context.clearRect(0,0, play1.width, play1.height);
    player2.context.clearRect(0,0, play2.width, play2.height);
    landable = [];
    currentEnemy = [];
    detail = [];
    tilePos = 0;
    createGround();
    createBackgroundDetail();
    player1.x = 30
    player2.x = 30;
    gameStart = true;
  }, 1000);
  $(".title-music")[0].pause()
  $('.music')[0].play();
}
//When finished loading last image, run gameLoop
function gameInit(){
  groundTile.onload = function(){
    $('.title-music')[0].addEventListener('ended', function(){
      this.currentTime=0;
      this.play();
    },false);
    $('.title-music')[0].volume = .5;
    $('.title-music')[0].play();
    if(startPlayer2){
      addPlayer();
    }
    gameStart = true;
    startPlayer2 = true;
    addPlayer();
    player1.img = player1.runRight;
    player1.x = play1.width /2;
    player1.y = play1.height - groundTile.height + 75;
    player2.img = player2.runRight;
    player2.x = play2.width/2 -30;
    player2.y = play2.height - groundTile.height + 85;
    player2.dead = true
    gameStart= false;
    startPlayer2 = false;
    spawnEnemy(randomNum(70, 20));
    for(var i=0;i<currentEnemy.length; i++){//cycle through currentEnemy array
      currentEnemy[i].img = currentEnemy[i].runRight;
      currentEnemy[i].x = play1.width /2 + randomNum(750, 100);
      currentEnemy[i].y = play2.height - groundTile.height + 75;
      currentEnemy[i].update();//update from SPRITE object
      currentEnemy[i].render();//draw that zombro
    };
    $('.player1').on('click', function(){
      startPlayer2 = false;
      playGame();
      $('.button').hide();
    })
    $('.player2').on('click', function(){
      startPlayer2 = true;
      player2.dead = false;
      playGame();
      $('.button').hide();
    })
    createGround();
    createBackgroundDetail();
    gameLoop();
  }
}
//KeyInput function
$(document).keydown(function(e){//spawn player 2
  if(e.keyCode === 189){
    if(startPlayer2){
      startPlayer2 = false;
      player2.context.clearRect(0,0, play2.width, play2.height)
    }else if(gameStart){
      startPlayer2 = true;
      addPlayer();
    };
  };
  if(e.keyCode === 187){//Toggle Debug
    if(debug){
      debug = false;
    }else{
      debug = true;
    };
  };
  if(e.keyCode === 39){//p1 move right
    $('.step')[0].play();
    player1.vX += playerMoveSpeed;
    player1.img = player1RunRight;
    player1.facing = "right";
  };
  if(e.keyCode === 37){//p1 move left
    $('.step')[0].play();
    player1.vX -= playerMoveSpeed;
    player1.img = player1RunLeft;
    player1.facing = "left";
  };
  if(e.keyCode === 32){ //p1 Attack
    $('.sword')[0].play();
    player1.attacking = true;
    player1.img = player1.facing === "left" ? player1AttackLeft : player1AttackRight;
  };
  if(e.keyCode === 38 && player1.canJump){//p1 up key
    player1.isJumping = true;
    player1.canJump = false;
    player1.onGround = false;
    player1.vY -= playerJumpSpeed;
  };
  if(e.keyCode === 68 && startPlayer2){//p2 right D
    player2.vX += playerMoveSpeed;
    player2.facing = "right";
    player2.img = player2RunRight;
  };
  if(e.keyCode === 65 && startPlayer2){//Left A key
    player2.vX -= playerMoveSpeed;
    player2.facing = "left";
    player2.img = player2RunLeft;
  };
  if(e.keyCode === 70 && startPlayer2){//P2 Attack F key
    $('.sword')[0].play();
    player2.attacking = true;
    player2.img = player2.facing === "left" ? player2AttackLeft : player2AttackRight;
  };
  if(e.keyCode === 87 && player2.canJump && startPlayer2){//P2 Jump
    player2.isJumping = true;
    player2.canJump = false;
    player2.onGround = false;
    player2.vY -= playerJumpSpeed;
  };
});

$(document).keyup(function(e){
  if(e.keyCode === 32){//change from attacking on key up
    player1.attacking = false;
  };
  if(e.keyCode === 70 && startPlayer2){//change from attacking on key up
    player2.attacking = false;
  };
});

gameInit();
