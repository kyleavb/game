var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var hero = {
  img: "img/starlord_mask.png",
  picCol: 4,
  picRow: 4,
  frame: 0,
  sheetWid: 128,
  sheetHig: 192,
  frontFace: 0,
  moveLeft: 1,
  moveRight: 2,
  backFace: 3,
  walkSpeed: 150,
  runSpeed: 300,

  walk(){
    while(true){
      setInterval(function(){
        hero.drawImage(150, 150, hero.moveRight);
      }, hero.walkSpeed);
    }
  },

  drawImage(x,y, dir){
    pic = new Image();
    pic.src = hero.img;
    var width = this.sheetWid / this.picCol;
    var height = this.sheetHig / this.picRow;
    currentFrame = ++this.frame % this.picCol;
    this.frame = currentFrame;
    ctx.clearRect(x,y,width,height)
    var srcX = this.frame * width;
    var srcY = dir * height;
    ctx.drawImage(pic, srcX, srcY, width, height, x, y, width, height);
  }

}

function dc(str){
  console.log(str);
}

canvas.width = 1000;
canvas.height = 500;


document.addEventListener("DOMContentLoaded", function(){
  // ctx.drawImage($('.hero')[0],100,250, 250, 250);
});
