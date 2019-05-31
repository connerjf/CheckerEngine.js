let gameOn = confirm("Ready to play?");
//Previous Phaser Code
/* const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  backgroundColor: "#6d0000",
  scene: {
    preload,
    create,
    moveRedPiece
  }
};

let game = new Phaser.Game(config)
*/

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
let blackMove = '';
let clicks = 0;
let loops = 0;

//Previous code for adding circles
/*
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (checkerBoard[i][j] == 1) {
        this.add.circle(j * 69 + 144, i * 70 + 194, 32, 0x00000);
      } else if (checkerBoard[i][j] == 2) {
        this.add.circle(j * 69 + 144, i * 69 + 194, 32, 0xFF0000);
      }
    }
  }
*/

//Finds every possible computer move and assigns them to 1 of 3 arrays
//depending on how beneficial they are
function blackMoves() {
  //Check every piece on the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //if it's a black piece than find the possible moves
      if (checkerBoard[i][j] === 1) {
        for (let right = -1; right <= 1; right += 2) {
          try {
            //If the spaces diagonally forwards are clear then add to moveslist
            if (checkerBoard[i + 1][j + right] === 0) {
              possibleMoves.push(String(i) + String(j) + String(i + 1) + String(j + right));
              //If the spaces diagonally forwards are enemy pieces and the pieces
              //two spaces diagonally are clear, then hop and capture piece
            } else if (checkerBoard[i + 1][j + right] == 2 && checkerBoard[i + 2][j + (right * 2)] === 0) {
              favourableMoves.push(String(i) + String(j) + String(i + 2) + String(j + (right * 2)) + String(i + 1) + String(j + right));
              let doubleMidPosRight = j + (right * 2);
              let doubleMidPosDown = i + 2;
              for (let right2 = -1; right2 <= 1; right2 += 2) {
                if (checkerBoard[doubleMidPosDown + 1][doubleMidPosRight + right2] == 2 && checkerBoard[doubleMidPosDown + 2][doubleMidPosRight + (right2 * 2)] === 0) {
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

//Checks if any of the possibleMoves moves a piece to the center pieces,
//if so it adds that piece to the favourableMoves array
function moreFavourableMoves(possibleMoves) {
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i].charAt(2) == 3 || possibleMoves[i].charAt(2) == 4) {
      if (possibleMoves[i].charAt(3) == 3 || possibleMoves[i].charAt(3) == 4) {
        favourableMoves.push(possibleMoves[i]);
      }
    }
  }
}

//Computer determines which move to make
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

//Turns the string for moves into actual moves on the computer by changing the main checkerBoard array
function moveBlackPiece(blackMove) {
  if (blackMove.length == 4) {
    checkerBoard[blackMove.charAt(0)][blackMove.charAt(1)] = 0;
    checkerBoard[blackMove.charAt(2)][blackMove.charAt(3)] = 1;

    let $newMove = '#' + blackMove.charAt(2).toString() + blackMove.charAt(3).toString();
    let $oldMove = '#' + blackMove.charAt(0).toString() + blackMove.charAt(1).toString();
    $('#table').find($newMove).addClass("checkerPiece black");
    $('#table').find($oldMove).removeClass("checkerPiece black");
    whoseMove = 2;
  } else if (blackMove.length == 6) {
    checkerBoard[blackMove.charAt(0)][blackMove.charAt(1)] = 0;
    checkerBoard[blackMove.charAt(2)][blackMove.charAt(3)] = 1;
    checkerBoard[blackMove.charAt(4)][blackMove.charAt(5)] = 0;
    let $newMove = '#' + blackMove.charAt(2).toString() + blackMove.charAt(3).toString();
    let $oldMove = '#' + blackMove.charAt(0).toString() + blackMove.charAt(1).toString();
    let $capture = '#' + blackMove.charAt(4).toString() + blackMove.charAt(5).toString();
    $('#table').find($newMove).addClass("checkerPiece black");
    $('#table').find($oldMove).removeClass("checkerPiece black");
    $('#table').find($capture).removeClass("checkerPiece red");
    blackCaptures += 1;
    whoseMove = 2;
  } else if (blackMove.length == 8) {
    checkerBoard[blackMove.charAt(0)][blackMove.charAt(1)] = 0;
    checkerBoard[blackMove.charAt(2)][blackMove.charAt(3)] = 1;
    checkerBoard[blackMove.charAt(4)][blackMove.charAt(5)] = 0;
    checkerBoard[blackMove.charAt(6)][blackMove.charAt(7)] = 0;
    let $newMove = '#' + blackMove.charAt(2).toString() + blackMove.charAt(3).toString();
    let $oldMove = '#' + blackMove.charAt(0).toString() + blackMove.charAt(1).toString();
    let $capture = '#' + blackMove.charAt(4).toString() + blackMove.charAt(5).toString();
    let $capture2 = '#' + blackMove.charAt(6).toString() + blackMove.charAt(7).toString();
    $('#table').find($newMove).addClass("checkerPiece black");
    $('#table').find($oldMove).removeClass("checkerPiece black");
    $('#table').find($capture).removeClass("checkerPiece red");
    $('#table').find($capture2).removeClass("checkerPiece red");
    blackCaptures += 2;
    whoseMove = 2;
  }

}

//Finds the legal moves for the player
function playerMoves() {
  //Check every piece on the board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //if it's a black piece than find the possible moves
      if (checkerBoard[i][j] == 2) {
        for (let rright = -1; rright <= 1; rright += 2) {
          try {
            //If the spaces diagonally forwards are clear then add to moves list
            if (checkerBoard[i - 1][j + rright] === 0) {
              legalPlayerMoves.push(String(i) + String(j) + String(i - 1) + String(j + rright));
              //If the spaces diagonally forwards are enemy pieces and the pieces
              //two spaces diagonally are clear, then hop and capture piece
            } else if (checkerBoard[i - 1][j + rright] == 1 && checkerBoard[i - 2][j + (rright * 2)] === 0) {
              legalPlayerMoves.push(String(i) + String(j) + String(i - 2) + String(j + (rright * 2)) + String(i - 1) + String(j + rright));
              let doubleMidPosRight = j + (rright * 2);
              let doubleMidPosDown = i - 2;
              for (let right2 = -1; right2 <= 1; right2 += 2) {
                if (checkerBoard[doubleMidPosDown - 1][doubleMidPosRight + right2] == 1 && checkerBoard[doubleMidPosDown - 2][doubleMidPosRight + (right2 * 2)] === 0) {
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

//Gets the position of a mouse click from the player and then calls the selectRedPiece function
function mousePosition(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
  console.log(mouseX + "hello" + mouseY);
  selectRedPiece(legalPlayerMoves);
}

//Finds which piece the player clicked on based off of the coordinates of the pieces compared to the click
//Once you click twice, the moveRedPiece function is called
function selectRedPiece(legalPlayerMoves) {
  for (i in $("table")) {
    for (p in $("tr")) {
      p.onclick(() => {
        return p.id
      })
    }
  }
}

//Changes the move string of the players move to an actual change in the main checkerBoard array
function moveRedPiece() {
  for (let i = 0; i < legalPlayerMoves.length; i++) {
    if (legalPlayerMoves[i].slice(0, 4) === redMove) {
      console.log("slice");
      if (legalPlayerMoves[i].length == 4) {
        checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
        console.log("hello");
        console.log(checkerBoard);
        let $newMove = '#' + legalPlayerMoves[i].charAt(2).toString() + legalPlayerMoves[i].charAt(3).toString();
        let $oldMove = '#' + legalPlayerMoves[i].charAt(0).toString() + legalPlayerMoves[i].charAt(1).toString();
        $('#table').find($newMove).addClass("checkerPiece red");
        $('#table').find($oldMove).removeClass("checkerPiece red");
        whoseMove = 1;
        console.log(whoseMove);
      } else if (legalPlayerMoves[i].length == 6) {
        checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
        checkerBoard[legalPlayerMoves[i].charAt(4)][legalPlayerMoves[i].charAt(5)] = 0;
        redCaptures += 1;
        let $newMove = '#' + legalPlayerMoves[i].charAt(2).toString() + legalPlayerMoves[i].charAt(3).toString();
        let $oldMove = '#' + legalPlayerMoves[i].charAt(0).toString() + legalPlayerMoves[i].charAt(1).toString();
        let $capture = '#' + legalPlayerMoves[i].charAt(4).toString() + legalPlayerMoves[i].charAt(5).toString();
        $('#table').find($newMove).addClass("checkerPiece red");
        $('#table').find($oldMove).removeClass("checkerPiece red");
        $('#table').find($capture).removeClass("checkerPiece black");
        console.log("helloo");
        whoseMove = 1;
      } else if (legalPlayerMoves[i].length == 8) {
        checkerBoard[legalPlayerMoves[i].charAt(0)][legalPlayerMoves[i].charAt(1)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(2)][legalPlayerMoves[i].charAt(3)] = 2;
        checkerBoard[legalPlayerMoves[i].charAt(4)][legalPlayerMoves[i].charAt(5)] = 0;
        checkerBoard[legalPlayerMoves[i].charAt(6)][legalPlayerMoves[i].charAt(7)] = 0;
        redCaptures += 2;
        let $newMove = '#' + legalPlayerMoves[i].charAt(2).toString() + legalPlayerMoves[i].charAt(3).toString();
        let $oldMove = '#' + legalPlayerMoves[i].charAt(0).toString() + legalPlayerMoves[i].charAt(1).toString();
        let $capture = '#' + legalPlayerMoves[i].charAt(4).toString() + legalPlayerMoves[i].charAt(5).toString();
        let $capture2 = '#' + legalPlayerMoves[i].charAt(6).toString() + legalPlayerMoves[i].charAt(7).toString();
        $('#table').find($newMove).addClass("checkerPiece red");
        $('#table').find($oldMove).removeClass("checkerPiece red");
        $('#table').find($capture).removeClass("checkerPiece black");
        $('#table').find($capture2).removeClass("checkerPiece black");
        console.log("hellooo");
        whoseMove = 1;
      }
      redMove = '';
      clicks = 0;
    }
  }
}

$(document).ready(() => {
  if (whoseMove == 1) {
    blackMoves();
    moreFavourableMoves(possibleMoves);
    chooseBlackMove(possibleMoves, favourableMoves, bestMoves);
    moveBlackPiece(blackMove);
  } else if (whoseMove == 2) {
    playerMoves();
  }
})
