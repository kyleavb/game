var background = document.getElementById("background");
var ctxBack = background.getContext("2d");
var action = document.getElementById("action");
var ctxAction = action.getContext("2d");
var ui = document.getElementById("ui");
var ctxUi = ui.getContext("2d");
background.width = $(window).width();
action.width = $(window).width();
ui.width = $(window).width();
background.height = 700;
action.height = 700;
ui.height = 700;
var hero = new Image();
hero.src = "img/starlord_mask_large.png"
var ground = new Image();
ground.src = "img/ground/Tile_11.png";

var player = {
  img: hero,
  xPos: 450,
  yPos: 500,
  spriteWid: 256,
  spriteHig: 384,
  picCol: 4,
  picRow: 4,
  startFrame: 0,
  endFrame:4,
  curFrame: 0,
  rightDir: 2,
  leftDir: 1,
  moveSpeed: 15,
  Move(){

  },
}

function dc(str){
  console.log(str);
}

function spriteWidth(object){
  return object.spriteWid / object.picCol;
}

function spriteHeight(object){
  return object.spriteHig / object.picRow;
}

//Animate action frame
function drawPlayer(object, x, y, dir){
  var sheetWidth = spriteWidth(object);//sprite
  var sheetHeight = spriteHeight(object);//spite
  var currentFrame = ++object.curFrame % object.picCol;//determine frame
  dc(currentFrame)
  object.curFrame = currentFrame
  var srcX = currentFrame * sheetWidth;
  var srcY = dir * sheetHeight;
  ctxAction.drawImage(object.img, srcX, srcY, sheetWidth, sheetHeight, x, y, sheetWidth, sheetHeight);
}

//draw ground elements based on screen size
function drawGround(){
  var multiplyer = Math.ceil(background.width/255);
  start = 0
  for(var i=0;i<=multiplyer; i++){
    ctxBack.drawImage(ground, start, 470);
    start += 255
  }
}


//ON LOAD
$(document).ready(function(){
  drawPlayer(player, player.xPos, player.yPos, player.rightDir)
  drawGround();

  //Movement
  $(document).keydown(function(e){
    if(e.keyCode == 37){//left
      if(player.xPos > 190){
        ctxAction.clearRect(player.xPos, player.yPos,spriteWidth(player),spriteHeight(player));
        player.xPos -= player.moveSpeed;
        window.requestAnimationFrame(function(){
          drawPlayer(player, player.xPos, player.yPos, player.leftDir);
        });
      }
    }
    if(e.keyCode == 39){//right
      ctxAction.clearRect(player.xPos, player.yPos,spriteWidth(player),spriteHeight(player));
      player.xPos += player.moveSpeed;
      window.requestAnimationFrame(function(){
        drawPlayer(player, player.xPos, player.yPos, player.rightDir);
      });
    }
  });
});
