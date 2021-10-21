import GameState, {
  move,
  getNewMatrix,
  getMatrixCopy,
  addRandomSquareToMatrix,
  isMovePossible,
} from "../../gameLogics";
import {
  endGameActionType,
  endOnGoingGameActionType,
  initiateGameActionType,
  moveActionType,
} from "../actions/game";

const initialGameState = {
  game: null,
  hasStarted: false,
  score: 0,
  hasLost: false,
};

// 2 null null 4
// null null null null
// 4 null null null
// 16 4 null null
// down

const gameReducer = (state = initialGameState, action) => {
  switch (action.type) {
    case initiateGameActionType:
      const game = new GameState(
        action.rowCount,
        action.columnCount,
        getNewMatrix(action.rowCount, action.columnCount)
      );
      game.board = addRandomSquareToMatrix(
        game.board,
        game.boardSquareValOptionsArr
      );
      return {
        game,
        hasStarted: true,
        score: 0,
        hasLost: false,
      };
    case moveActionType:
      const { board, combinedSquaresScore, didBoardChange, moves } = move(
        action.direction,
        state.game.board,
        state.game.boardSquareValOptionsArr
      );

      if (!didBoardChange)
        return {
          ...state,
        };

      return {
        ...state,
        game: {
          ...new GameState(
            state.game.rowCount,
            state.game.columnCount,
            getMatrixCopy(board),
            moves
          ),
        },
        hasStarted: true,
        score: state.score + combinedSquaresScore,
        hasLost: !isMovePossible(board),
      };
    case endOnGoingGameActionType:
      return {
        ...initialGameState,
      };
    default:
      return {
        ...state,
      };
  }
};

export default gameReducer;
