import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import directionsEnum from "../constants/MoveDirections";
import { moveAction } from "../store/actions/game";
import Tile from "./Tile";

const touchBoardPos = {
    x: null,
    y: null,
};

export default function Board() {
    const gameState = useSelector((state) => state.game);
    const dispatch = useDispatch();

    const [animDuration, setAnimationDuration] = useState(100);
    const [tiles, setTiles] = useState([]);
    const [boardLength, setBoardLength] = useState(Dimensions.get("window").width);

    useEffect(() => {
        const changeBoardDim = () => {
            const minLen = Math.min(
                Dimensions.get("window").width,
                Dimensions.get("window").height
            );
            setBoardLength(minLen);
        };

        Dimensions.addEventListener("change", changeBoardDim);
        return () => Dimensions.removeEventListener("change", changeBoardDim);
    });

    const boardTouchStartHandler = (e) => {
        if (!gameState.hasStarted) return;

        touchBoardPos.x = e.nativeEvent.pageX;
        touchBoardPos.y = e.nativeEvent.pageY;
    };

    const boardTouchEndHandler = (e) => {
        if (!gameState.hasStarted) return;

        const swipeDiff = 50;
        const xPosDiff = touchBoardPos.x - e.nativeEvent.pageX;
        const yPosDiff = touchBoardPos.y - e.nativeEvent.pageY;
        const xPosAbsDiff = Math.abs(xPosDiff);
        const yPosAbsDiff = Math.abs(yPosDiff);
        const isXAbsDiffBigger = xPosAbsDiff > yPosAbsDiff;

        if (xPosAbsDiff < swipeDiff && yPosAbsDiff < swipeDiff) return;

        if (xPosDiff > swipeDiff && isXAbsDiffBigger) swipe(directionsEnum.left);
        else if (xPosDiff < swipeDiff && isXAbsDiffBigger) swipe(directionsEnum.right);
        else if (yPosDiff > swipeDiff && !isXAbsDiffBigger) swipe(directionsEnum.up);
        else if (yPosDiff < swipeDiff && !isXAbsDiffBigger) swipe(directionsEnum.down);
    };

    const swipe = (direction) => {
        if (!gameState.hasStarted) return;
        dispatch(moveAction(direction));
    };

    useEffect(() => {
        if (!gameState.hasStarted) return;

        const newTiles = [];
        for (let i = 0; i < gameState.game.board.length; i++)
            for (let j = 0; j < gameState.game.board[i].length; j++) {
                if (!gameState.game.board[i][j]) continue;
                newTiles.push({
                    ...gameState.game.board[i][j],
                    rowIndex: i,
                    columnIndex: j,
                });
            }

        setTimeout(() => {
            setTiles(newTiles);
        }, animDuration);
    }, [gameState.game?.board]);

    useEffect(() => {
        if (gameState.hasStarted) return;
        setTiles([]);
    }, [gameState.hasStarted]);

    return (
        <TouchableWithoutFeedback
            onPressIn={boardTouchStartHandler}
            onPressOut={boardTouchEndHandler}
        >
            <View
                style={{
                    ...styles.board,
                    width: boardLength * 0.95,
                    height: boardLength * 0.95,
                    opacity: gameState.hasLost ? 0.5 : 1,
                }}
            >
                {gameState.hasStarted &&
                    tiles.map((tile) => {
                        return (
                            <Tile
                                key={`${tile.id}`}
                                tileObj={tile}
                                width={(boardLength * 0.95) / gameState.game.columnCount}
                                height={(boardLength * 0.95) / gameState.game.rowCount}
                                lastMove={gameState.game.moves[tile.id]}
                                animDuration={animDuration}
                                style={{
                                    width: (boardLength * 0.95) / gameState.game.columnCount,
                                    height: (boardLength * 0.95) / gameState.game.rowCount,
                                }}
                            />
                        );
                    })}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    board: {
        alignSelf: "center",
        maxWidth: 500,
        maxHeight: 500,
        marginBottom: 20,
        position: "relative",
        backgroundColor: "#cdc1b4",
    },
});
