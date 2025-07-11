//html elements
const board = document.getElementById("game-board");
const instructions = document.getElementById("enter-text");
const highest_score = document.getElementById("high-score");
const score = document.getElementById("current-score");

//variables
const grid_size = 20;
let snake = [{x: 11, y: 10}];
let direction = "up";
let game_interval;
let speed_delay = 200;
let high_score = 0;

let food = generateFood();
let game_start = false;

let touchstartX = 0;
let touchstartY = 0;


//main functions
function drawGame() {
    if (game_start) {
        board.innerHTML = '';
        drawSnake();
        drawFood();
        updateCurrentScore();
    }
}

function createCube(element_tag, className) {
    const cube = document.createElement(element_tag);
    cube.className = className;
    return cube;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


//functions
function drawSnake() {
    snake.forEach((cube) => {
        const snakeCube = createCube("div", "snake");
        setPosition(snakeCube, cube);
        board.appendChild(snakeCube);
    });
}

function drawFood() {
    const food_cube = createCube("div", "food");
    setPosition(food_cube, food);
    board.appendChild(food_cube);
}

function generateFood() {
    const x = Math.floor(Math.random() * grid_size) + 1;
    const y = Math.floor(Math.random() * grid_size) + 1;
    return {x, y};
}


//movement
function move() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
        head.y--;
        break;
    case 'down':
        head.y++;
        break;
    case 'left':
        head.x--;
        break;
    case 'right':
        head.x++;
        break;
    }
    snake.unshift(head); 

    //increasing
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(game_interval);
        
        game_interval = setInterval(() => {
            move();
            drawGame();
        }, speed_delay)
    }
    else {
        snake.pop();
    }
    checkCollision();
}

function increaseSpeed() {
    if (speed_delay > 150) {
        speed_delay -= 5;
    }
    else if (speed_delay > 100) {
        speed_delay -= 3;
    }
    else if (speed_delay > 50) {
        speed_delay -= 2;
    }
    else if (speed_delay > 25) {
        speed_delay -= 1;
    }
}

function checkCollision() {
    const snake_head = snake[0];

    //borders
    if (snake_head.x < 1 || snake_head.y < 1 || snake_head.x > grid_size || snake_head.y > grid_size) {
        endGame();
    }

    //itself
    for (let i = 1; i < snake.length; i++) {
        if (snake_head.x === snake[i].x && snake_head.y === snake[i].y) {
            endGame();
        }
    }
}

//listeners
function keyEvent(event) {
    if(!game_start && event.key === ' ') {
        startGame();
    }
    else {
        switch (event.key) {
            case "ArrowUp":
            case 'w':
            case 'W':
                if (snake.length === 1) {
                    direction = "up";
                }
                else if (direction != "down") {
                    direction = "up";
                }
                break;
            case "ArrowDown":
            case "s":
            case "S":
                if (snake.length === 1) {
                    direction = "down";
                }
                else if (direction != "up") {
                    direction = "down";
                }
                break;   
            case "ArrowRight":
            case "d":
            case "D":
                if (snake.length === 1) {
                    direction = "right";
                }
                else if (direction != "left") {
                    direction = "right";
                }
                break; 
            case "ArrowLeft":
            case "a":
            case "A":
                if (snake.length === 1) {
                    direction = "left";
                }
                else if (direction != "right") {
                    direction = "left";
                }
                break;  
        }
    }
}


//mobile touchable
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchend", handleTouchEnd, false);

function touchStart(event) {
    touchstartX = event.touches[0].clientX;
    touchstartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    const touch_x = event.changedTouches[0].clientX;
    const touch_y = event.changedTouches[0].clientY;

    const direction_x = touch_x - touchstartX;
    const direction_y = touch_y - touchstartY;

    if (!game_start) {
            startGame();
    }

    if (game_start) {
        const tap_long = 30;

        //horizontal swipe
        if (Math.abs(direction_x) > Math.abs(direction_y)) {
            if (Math.abs(direction_x) > tap_long) {
                //right
                if (direction_x > 0) {
                    if (snake.length === 1 || direction !== "left") {
                        direction = "right";
                    }
                } 
                //left
                else {
                    if (snake.length === 1 || direction !== "right") {
                        direction = "left";
                    }
                }
            }
        //vertical swipe
        } 
        else {
            if (Math.abs(direction_y) > tap_long) {
                //down
                if (direction_y > 0) {
                    if (snake.length === 1 || direction !== "up") {
                        direction = "down";
                    }
                //up
                } 
                else {
                    if (snake.length === 1 || direction !== "down") {
                        direction = "up";
                    }
                }
            }
        }
    }
}


//game setup
function startGame() {
    
    game_start = true;
    instructions.style.display = "none";
    score.textContent = "000";
    highest_score.textContent = high_score.toString().padStart(3, '0');

    food = generateFood();
    clearInterval(game_interval);

    game_interval = setInterval(() => {
        move();
        drawGame();
    }, speed_delay);
}

function endGame() {
    const snake_head = document.querySelector(".snake"); 
    snake_head.classList.add("red-snake");

    updateHighScore();
    clearInterval(game_interval);
    snake = [{x:11, y:10}];
    direction = "up";
    speed_delay = 200;
    game_start = false;

    instructions.style.display = "block";
    drawGame();
}

function updateCurrentScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > high_score) {
        high_score = currentScore;
        highest_score.textContent = high_score.toString().padStart(3, '0');
    }
}

document.addEventListener("keydown", keyEvent);
setTouchControl(board, keyEvent);