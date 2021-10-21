import directionsEnum from "./constants/MoveDirections";

export default class GameState {
  constructor(rowCount, columnCount, board, moves = {}) {
    this.rowCount = rowCount;
    this.columnCount = columnCount;
    this.board = board;
    this.boardSquareValOptionsArr = getMatrixSquareValOptionsArr([
      new NewSquareOption(2, 2),
      new NewSquareOption(4, 1),
    ]);
    this.moves = moves;
  }
}

class NewSquareOption {
  constructor(value, ratio) {
    this.value = value;
    this.ratio = ratio;
  }
}

const getNewTile = (
  value,
  id = Date.now().toString(36) + Math.random().toString(36).substring(2)
) => {
  return { id, value };
};

const getRandomNum = (max) => {
  return Math.floor(Math.random() * max);
};

const transposeMatrix = (matrix) => {
  const transposedMatrix = [];
  for (let column = 0; column < matrix[0].length; column++) {
    transposedMatrix.push([]);
    for (let row = 0; row < matrix.length; row++)
      transposedMatrix[column][row] = !!matrix[row][column]
        ? { ...matrix[row][column] }
        : null;
  }
  return transposedMatrix;
};

export const getNewMatrix = (rowCount, columnCount) => {
  const matrix = [];
  for (let i = 0; i < rowCount; i++) {
    matrix.push([]);
    for (let j = 0; j < columnCount; j++) matrix[i][j] = null;
  }
  return matrix;
};

export const getMatrixCopy = (matrix) => {
  const copy = [];
  for (let i = 0; i < matrix.length; i++) {
    copy.push([]);
    for (let j = 0; j < matrix[i].length; j++)
      copy[i][j] = !!matrix[i][j] ? { ...matrix[i][j] } : null;
  }
  return copy;
};

const getMatrixSquareValOptionsArr = (newSquareOptions) => {
  const options = [];
  for (let i = 0; i < newSquareOptions.length; i++)
    for (let j = 0; j < newSquareOptions[i].ratio; j++)
      options.push(newSquareOptions[i].value);
  return options;
};

export const addRandomSquareToMatrix = (ogMatrix, newSquareValOptions) => {
  const matrix = getMatrixCopy(ogMatrix);
  const emptySquares = [];
  for (let row = 0; row < matrix.length; row++)
    for (let column = 0; column < matrix[row].length; column++)
      if (!matrix[row][column]) emptySquares.push([row, column]);

  const chosenEmptySquarePos = getRandomNum(emptySquares.length);
  matrix[emptySquares[chosenEmptySquarePos][0]][
    emptySquares[chosenEmptySquarePos][1]
  ] = {
    ...getNewTile(
      newSquareValOptions[getRandomNum(newSquareValOptions.length)]
    ),
  };
  return matrix;
};

export const move = (direction, matrix, newSquareValOptions) => {
  const isDirectionDownOrUp =
    direction === directionsEnum.up || direction === directionsEnum.down;
  let board = isDirectionDownOrUp
    ? transposeMatrix(matrix)
    : getMatrixCopy(matrix);

  const isDirectionLeftOrUp =
    direction === directionsEnum.left || direction === directionsEnum.up;

  const moves = {};
  let didBoardChange = false;
  let combinedSquaresScore = 0;

  for (let row = 0; row < board.length; row++) {
    const combinedSquaresIds = [];
    for (
      let column = isDirectionLeftOrUp ? 1 : board[row].length - 2;
      column < board[row].length && column >= 0;
      isDirectionLeftOrUp ? column++ : column--
    ) {
      if (board[row][column] === null) continue;

      const currSquare = { ...board[row][column] };
      board[row][column] = null;

      for (let i = column; true; isDirectionLeftOrUp ? i-- : i++) {
        const nextSquareColumn = isDirectionLeftOrUp ? i - 1 : i + 1;
        const nextSquare = board[row][nextSquareColumn];
        const isNextSquareEmpty = nextSquare === null;

        if (
          !isNextSquareEmpty &&
          nextSquare.value === currSquare.value &&
          !combinedSquaresIds.some((id) => id === nextSquare.id)
        ) {
          const newCombinedSquareVal = board[row][nextSquareColumn].value * 2;

          board[row][nextSquareColumn] = getNewTile(newCombinedSquareVal);
          const newTileId = board[row][nextSquareColumn].id;
          combinedSquaresIds.push(newTileId);
          combinedSquaresScore += newCombinedSquareVal;

          didBoardChange = true;
          moves[currSquare.id] = isDirectionDownOrUp
            ? [nextSquareColumn, row]
            : [row, nextSquareColumn];
        } else if (
          (nextSquareColumn === 0 ||
            nextSquareColumn === board[row].length - 1) &&
          isNextSquareEmpty
        ) {
          // Next square is empty and at the edge

          board[row][nextSquareColumn] = { ...currSquare };
          didBoardChange = true;
          moves[currSquare.id] = isDirectionDownOrUp
            ? [nextSquareColumn, row]
            : [row, nextSquareColumn];
        } else if (isNextSquareEmpty) continue;
        else {
          // Next square is not empty, not at the edge and is not equal to current

          board[row][i] = { ...currSquare };
          if (i === column) break; // If next square is current square
          didBoardChange = true;
          moves[currSquare.id] = isDirectionDownOrUp ? [i, row] : [row, i];
        }
        break;
      }
    }
  }

  board = isDirectionDownOrUp ? transposeMatrix(board) : board;

  return {
    board: didBoardChange
      ? addRandomSquareToMatrix(board, newSquareValOptions)
      : board,
    combinedSquaresScore,
    didBoardChange,
    moves,
  };
};

export const isMovePossible = (matrix) => {
  return getMatrixCopy(matrix).some((row, i, board) =>
    row.some(
      (tile, j) =>
        !tile ||
        (j + 1 < row.length && tile.value === row[j + 1]?.value) ||
        (i + 1 < board.length && tile.value === board[i + 1][j]?.value)
    )
  );

  // for (let row = 0; row < board.length; row++)
  //   for (let column = 0; column < board[row].length; column++) {
  //     if (!board[row][column]) continue;
  //     if (
  //       (column + 1 < board[row].length &&
  //         board[row][column].value === board[row][column + 1].value) ||
  //       (row + 1 < board.length &&
  //         board[row][column].value === board[row + 1][column].value)
  //     )
  //       return true;
  //   }
  // return false;
};

// class GameLogics {
//   constructor(rowLen, columnLen) {
//     this.board = [];
//     this.newSquareObjOptions = [
//       { value: 2, ratio: 2 },
//       { value: 4, ratio: 1 },
//     ];
//     this.newSquareValOptions = this.newValOptions;
//     this.initiateBoard(rowLen, columnLen);
//   }

//   initiateBoard(rowLen, columnLen) {
//     for (let i = 0; i < rowLen; i++) {
//       this.board.push([]);
//       for (let j = 0; j < columnLen; j++) {
//         this.board[i][j] = null;
//       }
//     }
//   }

//   get boardCopy() {
//     const copy = [];
//     for (let i = 0; i < this.board.length; i++) {
//       copy.push([]);
//       for (let j = 0; j < this.board[i].length; j++)
//         copy[i][j] = this.board[i][j];
//     }
//     return copy;
//   }

//   get newValOptions() {
//     const options = [];
//     for (let i = 0; i < this.newSquareObjOptions.length; i++)
//       for (let j = 0; j < this.newSquareObjOptions[i].ratio; j++)
//         options.push(this.newSquareObjOptions[i].value);
//     return options;
//   }

//   addRandomValToBoard() {
//     const emptySquares = [];
//     for (let row = 0; row < this.board.length; row++) {
//       for (let column = 0; column < this.board[row].length; column++) {
//         if (!this.board[row][column]) emptySquares.push([row, column]);
//       }
//     }
//     const chosenEmptySquarePos = getRandomNum(emptySquares.length);

//     this.board[emptySquares[chosenEmptySquarePos][0]][
//       emptySquares[chosenEmptySquarePos][1]
//     ] = this.newSquareValOptions[getRandomNum(this.newSquareValOptions.length)];

//     console.log(this.boardCopy);
//   }

//   move(direction) {
//     const isDirectionDownOrUp =
//       direction === directionsEnum.up || direction === directionsEnum.down;
//     let board = isDirectionDownOrUp
//       ? transposeMatrix(this.board)
//       : this.boardCopy;

//     const isDirectionLeftOrUp =
//       direction === directionsEnum.left || direction === directionsEnum.up;

//     const moves = [];

//     for (let row = 0; row < board.length; row++) {
//       const combinedSquares = [];
//       for (
//         let column = isDirectionLeftOrUp ? 1 : board[row].length - 2;
//         column < board[row].length && column >= 0;
//         isDirectionLeftOrUp ? column++ : column--
//       ) {
//         if (board[row][column] === null) continue;

//         const currSquareVal = board[row][column];
//         board[row][column] = null;
//         for (let i = column; true; isDirectionLeftOrUp ? i-- : i++) {
//           const nextSquareColumn = isDirectionLeftOrUp ? i - 1 : i + 1;
//           const nextSquareVal = board[row][nextSquareColumn];
//           const isNextSquareEmpty = nextSquareVal === null;

//           if (
//             nextSquareVal === currSquareVal &&
//             !combinedSquares.some(
//               ([posRow, posCol]) =>
//                 posRow === row && posCol === nextSquareColumn
//             )
//           ) {
//             board[row][nextSquareColumn] *= 2;
//             combinedSquares.push([row, nextSquareColumn]);

//             moves.push(
//               new Move(
//                 [row, column],
//                 [row, nextSquareColumn],
//                 currSquareVal,
//                 board[row][nextSquareColumn]
//               )
//             );
//           } else if (
//             nextSquareColumn === 0 ||
//             nextSquareColumn === board[row].length - 1
//           ) {
//             if (isNextSquareEmpty) {
//               board[row][nextSquareColumn] = currSquareVal;
//               moves.push(
//                 new Move(
//                   [row, column],
//                   [row, nextSquareColumn],
//                   currSquareVal,
//                   currSquareVal
//                 )
//               );
//             } else {
//               board[row][i] = currSquareVal;
//               moves.push(
//                 new Move([row, column], [row, i], currSquareVal, currSquareVal)
//               );
//             }
//           } else continue;
//           break;
//         }
//       }
//     }
//     this.board = isDirectionDownOrUp ? transposeMatrix(board) : board;
//   }
// }

// const game = new GameLogics(3, 4);
// game.addRandomValToBoard();
// game.addRandomValToBoard();
// game.addRandomValToBoard();
// console.log("\n\n");
// console.log(game.boardCopy);
// game.move(directionsEnum.right);
// console.log(game.boardCopy);
// game.move(directionsEnum.down);
// console.log(game.boardCopy);
// game.move(directionsEnum.left);
// console.log(game.boardCopy);

// console.log(game.board);
// transposeMatrix(game.board);
// console.log(game);
