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
var flash = true; //value that changes every 2 seconds - for changing display on UI when no second player
setInterval(function(){
  if(flash){
    flash = false;
  }else{
    flash = true;
  }
}, 2000);
var genesis = 0; //counter for how many times we generate ground
var genesisIndex = 20;
var level = 1; //current level - also used to determine length
var maxGenesis = 2; //max amount of times ground can be generated.  used to increase level length formula level*maxGenesis.
var tilePos = 0; //for randomly generated ground.  mainly used for x value storage of where to start next generation
var gameStart = false; //flag to enable UI on load then when true start game cycle
var debug = false; //flag to determine if debug menu should display
var startPlayer2 = false; //flag to indicate if second player is active or not
var player2 = {}; //empty object to story player2 during UI start
var playerLives = 5; //easy way to adjust paramater
var distance = 0; //to measure distance travled --!! not implimented
var maxEnemy = 0; //variable to indicate how many enemy should populate on screen
var maxDetail = 100; //amount of backgorund objects to place
var monsterMoveSpeed = 5; //monster velocity per move
var playerMoveSpeed = 5; // player velocity per move
var playerJumpSpeed = 18; //increases player vY to provide jump
var detail = []; //empty array to store randomly selected background image items
var backgroundDetail = []; //empty array that will hold all Image reference for backgorund item
var landable = []; // empty array to hold image items that player can land on
var currentEnemy = []; //empty array to hold enemry objects when created
var gravity = .98; //ajustable gravity value
var friction = 0.96; //ajustable friction value

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
var player1Lives = new Image;
player1Lives.src = "img/player1/lives.png"
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
var player2Lives = new Image;
player2Lives.src = "img/player2/lives.png"
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
femaleZomIdleRight.src = "img/femaleZombie/femaleZombieIdleRight.png";
femaleZomIdleLeft = new Image;
femaleZomIdleLeft.src = "img/femaleZombie/femaleZombieIdleLeft.png";
femaleZomDie = new Image;
femaleZomDie.src = "img/femaleZombie/femaleZombieDie.png";
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
platEnd.src = "img/ground/Platform/platEnd.png";
var groundEndTile = new Image;
groundEndTile.src = "img/ground/Tile_3.png";
var groundStartTile = new Image;
groundStartTile.src = "img/ground/Tile_1.png";
var groundTile = new Image;
groundTile.src = "img/ground/Tile_11.png";

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
  that.attacking = options.attacking;
  that.canJump = true;
  that.isJumping = false;
  that.life = options.life;
  that.dead = false;
  that.hittable = true;
  that.score = 0;
  that.facing = "right";
  that.frameIndex = 0,
  that.tickCount = 0,
  that.ticksPerFrame = 2;
  that.numberOfFrames = options.numberOfFrames,
  that.moveTimer = options.moveTimer
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
    that.tickCount += 1;
    if(that.tickCount >= that.ticksPerFrame && that.frameIndex < that.numberOfFrames - 1){
      that.frameIndex += 1;
      that.tickCount = 0;
    };
    if(that.loop && that.frameIndex >= that.numberOfFrames - 1){
      that.frameIndex = 0;
    };
  };
  return that;
};

function checkCollisions(obj){
  var attackerHitBox = {x:obj.x, y:obj.y, width:obj.img.width, height: obj.img.height / obj.numberOfFrames};
  if(obj.type === "player"){//----------------PLAYER ATTACK-------------------------
    currentEnemy.forEach(function(item){
      var enemyHitBox = {x: item.x, y:item.y, width: item.img.width, height: item.img.height / item.numberOfFrames};
      if(attackerHitBox.x < enemyHitBox.x + enemyHitBox.width && attackerHitBox.x + attackerHitBox.width > enemyHitBox.x && attackerHitBox.y < enemyHitBox.y + enemyHitBox.height && attackerHitBox.height + attackerHitBox.y > enemyHitBox.y){
        if(item.hittable){//Checks if colided item is Hitable
          $('.hit')[0].play();
          item.hittable = false;
          item.life -= 1;
          obj.score += 10;
          if(item.life <= 0){//Life Zero--Die
            clearInterval(item.moveTimer);
            item.loop = false;
            item.img = item.die;
            setTimeout(function(){//Remove dead enemy from currentEnemy array after 300 MS
              currentEnemy.splice(currentEnemy.indexOf(item), 1);
            },1000);
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

  }
};

function updatePosition(obj){
  if(obj.vY > 0){//if no longer going up for jump - used for detecting on ground
    obj.isJumping = false;
  }
  if(obj.x > play1.width - 350 && obj.moveFrame === true){//scroll Right
    obj.x = obj.x - 10; //keep player relativly in position
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
    if(obj.x + obj.img.width > landable[i].xStart && obj.x  < landable[i].xEnd && obj.y + obj.img.height/obj.numberOfFrames >landable[i].yStart && obj.y + obj.img.height/obj.numberOfFrames < landable[i].yEnd && !obj.isJumping){
      obj.onGround = true;
      obj.groundBelow = true;
      obj.canJump = true;
      obj.vY = 0;
    };
  };
  //Move Object by velocity
  obj.vX *= friction;
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
  if(gameStart){
    genesis += 1;
    var numOfTile = background.width*2 / groundTile.width;
    if(tilePos > 0){
      var end = getLastX(landable);
      tilePos = end.xEnd;
    }
    for(var i=0; i<=numOfTile; i++){
      if(randomNum(2) && randomNum(2) && randomNum(2)){
        var platformLength = randomNum(4)+2;
        var platformStartX = randomNum(background.width*2, background.width);
        if(platformLength === 2){
          var rock = groundObject({
            xStart:platformStartX,
            xEnd: platformStartX+platStart.width,
            yStart: background.height - groundTile.height - 160,
            yEnd:  background.height - groundTile.height - 160 + 10,
            img: platStart
          });
          platformStartX += platStart.width
          landable.push(rock);
          var rock = groundObject({
            xStart:platformStartX,
            xEnd: platformStartX + platEnd.width,
            yStart: background.height - groundTile.height - 160,
            yEnd:  background.height - groundTile.height - 160 + 10,
            img: platEnd
            });
          landable.push(rock);
        }else{
          for(var i=1; i<= platformLength; i++){
            if(i === 1){
              var rock = groundObject({
                xStart:platformStartX,
                xEnd: platformStartX+platStart.width,
                yStart: background.height - groundTile.height - 160,
                yEnd:  background.height - groundTile.height - 160 + 10,
                img: platStart
              });
              platformStartX += platStart.width
              landable.push(rock);
            }
           if(i > 1 && i < platformLength){
             var rock = groundObject({
               xStart:platformStartX,
               xEnd: platformStartX+platFill.width,
               yStart: background.height - groundTile.height - 160,
               yEnd:  background.height - groundTile.height - 160 + 10,
               img: platFill
             });
             platformStartX += platFill.width
             landable.push(rock);
           }
            if(i === platformLength){
              var rock = groundObject({
                xStart:platformStartX,
                xEnd: platformStartX + platEnd.width,
                yStart: background.height - groundTile.height - 160,
                yEnd:  background.height - groundTile.height - 160 + 10,
                img: platEnd
                });
              landable.push(rock);
            }
          }
        }
      }
      if(i === 0){
        var rock = groundObject({
          xStart:tilePos,
          xEnd: tilePos+groundTile.width,
          yStart: background.height - groundTile.height + 10,
          yEnd: background.height,
          img: groundTile
        });
        landable.push(rock);
        tilePos += groundTile.width;
      }else{
        var addPit = randomNum(2) && randomNum(2) && randomNum(2) ? true:false;
        if(addPit){
          var rock = groundObject({
            xStart:tilePos,
            xEnd: tilePos+groundEndTile.width,
            yStart: background.height - groundEndTile.height + 10,
            yEnd: background.height,
            img: groundEndTile
          });
          detail.forEach(function(item){
            if(item.xStart + item.img.width > rock.xEnd|| item.xStart > rock.xEnd+210){
              console.log("removed");
              detail.splice(detail.indexOf(item), 1);
            }
          });
          landable.push(rock);
          tilePos += groundEndTile.width + randomNum(210, 150);//pit hole width

          var rock = groundObject({
            xStart:tilePos,
            xEnd: tilePos+groundStartTile.width,
            yStart: background.height - groundStartTile.height + 10,
            yEnd: background.height,
            img: groundStartTile
          });
          landable.push(rock);
          tilePos += groundStartTile.width;
        }
        var rock = groundObject({
          xStart:tilePos,
          xEnd: tilePos+groundTile.width,
          yStart: background.height - groundTile.height + 10,
          yEnd: background.height,
          img: groundTile
        });
        landable.push(rock);
        tilePos += groundTile.width;
      }
    }
  }else{
    var numOfTile = background.width*2 / groundTile.width;
    if(tilePos > 0){
      var end = getLastX(landable);
      tilePos = end.xEnd;
    }
    for(var i=0; i<= numOfTile; i++){
      var rock = groundObject({
        xStart:tilePos,
        xEnd: tilePos+groundTile.width,
        yStart: background.height - groundTile.height + 10,
        yEnd: background.height,
        img: groundTile
      });
      landable.push(rock);
      tilePos += groundTile.width;
    }
  }
}

function createBackgroundDetail(offScreen){//create background detail
  if(!offScreen){
    console.log("onscreen");
    for(var i=0;i<maxDetail+20; i++){
      var detailNum = randomNum(21);
      var backObj = groundObject({
        xStart: randomNum(background.width*2),
        yStart: background.height - backgroundDetail[detailNum].height - 120,
        img: backgroundDetail[detailNum]
      });
      detail.push(backObj);
    }
  }
  if(offScreen){
    console.log("offscreen");
    for(var i=0;i<maxDetail; i++){
      var detailNum = randomNum(21);
      var backObj = groundObject({
        xStart: randomNum(background.width*5, background.width),
        yStart: background.height - backgroundDetail[detailNum].height - 120,
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
  }else{// UI Movement
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
  obj.moveTimer = setTimeout(function(){//set timeout till can move again
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
    player1.life -= 1;
    if(player1.life > 0){
      player1.x = 50;
      player1.y = 10
    }else{
      player1.dead = true;
    }
  }
  if(startPlayer2 && player2.y > background.height){
    player2.life -= 1;
    if(player2.life > 0){
      player2.x = 50;
      player2.y = 0;
    }else{
      player2.dead = true;
    }
  }
};

function checkGameOver(){//if player death --!!!! not implemented THEY ARE IMORTAL!
  if(player1.dead === false || player2.dead === false){
    window.requestAnimationFrame(gameLoop)
  }
  if(startPlayer2 && player2.dead === true && player1.dead === true){
    $('body').fadeOut(1000);
    $('.music')[0].pause();
    $('.lose')[0].play();
    setTimeout(function(){
      $('.gameover')[0].play();
    },1500)

  }
  if(!startPlayer2 && player1.dead === true){
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
    if(landable.length < 20){
      console.log("genesis");
      //genesis += 1
      createBackgroundDetail(true);
      createGround();
    }
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

    //UI Display
    ctxUi.font = "50px Impact";
    ctxUi.fillStyle = "#320636";
    ctxUi.fillText("Player 1 Score: " + player1.score, 10, 75);
    var playerInc = 10
    for(var i=0; i<player1.life;i++){
      ctxUi.drawImage(player1Lives, playerInc, 95);
      playerInc += player1Lives.width;
    }
    if(player1.life < 0){
      ctxUi.fillText("Game Over", 10, 125);
    }
    if(!startPlayer2){
      if(flash){
        ctxUi.font = "50px Impact";
        ctxUi.fillStyle = "#FF6666";
        ctxUi.fillText("Join current Game", background.width - 500, 75);
      };
      if(!flash){
        ctxUi.font = "50px Impact";
        ctxUi.fillStyle = "#FF6666";
        ctxUi.fillText("Press number 2 to", background.width - 500, 75);
      };
    }else{
      ctxUi.font = "50px Impact";
      ctxUi.fillStyle = "#FF6666";
      ctxUi.fillText("Player 2 Score: " + player2.score, background.width - 500, 75);
      var playerInc = background.width - 500
      for(var i=0; i<player2.life;i++){
        ctxUi.drawImage(player2Lives, playerInc, 95);
        playerInc += player2Lives.width;
      }
      if(player2.life < 0){
        ctxUi.fillText("Game Over", background.width - 500, 125);
      }
    }


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
  life: 3,
  facing: "right",
  onGround: false,
  moveFrame: true,
  attack: false,
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
      attacking: false,
      life: 3,
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
        attacking: true,
        life: 1,
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
        attacking: true,
        life: 1,
        die: femaleZomDie,
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
    gameStart = true;
    player1.x = 30;
    player1.y = 10;
    player2.x = 30;
    player2.y = 10;
    ctxUi.clearRect(0,0,ui.width,ui.height);
    ctxBack.clearRect(0,0, background.width, background.height);
    player1.context.clearRect(0,0, play1.width, play1.height);
    player2.context.clearRect(0,0, play2.width, play2.height);
    landable = [];
    detail = [];
    currentEnemy = [];
    tilePos = 0;
    createBackgroundDetail();
    createGround();
  }, 1000);
  $(".title-music")[0].pause()
  $('.music')[0].play();
}
//When finished loading last image, run gameLoop
function gameInit(){
  groundTile.onload = function(){//ensures all image files are loaded
    $('.title-music')[0].addEventListener('ended', function(){
      this.currentTime=0;
      this.play();
    },false);
    $('.title-music')[0].volume = .5;
    $('.title-music')[0].play();
    // if(startPlayer2){
    //   addPlayer();
    // }
    gameStart = true;
    startPlayer2 = true;
    addPlayer();
    player1.img = player1.runRight;
    player1.x = play1.width /2;
    player1.y = play1.height - groundTile.height - 65;
    player2.img = player2.runRight;
    player2.x = play2.width/2 -30;
    player2.y = play2.height - groundTile.height - 60;
    player2.dead = true
    gameStart= false;
    startPlayer2 = false;
    spawnEnemy(randomNum(70, 20));
    for(var i=0;i<currentEnemy.length; i++){//cycle through currentEnemy array
      currentEnemy[i].img = currentEnemy[i].runRight;
      currentEnemy[i].x = play1.width /2 + randomNum(800, 200);
      currentEnemy[i].y = play2.height - groundTile.height - randomNum(80, 60);
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
    checkCollisions(player1);//make attack check collision
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
