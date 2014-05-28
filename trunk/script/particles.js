this.particleArray = [];

function Particle(x, y, radius, xspeed, yspeed, lifetime) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.xspeed = xspeed;
  this.yspeed = yspeed;
  this.lifetime = lifetime;
}

function particle_system(numParticles, radius, speed, lifetime, x, y) {
  this.radius = radius;
  this.speed = speed;
  this.lifetime = lifetime;
  this.x = x;
  this.y = y;
  for(var itor=0;itor<numParticles;++itor) {
    var r = Math.random()*speed;
	var t = Math.random()*2*Math.PI;
	var xs = r * Math.cos(t);
	var ys = r * Math.sin(t);
    particleArray.push(new Particle(10-Math.random()*20, 10-Math.random()*20, Math.random()*this.radius, xs, ys, Math.random()*this.lifetime));
  }
}

// we're updating in draw, this is bad, don't do it
particle_system.prototype.draw = function (ctx){
  ctx.save();
  ctx.translate(this.x, this.y);
  for (var itor=0; itor<particleArray.length; ++itor) {
    var currentParticle = particleArray[itor];
    
    if(currentParticle.lifetime > 0) {
	  ctx.globalAlpha = 0.25;
      ctx.fillStyle= "#000000"
      ctx.beginPath();
	  ctx.arc(currentParticle.x, currentParticle.y, currentParticle.radius, Math.PI*2, false);
      ctx.fill();
      
      currentParticle.y+=currentParticle.xspeed;
      currentParticle.x+=currentParticle.yspeed;
    }
    else {
      var r = Math.random()*this.speed;
	  var t = Math.random()*2*Math.PI;
	  var xs = r * Math.cos(t);
	  var ys = r * Math.sin(t);
	  currentParticle.x = 10-Math.random()*20;
	  currentParticle.y = 10-Math.random()*20;
	  currentParticle.radius = Math.random()*this.radius;
	  currentParticle.xspeed = xs;
	  currentParticle.yspeed = ys;
	  currentParticle.lifetime = Math.random()*this.lifetime;
    }
    currentParticle.lifetime--;
  }
  ctx.restore();
}