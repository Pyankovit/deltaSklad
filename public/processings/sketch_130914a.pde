int NUM_BOIDS = 100;
int DIST_THRESHOLD1 = 10;
int DIST_THRESHOLD2 = 20;
int DIST_THRESHOLD3 = 30;
float FACTOR_COHESION = 100;
float FACTOR_SEPARATION = 10;
float FACTOR_ALINGMENT = 10;
float VELOCITY_LIMIT = 3;
float TRAIL_SCALE = 2;

float r1 = 1.0; // Cohesion:   pull to center of flock
float r2 = 0.8; // Separation: avoid bunching up
float r3 = 0.1; // Alingment:  match average flock speed

Boid[] flock = new Boid[NUM_BOIDS];

PFont font;
String msg = "";
   
void setup(){
  size(500, 300);  
  background(0);
  
  randomSeed(int(random(1,1000)));
  
  for(int i=0; i<NUM_BOIDS; ++i){
    flock[i] = new Boid();
    flock[i].xpos = random(0, width);
    flock[i].ypos = random(0, height);
     
    flock[i].vx = random(-5, 5);
    flock[i].vy = random(-5, 5);
  }
  
  frameRate(30);
  noSmooth();
  
  font = createFont("Courier", 12);
  msg = "Area("+DIST_THRESHOLD1+","+DIST_THRESHOLD2+","+DIST_THRESHOLD3+") Velocity("+VELOCITY_LIMIT+")";
}

 
void draw(){
  fill(0, 0, 0, 50);
  noStroke();
  rect(0, 0, width, height);
  
  noFill();
  stroke(255);
  for(int i=0; i<NUM_BOIDS; ++i){
    flock[i].update();
    flock[i].drawMe();
  }
  
  noStroke();
  fill(30);
  rect(0, height-20, width, height);
  fill(200);
  textFont(font);
  text(msg, 7, height-7);
}

void mousePressed(){
  DIST_THRESHOLD1 = round(random(1,30));
  DIST_THRESHOLD2 = DIST_THRESHOLD1+round(random(1,20));
  DIST_THRESHOLD3 = DIST_THRESHOLD2+round(random(1,20));
  VELOCITY_LIMIT = random(1, 10);
  msg = "Area("+DIST_THRESHOLD1+","+DIST_THRESHOLD2+","+DIST_THRESHOLD3+") Velocity("+VELOCITY_LIMIT+")";
  //println("AREA("+DIST_THRESHOLD1+","+DIST_THRESHOLD2+","+DIST_THRESHOLD3+") VELOCITY("+VELOCITY_LIMIT+")");
}
 
class Boid{
  Vector v1 = new Vector();
  Vector v2 = new Vector();
  Vector v3 = new Vector();
  
  float xpos, ypos;
  float vx, vy;
  
  void drawMe(){
    line(xpos, ypos, xpos-TRAIL_SCALE*vx, ypos-TRAIL_SCALE*vy);
  }
   
  void update(){
    v1.x = v1.y = v2.x = v2.y = v3.x = v3.y = 0;
    
    rule1();
    rule2();
    rule3();
    
    // add vectors to velocities
    vx += r1*v1.x + r2*v2.x + r3*v3.x;
    vy += r1*v1.y + r2*v2.y + r3*v3.y;
    
    limitVelocity();
    
    xpos += vx;
    ypos += vy;
    
    if(xpos < 0){
      xpos = width;
    } else if(xpos > width){
      xpos = 0;
    }
    if(ypos < 0){
      ypos = height;
    } else if(ypos > height){
      ypos = 0;
    }
  }
  
  void limitVelocity(){
    float velocity = sqrt(sq(vx) + sq(vy));
    if(velocity > VELOCITY_LIMIT){
      vx = (vx/velocity)*VELOCITY_LIMIT;
      vy = (vy/velocity)*VELOCITY_LIMIT;
    }
  }
  
  // Cohesion
  void rule1(){
    float len = 0;
    int count = 0;
    
    for(int i=0; i < NUM_BOIDS; ++i){
      if(this != flock[i]){
        len = dist(xpos, ypos, flock[i].xpos, flock[i].ypos);
        if(len > DIST_THRESHOLD2 && len < DIST_THRESHOLD3){
          v1.x += flock[i].xpos;
          v1.y += flock[i].ypos;
          count++;
        }
      }
    }
    
    if(count > 0){
      v1.x /= count;
      v1.y /= count;
      v1.x = (v1.x - xpos) / FACTOR_COHESION;
      v1.y = (v1.y - ypos) / FACTOR_COHESION;
    }
  }
  
  // Separation
  void rule2(){
    float len = 0;
    
    for(int i=0; i < NUM_BOIDS; ++i){
      if(this != flock[i]){
        len = dist(xpos, ypos, flock[i].xpos, flock[i].ypos);
        if(len < DIST_THRESHOLD1){
          v2.x -= (flock[i].xpos - xpos)/FACTOR_SEPARATION;
          v2.y -= (flock[i].ypos - ypos)/FACTOR_SEPARATION;
        }
      }
    }
  }
  
  // Alingment
  void rule3(){
    float len = 0;
    int count = 0;
    
    for(int i=0; i < NUM_BOIDS; ++i){
      if(this != flock[i]){
        len = dist(xpos, ypos, flock[i].xpos, flock[i].ypos);
        if(len > DIST_THRESHOLD1 && len < DIST_THRESHOLD2){
          v3.x += flock[i].vx;
          v3.y += flock[i].vy;
          count++;
        }
      }
    }
    
    if(count > 0){
      v3.x /= count;
      v3.y /= count;
      v3.x = (v3.x - vx)/FACTOR_ALINGMENT;
      v3.y = (v3.y - vy)/FACTOR_ALINGMENT;
    }
  }
}

class Vector{
  float x, y;
  
  public Vector(){
    x = 0;
    y = 0;
  }
  
  public Vector(float inX, float inY){
    x = inX;
    y = inY;
  }
}

