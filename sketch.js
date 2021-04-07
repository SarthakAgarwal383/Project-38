var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var ob1,ob2,ob3,ob4,ob5,ob6;
var obstaclesGroup,cloudsGroup;
var gameState;
var PLAY= 1;
var END= 0;
var score,count;
var gameOver,gameOver_img,reset_img,reset;
var die,jump,checkpoint;
var bgImg,bg,bgMusic;

function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png")
  
  ob1=loadImage("obstacle1.png");
  ob2=loadImage("obstacle2.png");
  ob3=loadImage("obstacle3.png");
  ob4=loadImage("obstacle4.png");
  ob5=loadImage("obstacle5.png");
  ob6=loadImage("obstacle6.png");
  
  cloud=loadImage("cloudImg1.png");
  
  gameOver_img=loadImage("gameOver.png");
  reset_img=loadImage("restart.png");
  
  die=loadSound("die.mp3");
  jump=loadSound("jump.mp3");
  checkpoint=loadSound("checkPoint.mp3");
  bgImg= loadImage("desertImage.jpg");
  //bgMusic= loadSound("bgMusic.mp3");
}

function setup() {
  createCanvas(600, 200);

   bg= createSprite(width/2,-50,10,10);
   bg.addImage(bgImg);
   bg.scale=2;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
 // trex.velocityX= 4;
  
  trex.addAnimation("collide",trex_collided);
  
  ground = createSprite(300,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,40000,10);
  invisibleGround.visible = false;
  
  ObstaclesGroup=new Group();
  CloudsGroup=new Group();
  
  PLAY=1;
  END=0;
  gameState=PLAY;
  
  count=0;
  score=0;
  
  gameOver= createSprite(trex.x,80,10,10);
  gameOver.visible=false;
  gameOver.addImage(gameOver_img);
  gameOver.scale=0.5;
  
  reset=createSprite(trex.x,120,10,10);
  reset.visible=false;
  reset.addImage(reset_img);
  reset.scale=0.5;
}

function draw() {
  background("aqua");

  camera.position.x= trex.x;
 camera.position,y= width/2;

 console.log(gameState);
  
  if(gameState===PLAY){
    //bgMusic.play();
    if(score%100==0 &&  score>0){
      checkpoint.play();
    }
  //ground.velocityX = -(6+(score/100));
    trex.velocityX= +(6+(score/100));
    
    if(keyDown("space") && trex.y>160) {
    trex.velocityY = -15;
      jump.play();
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  if (invisibleGround.x < 0){
    invisibleGround.x = invisibleGround.width/2;
  }
  if(trex.x>800){
    trex.x= 200;
  }
    clouds();
  obstacles();
    
    count=count+1;
    score=Math.round(count/5);
    if(ObstaclesGroup.isTouching(trex)){
      gameState=END;
      die.play();
    }
  }
  if(gameState===END){
     gameOver.visible=true;
     gameOver.x= trex.x;
     gameOver.y= trex.y-100;
     reset.visible=true;
     reset.x= trex.x;
     reset.y= trex.y-50;
     
     ground.velocityX=0;
     trex.velocityX=0;
     ObstaclesGroup.setVelocityXEach(0);
     CloudsGroup.setVelocityXEach(0);
     ObstaclesGroup.setLifetimeEach(-1);
     CloudsGroup.setLifetimeEach(-1);
    
     trex.velocityY=0;
     trex.changeAnimation("collide",trex_collided);
    if(mousePressedOver(reset)){
      restart();
    }
  }
  
  

  
  trex.collide(invisibleGround);
  
  
  
  drawSprites();

  textSize(20);
  fill("black");
  text("Score:"+score,trex.x+100,50);
  
}
function obstacles(){
  if(frameCount%180==0){
    var r=Math.round(random(1,6));
    
      var ob10=createSprite(520,170,10,10);
 switch(r){
   case 1:ob10.addImage(ob1);
     break;
     case 2:ob10.addImage(ob2);
     break;
     case 3:ob10.addImage(ob3);
     break;
     case 4:ob10.addImage(ob4);
     break;
     case 5:ob10.addImage(ob5);
     break;
     case 6:ob10.addImage(ob6);
     break;
     
     default:break;
 }
     
     ob10.lifetime=200;
     //ob10.velocityX=-(6+(score/100));
     ob10.scale=0.5;
     
     ObstaclesGroup.add(ob10);
 
  
}
}
  function clouds(){
    if(frameCount%200==0){
      var cl= createSprite(520,100,10,10);
      
      cl.y=Math.round(random(60,120));
      cl.addImage(cloud);
      //cl.velocityX=-5;
      cl.lifetime=200;
      
      cl.depth=trex.depth;
      trex.depth=trex.depth+1;
      
      cl.scale=0.4;
      
      CloudsGroup.add(cl);
    }
  }
function restart(){
  gameState=PLAY;
  trex.changeAnimation("running",trex_running);
  score=0;
  count=0;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  gameOver.visible=false;
  reset.visible=false;
  ground.velocityX=-5;
}