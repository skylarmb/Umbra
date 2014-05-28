var kMaxSpeed = 5;

function darkness() {
  Sprite.call(this);
  this.height = kCanvasHeight*20;
  this.width = kCanvasWidth*2;
  this.image = Textures.load("img/sprites/fog.png");
  this.initialized = false;
  this.cloud = [];
  this.cloud.push(new particle_system(50, 40, 1, 300, this.x+3*kCanvasWidth/2, 4*kCanvasHeight/4));
  this.cloud.push(new particle_system(50, 40, 1, 300, this.x+3*kCanvasWidth/2, 5*kCanvasHeight/4));
  this.cloud.push(new particle_system(50, 40, 1, 300, this.x+3*kCanvasWidth/2, 6*kCanvasHeight/4));
  this.cloud.push(new particle_system(50, 40, 1, 300, this.x+3*kCanvasWidth/2, 7*kCanvasHeight/4));
}
darkness.prototype = new Sprite();

darkness.prototype.initialize = function() {
  this.x = -2*kCanvasWidth;
  this.y = -kCanvasHeight *10;
  this.speed = 1;
  this.acceleration = 0.1;
  if(debug) darkness1.speed = -9999;
  this.initialized = true;
}

darkness.prototype.update = function(d) {
  kMaxSpeed = 5 + score/1000;

  if (this.speed < kMaxSpeed)
    this.speed += this.acceleration;
  // move twice as fast if too far away
  if ((player1.x - this.x) > 5*kCanvasWidth/2) {
    this.speed += this.acceleration;
  }
  else {
    if (this.speed > kMaxSpeed)
	this.speed = kMaxSpeed;
  }
  this.x += this.speed;
  for (var i = 0; i < this.cloud.length; ++i) {
    this.cloud[i].x = (this.x+global_camera.x)+3*kCanvasWidth/2+100;
	this.cloud[i].y = i*kCanvasHeight/4;
  }
  if (player1.x < (this.x+3*kCanvasWidth/2)) {
    gameover();
  }
  if (player1.y > kCanvasHeight + 200) {
    gameover();
  }
  
  this.xoffset = global_camera.x;
  this.yoffset = global_camera.y;
}

darkness.prototype.drawparticles = function(ctx) {
  for (var i = 0; i < this.cloud.length; ++i) {
    this.cloud[i].draw(ctx);
  }
  //this.__proto__.draw.call(this,ctx);
}