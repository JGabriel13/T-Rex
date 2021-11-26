var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, trex_jumping;
var ground, groundImage, invisibleGround;

var cloudsGroup, cloud, cloudImage;
var obstaclesGroup, cacto, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;

var score;

var gameOverImage, restartImage, gameOver, restart;
var jumpSound , scoreSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
  
  restartImage = loadImage("restart.png")
  gameOverImage = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  scoreSound = loadSound("checkPoint.mp3")
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    trex = createSprite(50,height-60,20,20);
    trex.addAnimation("running",trex_running);
    trex.addAnimation("collided",trex_collided);

    trex.scale = 0.5;

    trex.debug = false;
    trex.setCollider("circle",0,0,50);

    ground = createSprite(width/2,height-30,width,20);
    ground.addImage("ground", groundImage);
    
    invisibleGround = createSprite(300,height-25,600,10);
    invisibleGround.visible = false;

    restart = createSprite(width/2,height/2,20,20);
    gameOver = createSprite(width/2,restart.y-40,100,20);
    
    gameOver.addImage(gameOverImage);
    restart.addImage(restartImage);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup = new Group();
    cloudsGroup = new Group();  
    
    score = 0;
}

function draw(){
    background("white");

    if(trex.isTouching(obstaclesGroup)){
        gameState = END;
        trex.changeAnimation("collided",trex_collided);
        dieSound.play();
    }
        
    if (gameState === PLAY) {

        score = Math.round(frameCount/2);

        if (score >0 && score%100 === 0) {
          scoreSound.play();
        }

        if(touches.lenght > 0 || keyDown("space") && trex.y >= height-60) {
          trex.velocityY = -10;
          jumpSound.play(); 
          
          touches = [];
        }
       
        ground.velocityX = -(2+(score/100));

        if(ground.x < 0) {
          ground.x = ground.width/2;
        }        

        spawnClouds();
        spawnObstacles();
        
        
    } else if(gameState === END) {
      ground.velocityX = 0;

      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);

      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      gameOver.visible = true;
      restart.visible = true;

      if(mousePressedOver(restart)) {
        frameCount = 0;
        score = 0;
        gameState = PLAY;

        gameOver.visible = false;
        restart.visible = false;

        obstaclesGroup.destroyEach();
        cloudsGroup.destroyEach();

        trex.changeAnimation("running",trex_running);
      }
    }   
    trex.velocityY += 0.5;

    trex.collide(invisibleGround);

    textSize(20);
    strokeWeight(2);
    text("Pontuação: "+score,width-180,height-180);   

    drawSprites();
}

function spawnClouds() {
    if(frameCount%100 === 0){
        cloud = createSprite(width,height-150,30,10);
        cloud.addImage(cloudImage);
        cloud.velocityX = -(2+(score/100));
        cloud.y = Math.round(random(height-190,height-150));
        cloud.scale = random(0.2,1);
        cloud.depth = trex.depth -1;
        cloud.lifetime = 330;
        cloudsGroup.add(cloud);
    }    
}

function spawnObstacles() {
    if(frameCount % 150 === 0){
        cacto = createSprite(width,height-50,10,30);
        var sorteio = Math.round(random(3,3));
        switch (sorteio) {
            case 1: cacto.addImage(cacto1);
            cacto.scale = 0.5;
                break;
            case 2: cacto.addImage(cacto2);
            cacto.scale = 0.5;
                break;
            case 3: cacto.addImage(cacto3);
            cacto.scale = 0.5;
                break;
            case 4: cacto.addImage(cacto4);
            cacto.scale = 0.5;
                break;
            case 5: cacto.addImage(cacto5);
            cacto.scale = 0.5;
                break;
            case 6: cacto.addImage(cacto6);
            cacto.scale = 0.5;
                break;
        
        }
        cacto.velocityX = -(2+(score/100));
        cacto.depth = trex.depth -1;
        cacto.lifetime = 300;
        obstaclesGroup.add(cacto);
    }
}
