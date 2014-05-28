var debug = false;

var screenMan;

//background sprite
var bg1;
var bg2;

//different screens
var mainMenu;
var gameScreen;
var pauseMenu;
var deathScreen;

var particles;
var physics_engine;
var world_generator;
var player1;
var playerimg;
var floor_sprite;
var global_camera;
var darkness1;
var score;
var mute;

var kSpeed = 12;
var kSpriteWidth = 59;
var kSpriteHeight = 338;

// todo(AJ): calculate this based off canvas size
var kSpawnX = 48;
var kSpawnY = 50;
var kCanvasWidth = 1280;
var kCanvasHeight = 720;

function ScoreManager() {};
ScoreManager.prototype = new Sprite();
ScoreManager.prototype.draw = function(ctx) {
  if (score != null) {
    document.getElementById("score").innerHTML="Score: " + Math.floor(score);
    ctx.font="30px Arial";
    ctx.strokeText("Score:" + Math.floor(score),10,50);
  }
  else
    document.getElementById("score").innerHTML="";
  
}

function init_game() {
  clearColor = [1,1,1,1];
  use2D = true;
  initGame("canvas");
  screenMan = new ScreenManager();
  screenMan.index = 1000000;
  scoreMan = new ScoreManager();
  scoreMan.index =  -1;
  world.addChild(scoreMan);
  world.addChild(screenMan);
  var mute_cookie = get_cookie("mute");
  mute = true;//mute_cookie != undefined && mute_cookie == "true";
  if (!debug && !mute) Sounds.loop("sound/525954_Imagination---LH-Re.ogg");

  //make main menu
  mainMenu = new Screen(false, false);
  screenMan.push(mainMenu);
  mainMenu.image = Textures.load("img/menu/menu.png");
  mainMenu.width = kCanvasWidth;
  mainMenu.height = kCanvasHeight;
  mainMenu.init = function() {
    var newGame = new Button();
    var mouseIn = Textures.load("img/menu/new_game_over.png"); //when the mouse is in the bounding box, AKA over the new game image
    var mouseOut = Textures.load("img/menu/new_game_notover.png"); //when the mouse is outside the bounding box (normal)
    var mousePressed = Textures.load("img/menu/new_game_over.png"); //when the mouse is pressed down on the new game button
    newGame.image = mouseOut;
    newGame.x = -70 + kCanvasWidth / 2;
    newGame.y = 100 + kCanvasHeight / 2;
    newGame.width = 200;
    newGame.height = 50;
    newGame.onMouseOut = function(){
      newGame.image = mouseOut;
    }
    newGame.onMouseIn = function(){
      newGame.image = mouseIn;
    }
    newGame.onMouseDown = function(){
      newGame.image = mousePressed;
    }
    this.gui.addChild(newGame);
    newGame.func = function() {
      screenMan.push(gameScreen);
	  screenMan.remove(mainMenu);
    }
  }
  gameScreen = new Screen(true, true);
  //gameScreen.image = Textures.load("img/backgrounds/bg.png");
  function loadBackground () {
    // todo: fix this scrolling
	bg1 = new Sprite();
    bg1.x = 0;
    bg1.y = 0;
    bg1.width = kCanvasWidth; 
    bg1.height = kCanvasHeight;
    bg1.image = Textures.load("img/backgrounds/bg_seamless.png");
	bg1.index = 1000;
    gameScreen.addChild(bg1);
	bg2 = new Sprite();
	bg2.x = kCanvasWidth;
    bg2.y = 0;
    bg2.width = kCanvasWidth; 
    bg2.height = kCanvasHeight;
    bg2.image = Textures.load("img/backgrounds/bg_seamless.png");
	bg2.index = 1000;
    gameScreen.addChild(bg2);
  }
  
  function background_update(d) {
    bg1.x = bg1.ix - player1.x/8;
	bg2.x = bg2.ix - player1.x/8;
	if (bg1.x < -kCanvasWidth) {
	  bg1.ix += 2*kCanvasWidth;
	}
	if (bg2.x < -kCanvasWidth) {
	  bg2.ix += 2*kCanvasWidth;
	}
  }
  
  gameScreen.width = kCanvasWidth;
  gameScreen.height = kCanvasHeight;
  loadBackground();
  physics_engine = new physics();
  // todo: figure out how to move this
  physics_engine.addContactListener({
    BeginContact : function(idA, idB) {
    },
    EndContact : function(idA, idB) {
    },
  });
  global_camera = new camera(0,0);
  player1 = new player();
  
  world_generator = new worldgenerator(3);
  set_keybinds();
  showConsole = debug;
  load_sprite("floor_sprite", 0, kCanvasHeight - 50, kCanvasWidth*4, 50, "img/sprites/box.png", "static");
  darkness1 = new darkness();
  darkness1.index = 5;
  gameScreen.addChild(darkness1);
  gameScreen.addChild(player1);
  gameScreen.alpha = 0.5;
  particles = new particle_system(1,1,1,1, kCanvasWidth/2, kCanvasHeight/2);
  gameScreen.init = function(){
    bg1.x = 0;
    bg1.y = 0;
	bg1.ix = 0;
	bg2.x = kCanvasWidth;
	bg2.y = 0;
	bg2.ix = kCanvasWidth;
	score = 0;
	player1.initialize();
	darkness1.initialize();
	world_generator.initialize();
  }
  gameScreen.update = function(d) {
    background_update(d);
	score += darkness1.speed/100;
	update_input();
    physics_engine.Step(1/60, 10, 10);
    physics_engine.ClearForces();
    global_camera.update(d);
    world_generator.update(d);
    this.__proto__.update.call(this, d);
  }
  gameScreen.draw = function(ctx){
    if (debug) {
	   ctx.save();
	   ctx.translate(global_camera.x, global_camera.y);
	   physics_engine.DrawDebugData();
	   ctx.restore();
	  }
    if (!debug) this.__proto__.draw.call(this,ctx);
    //particles.draw(ctx);
	darkness1.drawparticles(ctx);
  }
}

function update_input() {
  player1.left = gInput.left || gInput.left2;
  player1.right = gInput.right || gInput.right2;
  player1.up = gInput.up || gInput.up2;
  player1.jump = gInput.jump || gInput.jump2 || gInput.jump3;
}

function gameover() {
  //score = null;
  empty_screens();
  death_screen = new Screen(false, false);
  death_screen.image = Textures.load("img/backgrounds/game_over.png");
  death_screen.width = kCanvasWidth;
  death_screen.height = kCanvasHeight;
  death_screen.init = function() {
    var newGame = new Button();
    var mouseIn = Textures.load("img/menu/new_game_over.png");
    var mouseOut = Textures.load("img/menu/new_game_notover.png");
    var mousePressed = Textures.load("img/menu/new_game_over.png");
    newGame.image = mouseOut;
    newGame.x = -70 + kCanvasWidth / 2;
    newGame.y = 80 + kCanvasHeight / 2;
    newGame.width = 200;
    newGame.height = 50;
    newGame.onMouseOut = function(){
      newGame.image = mouseOut;
    }
    newGame.onMouseIn = function(){
      newGame.image = mouseIn;
    }
    newGame.onMouseDown = function(){
      newGame.image = mousePressed;
    }
    this.gui.addChild(newGame);
    newGame.func = function() {
	  gameScreen.initialized = false;
	  empty_screens();
      screenMan.push(gameScreen);
    }
    var quote = new Sprite();
    quote.image = Textures.load("img/menu/quote.png");
    quote.x = newGame.x - 75;
    quote.y = newGame.y + 50;
    quote.width = 350;
    quote.height = 150;
    this.addChild(quote);
  }
  screenMan.push(death_screen);
}

function main_menu(){
  
}

// todo(AJ): set this so they bind to properties
//   these properties should be on objects for now
function set_keybinds() {
  // arrows + z
  gInput.addBool(37, "left");
  gInput.addBool(38, "up");
  gInput.addBool(39, "right");
  gInput.addBool(40, "down");
  gInput.addBool(90, "jump");
  // WASD space
  gInput.addBool(65, "left2");
  gInput.addBool(87, "up2");
  gInput.addBool(68, "right");
  gInput.addBool(83, "down2");
  gInput.addBool(32, "jump2");
}

// todo(AJ): clean this up
// this is very dirty, don't do this
function load_sprite(name, x, y, width, height, image, type) {
  eval(name + '= new Sprite(); ' +
  name + '.x = x; ' +
  name + '.y = y; ' +
  name + '.width = width; ' +
  name + '.height = height; ' +
  name + '.image = Textures.load(image); ' +
  'gameScreen.addChild(' + name + '); ' +
  'physics_engine.add_sprite(' + name + ', type); ' +
  name + '.HasJumped = false;');
}


// Camera
function camera(x,y) {
  this.x = x;
  this.y = y;
}
camera.prototype.update = function(d) {
	//return;
  var dx = player1.x - kCanvasWidth/2 + player1.width/2;
  var dy = player1.y - kCanvasHeight/2 + player1.height/2;
  if (Math.abs(this.x + dx) > 1) {
    this.x = -dx;
  }
  if (Math.abs(this.y + dy) > 1) {
    this.y = -dy;
  }
}

function toggle_mute() {
  if (mute) {
    mute = false;
    set_cookie("mute", "false", 180);
  }
  else {
    mute = true;
    set_cookie("mute", "true", 180);
  }
  Sounds.toggleMuted();
}

// Utility functions

// sets a cookie
function set_cookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

// gets the value of a cookie
function get_cookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y).split(",");
    }
  }
}

// function to load other javascript files
// this can be used to remove clutter in the html file
// also ensure files are loaded at the correct time
function add_script(url) {
  var el = document.createElement('script');
  el.async = false;
  el.src = url;
  el.type = 'text/javascript';
  (document.getElementsByTagName('HEAD')[0]||document.body).appendChild(el);
}

// debug logging messages
// will only log when debug is enabled
function debug_log(message) {
  if (debug) console.log(message);
}