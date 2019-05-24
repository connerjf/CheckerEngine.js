let gameOn = confirm("Ready to play?");
let checkerBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
]
let gameState = {};

let possibleMoves = [];
let favourableMoves = [];
let legalPlayerMoves = [];
let bestMoves = [];
let whoseMove = 2;
let stalemate = false;
let winner = 0;
let blackCaptures = 0;
let redCaptures = 0;
let mouseX;
let mouseY;
let selectedX;
let selectedY;
let redMove = '';
let clicks = 0;
let loops = 0;

function preload() {
  gameState.load.image('checkerBoardPic', 'images/1n020.jpg');
}

function create() {
  gameState.add.text(195, 86, "Checkers Game!",
    { font: "50px Arial", fill: "#9fc2f9" });
  gameState.add.image(386, 436, 'checkerBoardPic');
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (checkerBoard[i][j] == 1) {
        gameState.blackCheckers = this.add.circle(j * 69 + 144, i * 70 + 194, 32, 0x00000);
      } else if (checkerBoard[i][j] == 2) {
        gameState.redCheckers = this.add.circle(j * 69 + 144, i * 69 + 194, 32, 0xFF0000);
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: "#6d0000",
  scene: {
    preload,
    create
  }
};

let game = new Phaser.Game(config)

function blackMoves() {
  //Check every piece on the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //if it's a black piece than find the possible moves
      if (checkerBoard[i][j] === 1) {
        for (let right = -1; right <= 1; right += 2) {
          try {
            //If the spaces diagonally forwards are clear then add to moveslist
            if (checkerBoard[i + 1][j + right] == 0) {
              possibleMoves.push(String(i) + String(j) + String(i + 1) + String(j + right));
              //If the spaces diagonally forwards are enemy pieces and the pieces
              //two spaces diagonally are clear, then hop and capture piece
            } else if (checkerBoard[i + 1][j + right] == 2 && checkerBoard[i + 2][j + (right * 2)] == 0) {
              favourableMoves.push(String(i) + String(j) + String(i + 2) + String(j + (right * 2)) + String(i + 1) + String(j + right));
              let doubleMidPosRight = j + (right * 2);
              let doubleMidPosDown = i + 2;
              for (let right2 = -1; right2 <= 1; right2 += 2) {
                if (checkerBoard[doubleMidPosDown + 1][doubleMidPosRight + right2] == 2 && checkerBoard[doubleMidPosDown + 2][doubleMidPosRight + (right2 * 2)] == 0) {
                  bestMoves.push(String(i) + String(j) + String(i + 4) + String(doubleMidPosRight + (right2 * 2)) + String(i + 1) + String(j + right) + String(doubleMidPosDown + 1) + String(doubleMidPosRight + right2));
                  break;
                }
              }
            }
          } catch (err) { }
        }
      }
    }
  }
}

function moreFavourableMoves(possibleMoves) {
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i].charAt(2) == 3 || possibleMoves[i].charAt(2) == 4) {
      if (possibleMoves[i].charAt(3) == 3 || possibleMoves[i].charAt(3) == 4) {
        favourableMoves.push(possibleMoves[i]);
      }
    }
  }
}

function chooseBlackMove(possibleMoves, favourableMoves, bestMoves) {
  if (bestMoves.length > 0) {
    blackMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  } else if (favourableMoves.length > 0) {
    blackMove = favourableMoves[Math.floor(Math.random() * favourableMoves.length)];
  } else if (possibleMoves.length > 0) {
    blackMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  } else {
    blackStalemate = true;
  }
}

function moveBlackPiece(blackMove) {
  if (blackMove.length == 4) {
    checkerBoard[blackMove.charAt(0)][blackMove.charAt(1)] = 0;
    checkerBoard[blackMove.charAt(2)][blackMove.charAt(3)] = 1;
    whoseMove = 2;
  } else if (blackMove.length == 6) {
    checkerBoard[blackMove.charAt(0)][blackMove.charAt(1)] = 0;
    checkerBoard[blackMove.charAt(2)][blackMove.charAt(3)] = 1;
    checkerBoard[blackMove.charAt(4)][blackMove.charAt(5)] = 0;
    blackCaptures += 1;
    whoseMove = 2;
  } else if (blackMove.length == 8) {
    checkerBoard[blackMove.charAt(0)][blackMove.charAt(1)] = 0;
    checkerBoard[blackMove.charAt(2)][blackMove.charAt(3)] = 1;
    checkerBoard[blackMove.charAt(4)][blackMove.charAt(5)] = 0;
    checkerBoard[blackMove.charAt(6)][blackMove.charAt(7)] = 0;
    blackCaptures += 2;
    whoseMove = 2;
  }

}

function playerMoves() {
  //Check every piece on the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //if it's a black piece than find the possible moves
      if (checkerBoard[i][j] == 2) {
        for (let rright = -1; rright <= 1; rright += 2) {
          try {
            //If the spaces diagonally forwards are clear then add to moveslist
            if (checkerBoard[i - 1][j + rright] == 0) {
              legalPlayerMoves.push(String(i) + String(j) + String(i - 1) + String(j + rright));
              //If the spaces diagonally forwards are enemy pieces and the pieces
              //two spaces diagonally are clear, then hop and capture piece
            } else if (checkerBoard[i - 1][j + rright] == 1 && checkerBoard[i - 2][j + (rright * 2)] == 0) {
              legalPlayerMoves.push(String(i) + String(j) + String(i - 2) + String(j + (rright * 2)) + String(i - 1) + String(j + rright));
              let doubleMidPosRight = j + (rright * 2);
              let doubleMidPosDown = i - 2;
              for (let right2 = -1; right2 <= 1; right2 += 2) {
                if (checkerBoard[doubleMidPosDown - 1][doubleMidPosRight + right2] == 1 && checkerBoard[doubleMidPosDown - 2][doubleMidPosRight + (right2 * 2)] == 0) {
                  legalPlayerMoves.push(String(i) + String(j) + String(i - 4) + String(doubleMidPosRight + (right2 * 2)) + String(i - 1) + String(j + rright) + String(doubleMidPosDown - 1) + String(doubleMidPosRight + right2));
                  break;
                }
              }
            }
          } catch (err) { }
        }
      }
    }
  }
}

function mousePosition(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
  console.log(mouseX + "hello" + mouseY);
  selectRedPiece(legalPlayerMoves);
}


function selectRedPiece(legalPlayerMoves) {
  if (mouseX > 107 && mouseX < 662 && mouseY < 712 && mouseY > 155 && whoseMove == 2 && clicks < 2) {
    mouseX = mouseX - 108;
    mouseY = mouseY - 158;
    selectedX = Math.floor(mouseX / 70);
    selectedY = Math.floor(mouseY / 70);
    console.log(selectedX);
    console.log(selectedY);
    redMove = redMove + selectedY.toString() + selectedX.toString();
    console.log(redMove);
    clicks++;
  }
  if (clicks == 2) {
    moveRedPiece();
  }
}

function moveRedPiece() {
  for (let i = 0; i < legalPlayerMoves.length; i++) {
    if (legalPlayerMoves[i].slice(0, 4) == redMove) {
      if (legalPlayerMoves[i].length == 4) {
        checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
        console.log("hello");
        console.log(checkerBoard);
        whoseMove = 1;
        console.log(whoseMove);
        console.log(config.scene.create());

      } else if (legalPlayerMoves[i].length == 6) {
        checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
        checkerBoard[legalPlayerMoves[i].charAt(4)][legalPlayerMoves[i].charAt(5)] = 0;
        redCaptures += 1;
        console.log("helloo");
        whoseMove = 1;

      } else if (legalPlayerMoves[i].length == 8) {
        checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
        checkerBoard[legalPlayerMoves[i].charAt(4)][legalPlayerMoves[i].charAt(5)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(6)][legalPlayerMoves[i].charAt(7)] = 0;
        redCaptures += 2;
        console.log("hellooo");
        whoseMove = 1;

    function moveRedPiece() {
      for (let i = 0; i < legalPlayerMoves.length; i++) {
        if (legalPlayerMoves[i].slice(0, 4) == redMove) {
          if (legalPlayerMoves[i].length == 4) {
            checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
            checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
            console.log("hello");
            console.log(checkerBoard);
            whoseMove = 1;
            console.log(whoseMove);
            gameState.scene.restart();

          } else if (legalPlayerMoves[i].length == 6) {
            checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
            checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
            checkerBoard[legalPlayerMoves[i].charAt(4)][legalPlayerMoves[i].charAt(5)] = 0;
            redCaptures += 1;
            console.log("helloo");
            whoseMove = 1;
            gameState.scene.restart();

          } else if (legalPlayerMoves[i].length == 8) {
            checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
            checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
            checkerBoard[legalPlayerMoves[i].charAt(4)][legalPlayerMoves[i].charAt(5)] = 0;
            checkerBoard[legalPlayerMoves[i].charAt(6)][legalPlayerMoves[i].charAt(7)] = 0;
            redCaptures += 2;
            console.log("hellooo");
            whoseMove = 1;
            gameState.scene.restart();
          }
        }
      }
    }
  }
  redMove = '';
  clicks = 0;
}

if (whoseMove == 1) {
  blackMoves();
  moreFavourableMoves(possibleMoves);
  chooseBlackMove(possibleMoves, favourableMoves, bestMoves);
  console.log("The possible moves for black are: " + possibleMoves);
  console.log("The favourable moves for black are: " + favourableMoves);
  console.log("The best moves for black are: " + bestMoves);
  console.log(blackMove);
  moveBlackPiece(blackMove);
} else if (whoseMove == 2) {
  playerMoves();
  console.log("The legal player moves are: " + legalPlayerMoves);
}
