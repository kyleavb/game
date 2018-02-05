var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var hero = {
  img: "img/starlord_mask_large.png",
  picCol: 4,
  picRow: 4,
  startFrame: 0,
  endFrame: 4,
  frame: 0,
  sheetWid: 256,
  sheetHig: 384,
  left: 1,
  right: 2,
  walkSpeed: 300,
  runSpeed: 90,
  walk(dir){
    // setInterval(function(){
    //   hero.drawImage(150, 150, dir);
    // }, hero.walkSpeed);
    hero.drawImage(150, 250, dir)
  },
  run(dir){
    setInterval(function(){
      hero.drawImage(150, 150, dir);
    }, hero.runSpeed);
  },
  drawImage(x,y, dir){
    pic = new Image();
    pic.src = hero.img;
    var width = this.sheetWid / this.picCol;
    var height = this.sheetHig / this.picRow;
    currentFrame = ++this.frame % this.picCol;
    this.frame = currentFrame;
    dc(currentFrame)
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

  function doTheThingsOnKeypress(event){
    //do things here! We've covered this before, but this time it's simplified
    KeypressFunctions[event.which].call();
  }






document.addEventListener("DOMContentLoaded", function(){
  // $('.top-btn').on("mousedown",function(){
  //     hero.walk(hero.up);
  //   });
  // $('.right-btn').on("mouseenter",function(){
  //   hero.run(hero.right);
  // });
  // $('.bottom-btn').on("mouseenter",function(){
  //   hero.walk(hero.down);
  // });
  // $('.left-btn').on("mouseenter",function(){
  //   hero.walk(hero.left);
  // });

  $(document).keydown(function(e){
    if(e.keyCode == 37){
      hero.walk(hero.left);
    }
    if(e.keyCode == 39){
      hero.walk(hero.right)
    }

  });
});
