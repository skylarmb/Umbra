//Global variables
var kPlayerMaxSpeedX = 20;
var kPlayerMaxSpeedY = 20;
var playerimg=new Sprite();
var xspeed;
var last = "r";
var kAniSpeed = 2.5;
var kAniTimer = 2* kJumpHeight;

function player() {
  Sprite.call(this);
  this.width = 100/3;
  this.height = 344/3;
  gameScreen.addChild(this);
  make_playerimg();
  this.initialized = false;
}

playerimg.update=function(d){
    //console.log(player1.body.m_linearVelocity.x);
    xspeed=player1.body.m_linearVelocity.x;
    playerimg.frameRate = Math.round(kAniSpeed*xspeed);
    playerimg.xoffset=player1.xoffset;
    playerimg.yoffset=player1.yoffset;
    playerimg.x=player1.pos.x-20;
    playerimg.y=player1.pos.y;
    //console.log("frame " +playerimg.frame);
    if(xspeed>0){
        playerimg.animation = "right";
        last="r";
        playerimg.frameRate = -playerimg.frameRate;
    }else if(xspeed<0){
        playerimg.animation = "left";
        last="l";
        playerimg.frameRate = -playerimg.frameRate;
    }else{
      if(last == "r"){
        playerimg.frame=16;
      }
      else if(last == "l"){
        playerimg.frame=17;
      }
     }
     if(jump_timer > 0){
        if(last == "left")
            playerimg.frame = 0;
        if(last == "right")
            playerimg.frame = 11;
     
     }
}

player.prototype = new Sprite();

player.prototype.initialize = function() {
  this.x = 20;
  this.y = 0;
  physics_engine.add_sprite(this, "dynamic");
  this.initialized = true;
  init_playerimg();
}

function make_playerimg(){
var FPS = 60;
  playerimg.height = 350/3;
  playerimg.width=243/3;
  playerimg.image = Textures.load("img/sprites/character/sprites and stills.png");
  playerimg.frameWidth = 243;
  playerimg.frameHeight = 350;
  playerimg.frameCount = 18;
  playerimg.frameRate = 15;
  playerimg.moveRate = 15;
  playerimg.addAnimations(["left","right"], [8,8]);
  playerimg.animation = "right";
  gameScreen.addChild(playerimg);
}

function init_playerimg() {
  playerimg.x=-20;
  playerimg.xoffset=player1.xoffset;
  playerimg.y=player1.pos.y;
  playerimg.yoffset=player1.yoffset;
}

player.prototype.alive = false;