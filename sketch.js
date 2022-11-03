var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player, playerAnim, playerDead;
var start, startImg;
var floor, floorImg, floorGroup;
var spike, spikeImg, spikeGroup;
var spark, sparkImg, sparkGroup;

var score

var gameOver, gameOverImg;
var restart, restartImg;

var backG, backGGroup, BrickS, BrickB, Plant;

var JumpSound, GOSound, LoopMusic;

function preload(){
playerAnim = loadAnimation("Player-1.png", "Player-2.png", "Player-3.png", "Player-4.png", "Player-5.png");
playerDead = loadAnimation("Player-Dead.png");
startImg = loadImage("Start.png");
floorImg = loadImage("Floor.png");
spikeImg = loadImage("Spike.png");
sparkImg = loadImage("Spark.png");
gameOverImg = loadImage("Game-Over.png");
restartImg = loadImage("Restart.png");
BrickS = loadImage("Brick-S.png");
BrickB = loadImage("Brick-B.png");
Plant = loadImage("Plant.png");
JumpSound = loadSound("Jump-SFX.wav");
GOSound = loadSound("Game-Over.wav");
LoopMusic = loadSound ("Loop-Music.wav");
}

function setup() {
 createCanvas(windowWidth,windowHeight)

 LoopMusic.loop();

 player = createSprite(100,200,30,30)
 player.addAnimation("Run", playerAnim);
 player.addAnimation("Dead", playerDead)
 player.scale=0.2;

 start = createSprite(100,windowHeight/2,30,30)
 start.addImage("Brick", startImg);
 start.scale=0.2;

 floorGroup = new Group();
 spikeGroup = new Group();
 sparkGroup = new Group();
 backGGroup = new Group();

 gameOver = createSprite(windowWidth/2,200,40,40)
 gameOver.addImage("Lose", gameOverImg);
 gameOver.scale=0.4;

 restart = createSprite(windowWidth/2,windowHeight/2,40,40)
 restart.addImage("Retry", restartImg);
 restart.scale=0.4;

 score = 0;
}

function draw() {
 background("black")

 stroke("White");
 fill("White");
 textSize(20);
 text("SCORE: "+ score, 1200, 25);

 if(gameState === PLAY){

   if(score == 25){
      start.x = 2000
      start.y = -500
   }

   gameOver.visible = false;
   restart.visible = false;

   if(keyDown("right_arrow")){
    player.x = player.x + 8
 }

 if(keyDown("left_arrow")){
    player.x = player.x - 8
 }

 if(keyDown("space") && player.collide(start)){
    player.velocityY = -20
    JumpSound.play();
 }

 if(keyDown("space") && player.collide(floorGroup)){
    player.velocityY = -20
    JumpSound.play();
 }

 player.velocityY = player.velocityY + 1;

 spawnBack();
 spawnFloor();
 spawnSpike();
 spawnSpark();

 if(frameCount % 10 === 0) {
    score = score + 1;
 }

 if(spikeGroup.isTouching(player) || sparkGroup.isTouching(player) || player.y > 600){
    gameState = END;
    GOSound.play()
 }

 }
 else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    player.changeAnimation("Dead", playerDead);
    player.velocityY = 0;
    player.velocityX = 0;
    floorGroup.setVelocityXEach(0);
    spikeGroup.setVelocityXEach(0);
    sparkGroup.setVelocityXEach(0);
    backGGroup.setVelocityXEach(0);

    floorGroup.setLifetimeEach(-1);
    spikeGroup.setLifetimeEach(-1);
    sparkGroup.setLifetimeEach(-1);
    backGGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart) || keyDown("enter")){
      reset();
    }
 }
 
 player.collide(start);
 player.collide(floorGroup);

 drawSprites();

}

function reset() {
   gameState = PLAY;
   floorGroup.destroyEach();
   spikeGroup.destroyEach();
   sparkGroup.destroyEach();
   backGGroup.destroyEach();
   player.changeAnimation("Run", playerAnim);
   score = 0;
   player.x = 100;
   player.y = 200;
   start.x = 100;
   start.y = windowHeight/2;
}

function spawnBack() {
   if(frameCount % 50 === 0){
      backG = createSprite(1500,300,20,20)
      backG.y = Math.round(random(windowHeight));
      backG.velocityX = -9;

      rand = Math.round(random(1,3));
      switch(rand) {
         case 1: backG.addImage("B1", BrickS);
           break;
         case 2: backG.addImage("B2", BrickB);
           break;
         case 3: backG.addImage("B3", Plant);
         break;
      }
      backG.scale=0.2

      backG.lifetime = 300;

      backG.depth = player.depth
      backG.depth = backG.depth - 1;


      backGGroup.add(backG);
   }
}

function spawnFloor() {

 if (frameCount % 60 === 0) {
  floor = createSprite(1500,550,20,20)
  floor.y = Math.round(random(200,450));
  floor.addImage("Grass", floorImg);
  floor.scale=0.2;
  floor.velocityX = -7;

  floor.lifetime = 300;

  floor.depth = gameOver.depth
  gameOver.depth = gameOver.depth + 1;
  floor.depth = restart.depth
  restart.depth = restart.depth + 1;

  floorGroup.add(floor);
 }

}

function spawnSpike() {

    if (frameCount % 70 === 0) {
        spike = createSprite(1500,400,20,20)
        spike.y = Math.round(random(100,600));
        spike.addImage("Trap", spikeImg);
        spike.scale=0.2;
        spike.velocityX = -6;

        spike.lifetime = 300;

        spike.setCollider("circle",0,0,25);
        spike.debug = false

        spike.depth = gameOver.depth
        gameOver.depth = gameOver.depth + 1;
        spike.depth = restart.depth
        restart.depth = restart.depth + 1;

        spikeGroup.add(spike);
    }
}

function spawnSpark() {

    if (frameCount % 80 === 0 && score > 150) {
        spark = createSprite(1500,400,20,20)
        spark.y = Math.round(random(100,600));
        spark.addImage("Enemy", sparkImg);
        spark.scale=0.2;
        spark.velocityX = -5;

        spark.lifetime = 300;

        spark.setCollider("circle",0,0,140);
        spark.debug = false

        spark.depth = gameOver.depth
        gameOver.depth = gameOver.depth + 1;
        spark.depth = restart.depth
        restart.depth = restart.depth + 1;

        sparkGroup.add(spark);
    }
}