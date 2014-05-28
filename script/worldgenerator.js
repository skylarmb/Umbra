//World Generator class
var entityPerChunk = 0;
var maxEntityPerChunk = 4;
var minEntityPerChunk = 2;
var totalChunks = 4;
var chunkWidth = kCanvasWidth / (totalChunks - 2);
var chunkHeight = kCanvasHeight;
var currChunkNum = 0;

var minEntWid = 110;
var maxEntWid = 160;
var avgEntWid = Math.round((maxEntWid + minEntWid) / 2);
var maxYDisplace = 60;
var minYDisplace = 32;
var yspeed = -2;
var kChunkHeight = 32;
var kPrevHeight = kCanvasHeight-120;
var platformForce = new b2Vec2(0,-25);

var moving_boxes = new Array();

var chunkQ = [];

function chunk(x, y, pieces, entities) {
	this.x = x;
	this.y = y;
	this.pieces = pieces;
	this.entities = entities;
}

function worldgenerator(number) {
	for(var tmp = 0; tmp < totalChunks; tmp++) {
	  chunkQ.push(this.create_chunks());
	}
	
}

worldgenerator.prototype = new Sprite();

worldgenerator.prototype.update = function(d) {
	if(chunkQ[0].x + 2 * chunkWidth < -global_camera.x) {
	  this.recycle(0);
	}
	//debug_log("chunk[0].x: " + (chunkQ[0].x + 2 * chunkWidth) + " global_camera.x: " + global_camera.x);
	//debug_log(chunkQ[0].x + 3 * chunkWidth < global_camera.x);
    physics_engine.makeMove(moving_boxes);
}

worldgenerator.prototype.create_chunks = function() {
	var queue = [];
	do {
	  entityPerChunk = 3;//Math.round( (Math.random() * 4) + 0.499); //add .499 to give fair odds for all numbers 
	}while (entityPerChunk == 0) //redo if zero is selected
	for(var temp = 0; temp < entityPerChunk; temp++) {
	  // these variables are needed to keep track of the previous positions of each block between chunks
	  //var xPOS = Math.round(Math.random() * (chunkWidth / entityPerChunk) + (chunkWidth / entityPerChunk  * temp)) + currChunkNum * chunkWidth;
	  var xPOS = 0;//(temp * (chunkWidth/entityPerChunk)) + currChunkNum * chunkWidth;
	  //var xWIDTH = Math.round(Math.random() * (maxEntWid - minEntWid) + minEntWid) + (maxEntWid/entityPerChunk);
	  var xWIDTH = avgEntWid * (3 / entityPerChunk); //* (Math.pow((2 * temp / 3), 1.3) + 1);
	  /*while(xPOS + xWIDTH > Math.round(chunkWidth / entityPerChunk * (temp + 1)) + currChunkNum * chunkWidth) {
	    xPOS = Math.round(Math.random() * ((chunkWidth - maxEntWid) / entityPerChunk) + ((chunkWidth - maxEntWid) / entityPerChunk  * temp)) + currChunkNum * chunkWidth;
	    xWIDTH = Math.round(Math.random() * (maxEntWid - minEntWid)) + minEntWid;
	  }*/
	  kPrevHeight += 32;//Math.pow(-1, Math.round(1 - Math.random())) * (Math.round(Math.random() * maxYDisplace)) + minYDisplace;
	  while(kPrevHeight > kCanvasHeight - 120) {
	    kPrevHeight -=  (Math.round(Math.random() * (maxYDisplace + 10))) + minYDisplace;
	  }
      load_sprite('chunk_' + currChunkNum + '_piece_' + temp,
	    xPOS, //each chunk is further to the right
		kPrevHeight,
		xWIDTH,
		kChunkHeight,
		"img/sprites/box.png",
		"static");	
	  var platform = eval('chunk_' + currChunkNum + '_piece_' + temp);
	  queue.push(platform);
	}
	var tChunk = new chunk(currChunkNum * chunkWidth, 0, queue, entityPerChunk);
	
	currChunkNum++;

	return tChunk;
}

//Recycles the oldest 
worldgenerator.prototype.recycle = function(notZero) {
	var oldChunk = chunkQ.shift();
	//kPrevHeight = kCanvasHeight-150 + Math.pow(-1, Math.round(1 - Math.random())) * 32;
	do {
	  entityPerChunk = Math.round( (Math.random() * 1) + 2); //add 2.499 to give fair odds for all numbers 
	}while (entityPerChunk == 0) //redo if zero is selected
	for(var temp = 0; temp < entityPerChunk; temp++) {
	  var oldPiece = oldChunk.pieces.shift();
	  kPrevHeight += Math.pow(-1, Math.round(1 - Math.random())) * (Math.round(Math.random() * maxYDisplace)) + minYDisplace;
	  while(kPrevHeight > kCanvasHeight-120)
	    kPrevHeight -=  (Math.round(Math.random() * (maxYDisplace))) + minYDisplace;
	  //Find next xPOS and xWIDTH but make sure it wont extend into the next zone
	  //var xPOS = Math.round(Math.random() * ((chunkWidth - maxEntWid) / entityPerChunk) + ((chunkWidth - maxEntWid) / entityPerChunk  * temp)) + currChunkNum * chunkWidth;
	  var xPOS = (temp * (chunkWidth/entityPerChunk)) + currChunkNum * chunkWidth;
	  if(entityPerChunk == 1) xPOS += 50; // prevent collision
	  //var xWIDTH = avgEntWid * (2.75 / entityPerChunk); //* (Math.pow((2 * temp / 3), 1.3) + 1);
	  //var xWIDTH = Math.round(Math.random() * (maxEntWid - minEntWid) + minEntWid * (maxEntityPerChunk/entityPerChunk));
	  /*while(xPOS + xWIDTH > Math.round(chunkWidth / entityPerChunk * (temp + 1)) + currChunkNum * chunkWidth) {
	    xPOS = Math.round(Math.random() * (chunkWidth / entityPerChunk) + (chunkWidth / entityPerChunk  * temp)) + currChunkNum * chunkWidth;
	    xWIDTH = Math.round(Math.random() * (maxEntWid - minEntWid)) + minEntWid;
	  }*/
	  oldPiece.x = xPOS;
	  oldPiece.y = kPrevHeight;
	  //oldPiece.width = xWIDTH;
	  oldPiece.height = kChunkHeight;
	  //debug_log("X: " + oldPiece.x + " Y: " + oldPiece.y);
	  oldPiece.body.SetPosition(new b2Vec2(oldPiece.x/100, oldPiece.y/100));
	  oldPiece.fix.m_shape.SetAsBox(oldPiece.width / 200, oldPiece.height / 200);
	  oldChunk.pieces.push(oldPiece);
	}
	// put extra pieces of chunk away
	for(var temp = entityPerChunk; temp < 4; temp++) {
	  var oldPiece = oldChunk.pieces.shift();
	  kPrevHeight += Math.pow(-1, Math.round(1 - Math.random())) * (Math.round(Math.random() * maxYDisplace)) + minYDisplace;
	  while(kPrevHeight > kCanvasHeight-120) {
	    kPrevHeight -=  (Math.round(Math.random() * (maxYDisplace))) + minYDisplace;
	  }
	  var xPOS = (temp * (chunkWidth/entityPerChunk)) + currChunkNum * chunkWidth;
	  //var xWIDTH = avgEntWid * (2.75 / entityPerChunk);
	  
	  
	  oldPiece.x = xPOS;
	  oldPiece.y = kPrevHeight - ((8+ temp) * (kPrevHeight + 75)); // OFF screen
	  //oldPiece.width = xWIDTH;
	  oldPiece.height = kChunkHeight;
	  oldPiece.body.SetPosition(new b2Vec2(oldPiece.x/100, oldPiece.y/100));
	  //oldPiece.fix.m_shape.SetAsBox(oldPiece.width / 200, oldPiece.height / 200);
	  oldChunk.pieces.push(oldPiece);
	}
	oldChunk.x += totalChunks * chunkWidth;
	oldChunk.entities = entityPerChunk;
	currChunkNum++;
	if(notZero > 0)
	  oldChunk.x = (notZero - 1) * chunkWidth;
    chunkQ.push(oldChunk);
    
}

worldgenerator.prototype.initialize = function() {
	currChunkNum = 0;
	kPrevHeight = kCanvasHeight-150;
	for(var tmp = 0; tmp < totalChunks; tmp++) {
	  this.recycle(tmp+1);
	}
    //make_moving_box("random_box", 500, 400, 300, 50, "img/sprites/box.png");
    //make_moving_box("random_box1", 0, 400, 100, 50, "img/sprites/box.png");
    //random_box.body.m_linearDamping = 0;
}

physics.prototype.makeMove = function(){
    //console.log(random_box.y);
    for( var i = 0; i < moving_boxes.length; i++){
      if(moving_boxes[i].y > moving_boxes[i].originalY-200 && moving_boxes[i].y < moving_boxes[i].originalY+600){
        //console.log("getting here " + yspeed);
        moving_boxes[i].body.ApplyForce(platformForce,moving_boxes[i].body.GetPosition());
        moving_boxes[i].body.m_linearVelocity.x = 0;
      }
    }
}

Sprite.prototype.originalY=0;

function make_moving_box(name, x, y, w, h, img){

load_sprite(name, x, y, w, h, img, "dynamic");
moving_boxes.push(eval(name));
eval(name).originalY = y;
}

physics.prototype.makeShapes = function(){
//EXPERIMENTAL RANDOM SHAPE CODE
    ////////////////////////////////////////////////////
    /*
    
     var SCALE=30;
     var fixDef = new b2FixtureDef;
       fixDef.density = 1.0;
       fixDef.friction = 0.5;
       fixDef.restitution = 0.2;
    
    
       var bodyDef = new b2BodyDef;
     
       //create ground
       bodyDef.type = b2Body.b2_staticBody;
       
       // positions the center of the object (not upper left!)
       bodyDef.position.x = kCanvasWidth / 2 / SCALE;
       bodyDef.position.y = canvas.height / SCALE;
       
       fixDef.shape = new b2PolygonShape;
       
       // half width, half height. eg actual height here is 1 unit
       //fixDef.shape.SetAsBox((600 / SCALE) / 2, (10/SCALE) / 2);
       //this.CreateBody(bodyDef).CreateFixture(fixDef);
     
       //create some objects
       bodyDef.type = b2Body.b2_dynamicBody;
       var boxWidth;
       var boxHeight;
    for(var i = 0; i < 20; ++i) {
          if(Math.random() > 0.5) {
            boxWidth=Math.random() + 0.1;
            boxHeight=Math.random() + 0.1;
             fixDef.shape = new b2PolygonShape;
             fixDef.shape.SetAsBox(
                   boxWidth/2//half width
                ,  boxHeight/2 //half height
             );
          } else {
             //fixDef.shape = new b2CircleShape(
             //   Math.random() + 0.1 /100//radius
            // );
          }
          bodyDef.position.x = Math.random() * 25;
          bodyDef.position.y = Math.random() * 10;
          //load_sprite("randomeObject", bodyDef.position.x, bodyDef.position.y, boxWidth*600, boxHeight*600, "img/sprites/box.png", "dynamic");
          this.CreateBody(bodyDef).CreateFixture(fixDef);
          console.log("made a shape at: " + bodyDef.position.x+","+bodyDef.position.y);
       }
       
    */   
    ////////////////////////////////////////////////////////////////
        /*var random_box = new Sprite();
        var xLoc = 0;
        for(var i = 0; i < 20; ++i) {
            random_box = new Sprite();
            random_box.width=Math.random()*100;
            random_box.height=Math.random()*50;
            xLoc += random_box.width + 10;
            random_box.x=xLoc;      
            random_box.y=0;
            random_box.image = Textures.load("img/sprites/square.png");
            physics_engine.applyBBoxToSprite(random_box,"dynamic");
        }
        */
    }
    


