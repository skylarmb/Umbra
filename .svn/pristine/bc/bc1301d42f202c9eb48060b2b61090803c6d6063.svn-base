//Ease of access to B2D classes
var b2Vec2 = Box2D.Common.Math.b2Vec2, b2BodyDef = Box2D.Dynamics.b2BodyDef, b2Body = Box2D.Dynamics.b2Body, b2FixtureDef = Box2D.Dynamics.b2FixtureDef, b2Fixture = Box2D.Dynamics.b2Fixture, b2World = Box2D.Dynamics.b2World, b2MassData = Box2D.Collision.Shapes.b2MassData, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

//Constants & Vectors
var maxSpeedRight = 5;
var maxSpeedLeft = -5;
var minSpeedRight = 2;
var minSpeedLeft = -2;
var kPlayerWeight = .50;
var vJumpForce = new b2Vec2(0, -8);
var vStopForce = new b2Vec2(0, 12);
var vRightForce = new b2Vec2(minSpeedRight, 0);
var vLeftForce = new b2Vec2(minSpeedLeft, 0);
var vMaxVelY = new b2Vec2(0, -1);
var kMaxVelY = 12;
var kScale = 100;
var vel;
var speed;
var centerOfSprite = new b2Vec2();
var kJumpHeight = 18;
var jump_timer = kJumpHeight;
var has_jumped = false;

var bottomOfPlayer, topOfBlock;

function physics() {
  // todo(AJ): move this code to it's own function
  // bug: the character turns into a static body after it hits the floor
  //      movement is difficult to control until this does happen and gravity
  //      is nonexistant at this point
  if (debug) {
    // todo(AJ): camera offset the debug boxes
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(kScale);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(10.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.SetDebugDraw(debugDraw);
  }
}

// todo(AJ): clean this up
physics.prototype = new b2World(new b2Vec2(0, 25), true);

physics.prototype.applyBBoxToSprite = function(sprite, type) {
  var fixDef = new b2FixtureDef;
  fixDef.density = kPlayerWeight;
  fixDef.friction = 0.3;
  fixDef.restitution = 0.001;
  fixDef.shape = new b2PolygonShape;

  var bodyDef = new b2BodyDef;
  bodyDef.fixedRotation = true;

  bodyDef.type = type;
  bodyDef.position.x = sprite.x / kScale;
  bodyDef.position.y = sprite.y / kScale;
  fixDef.shape.SetAsBox(sprite.width / (2*kScale), sprite.height / (2*kScale));
  //fixDef.shape.SetAsCircle()
  sprite.body = this.CreateBody(bodyDef);
  sprite.fix = sprite.body.CreateFixture(fixDef);

  sprite.update = function(d) {
    var pos = this.body.GetPosition();

    if (this.left) {
      if(vLeftForce.x > -maxSpeedRight){
        vLeftForce.x = vLeftForce.x - 1;
      }
      RightLeftMovement(vLeftForce, this);
    } else {
      if(vLeftForce.x < minSpeedLeft){
        vLeftForce.x = vLeftForce.x + 1;
      }
    }
    
    if (this.right) {
      if(vRightForce.x < maxSpeedRight){
        vRightForce.x = vRightForce.x + 1;
      }
      RightLeftMovement(vRightForce, this);
    }else{
      if(vRightForce.x > minSpeedRight){
        vRightForce.x = vRightForce.x - 1;
      }
    }
    
    if (this.jump || this.up) {
      if (jump_timer > 0) {
        has_jumped = true;
        this.body.ApplyForce(vJumpForce, this.body.GetPosition());
        jump_timer--;
        
      }
    }else if(has_jumped && this.body.m_linearVelocity.y < -0.1){
      has_jumped = false;
      this.body.ApplyForce(vStopForce, this.body.GetPosition());
    }
    
	  this.x = pos.x * kScale - this.width / 2;
    this.y = pos.y * kScale - this.height / 2;
    this.rotation = this.body.GetAngle();
    this.xoffset = global_camera.x;
    this.yoffset = global_camera.y;
  }
}

function RightLeftMovement(vForce, sprite){  
  centerOfSprite.x = sprite.body.GetPosition().x;
  centerOfSprite.y = sprite.body.GetPosition().y + (sprite.height / 2);
  sprite.body.ApplyForce(vForce, centerOfSprite);
  if (sprite.body.m_linearVelocity.x > 5) {
    sprite.body.m_linearVelocity.x = 5;
  }else if (sprite.body.m_linearVelocity.x < -5) {
    sprite.body.m_linearVelocity.x = -5;
  }
}

physics.prototype.addContactListener = function(callbacks) {
  var listener = new Box2D.Dynamics.b2ContactListener;
  if (callbacks.BeginContact)
    listener.BeginContact = function(contact) {
      callbacks.BeginContact(contact.GetFixtureA().GetBody().GetUserData(), contact.GetFixtureB().GetBody().GetUserData());
      var normal = contact.m_manifold.m_localPlaneNormal;
	  if (normal.x == 0 && normal.y == 1) {
	    jump_timer = kJumpHeight;
	  }
	  // todo(AJ): fix bug where player is stuck on wall here
	  //           friction issue, can be resolved by looking at normal
    }
  if (callbacks.EndContact)
    listener.EndContact = function(contact) {
      callbacks.EndContact(contact.GetFixtureA().GetBody().GetUserData(), contact.GetFixtureB().GetBody().GetUserData());
    }
  if (callbacks.PostSolve)
    listener.PostSolve = function(contact, impulse) {
      callbacks.PostSolve(contact.GetFixtureA().GetBody().GetUserData(), contact.GetFixtureB().GetBody().GetUserData(), impulse.normalImpulses[0]);
    }
  this.SetContactListener(listener);
}

physics.prototype.add_sprite = function(sprite, type) {
  if (type == "static")
    this.applyBBoxToSprite(sprite, b2Body.b2_staticBody);
  else if (type == "dynamic")
    this.applyBBoxToSprite(sprite, b2Body.b2_dynamicBody);
}
