Screen.prototype = new Sprite();
function Screen(alwaysUpdate, alwaysDraw) {
  Sprite.call(this);
  
  this.alwaysUpdate = alwaysUpdate;
  this.alwaysDraw = alwaysDraw;
  
  this.stage = new Sprite();
  this.addChild(this.stage);
  
  this.gui = new GUI(gInput);
  this.addChild(this.gui);
  
  this.intialized = false;
}

Screen.prototype.init = function() {
  
}

ScreenManager.prototype = new Sprite();
function ScreenManager() {
  Sprite.call(this);
  
  this.screens = new List();
}

ScreenManager.prototype.update = function(d) {
  var screens = this.screens;
  
  for (var node = screens.head; node != null; node = node.link) {
    var screen = node.item;
	
	/*if (node != screens.tail) {
	  screen.gui.visible = false;
	}
	else {
	  screen.gui.visible = true;
	}*/
	screen.gui.visible = node == screens.tail;    
	
	if (screen.alwaysUpdate || node == screens.tail) {
	  if(!screen.initialized){
	    screen.init();
		screen.initialized = true;
	  }
	  screen.update(d);
	}
  }
}

ScreenManager.prototype.draw = function(ctx) {
  var screens = this.screens;
  
  for (var node = screens.head; node != null; node = node.link) {
    var screen = node.item;
	
	if ((screen.alwaysDraw || node == screens.tail) && screen.initialized) {
	  screen.draw(ctx);
	}
  }
}

ScreenManager.prototype.push = function(screen){
  this.screens.remove(screen);
  this.screens.push(screen);
}

ScreenManager.prototype.pop = function(){
  if (this.screens.tail == null) return null;
  this.screens.tail.item.gui.visible = false;
  return this.screens.pop();
}

ScreenManager.prototype.remove = function(screen){
  screen.gui.visible = false;
  this.screens.remove(screen);
}

function empty_screens() {
  while (screenMan.pop() != null);
}