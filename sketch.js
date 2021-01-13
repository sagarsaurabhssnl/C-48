var spaceShip, spaceShipImg, spaceShipDestroy, gameOverImg, gameOver;
var gameState = 1;
var alien;
var alienImg1, alienImg2, alienImg3;
var alienImg = [];
var score = 0;
var bulletImg, bullet;
var ag = [], alienCount = 0, alienGroup;
var bg1, bg2, bg3, bulletCount = 1;
var health = 200;
var reload = 0;

function preload() {
    spaceShipImg = loadImage("images/spaceship.png");
    alienImg1 = loadImage("images/1.png");
    alienImg2 = loadImage("images/2.png");
    alienImg3 = loadImage("images/3.png");
    alienImg = [alienImg1, alienImg2, alienImg3];
    bulletImg = loadImage("images/bullet.png");
    spaceShipDestroy = loadImage("images/destroy.png");
    gameOverImg = loadImage("images/gameover.png");
}
function setup() {
    createCanvas(400, 600);
    spaceShip = createSprite(200, 550, 50, 50);
    spaceShip.addImage("alive",spaceShipImg);    
    spaceShip.addImage("destroy",spaceShipDestroy);    
    spaceShip.scale = 0.1;
    gameOver = createSprite(200, 300);
    gameOver.addImage(gameOverImg);
    gameOver.visible = false;
    alienGroup = new Group();
    bg1 = new Group();
    bg2 = new Group();
    bg3 = new Group();
}

function draw() {
    background(200);
    fill("red");
    drawSprites();
    playState();
    endGame();
    text("Score: " + score, 330, 20);
}

function keyPressed() {
    if (keyCode === 37 && spaceShip.x > 25 && gameState === 1) {
        spaceShip.x -= 20;
    }
    if (keyCode === 39 && spaceShip.x < 375 && gameState === 1) {
        spaceShip.x += 20;
    }
    if (keyCode === 32 && gameState === 1) {
        if (reload === 0) {
            reload = 1;
            bullet = createSprite(spaceShip.x, spaceShip.y);
            bullet.addImage(bulletImg);
            bullet.velocityY = -15;
            bullet.scale = 0.1;
            bullet.lifetime = 100;
            switch (bulletCount) {
                case 1: bg1.add(bullet);
                    break;
                case 2: bg2.add(bullet);
                    break;
                case 3: bg3.add(bullet);
                    break;
                default: break;
            }
            bulletCount += 1;
            if (bulletCount === 4) {
                bulletCount = 1;
            }
            setTimeout(() => {
                reload = 0
            }, 800);
        }
    }
}

function playState() {
    if (gameState === 1) {
        if (frameCount % (100 - score) === 0) {
            alien = createSprite(Math.round(random(50, 350)), 20, 20, 40);
            alien.velocityY = 2;
            alien.scale = 0.1;
            alien.lifetime = 320;
            alien.addImage(random(alienImg));
            alienGroup.add(alien);
            ag[alienCount] = new Group();
            ag[alienCount].add(alien);
            alienCount += 1;
        }
        alienKill();
        damage();
        fill(150);
        rect(0, 200, 20, 200);
        fill("#ff0000");
        rect(0, 200, 20, health);
    }
}

function endGame() {
    if (gameState === 0) {
        spaceShip.changeImage("destroy");
        gameOver.visible = true;
        alienGroup.destroyEach();
    }
}

function alienKill() {
    for (var b1 = 0; b1 < ag.length; b1++) {
        if (bg1.length !== 0 && ag[b1].isTouching(bg1)) {
            ag[b1].destroyEach();
            score += 1;
            bg1.destroyEach();
        }
    }
    for (var b2 = 0; b2 < ag.length; b2++) {
        if (bg2.isTouching(ag[b2])) {
            ag[b2].destroyEach();
            score += 1;
            bg2.destroyEach();
        }
    }
    for (var b3 = 0; b3 < ag.length; b3++) {
        if (bg3.isTouching(ag[b3])) {
            ag[b3].destroyEach();
            score += 1;
            bg3.destroyEach();
        }
    }
}

function damage() {
    for (var d = 0; d < ag.length; d++) {
        if (spaceShip.isTouching(ag[d])) {
            ag[d].destroyEach();
            health -= 50;
        }
    }
    if (health <= 0) {
        gameState = 0
    }
}