import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Board from "../components/Board";
import DimInput from "../components/shared/DimInput";
import {
  endOnGoingGameAction,
  initiateGameAction,
} from "../store/actions/game";
import appColors from "../constants/Colors";

export default function Main() {
  const [rowCount, setRowCount] = useState("");
  const [columnCount, setColumnCount] = useState("");
  const [gameStartedBackground, setGameStartedBackground] = useState(
    appColors.orange
  );

  const gameState = useSelector((state) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    if (gameState.hasStarted) return setGameStartedBackground(appColors.grey);
    setGameStartedBackground(appColors.orange);
  }, [gameState.hasStarted]);

  const startOrEndGameHandler = () => {
    if (gameState.hasStarted) {
      dispatch(endOnGoingGameAction());
      return;
    }

    dispatch(initiateGameAction(rowCount, columnCount));
  };
  useEffect(() => {
    console.log("gameState.hasLost", gameState.hasLost);
  }, [gameState.hasLost]);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.top}>
          <Text
            style={{
              ...styles.gameHeadline,
              color: gameState.hasStarted ? appColors.orange : "#000",
            }}
          >
            2048
          </Text>
          <TouchableOpacity
            style={{
              ...styles.gameStateBtn,
              backgroundColor: gameStartedBackground,
            }}
            onPress={startOrEndGameHandler}
          >
            <Text style={styles.gameStateBtnTxt}>
              {gameState.hasStarted
                ? gameState.hasLost
                  ? "Finish"
                  : "Stop"
                : "Start"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gameDimInputsContainer}>
          <DimInput
            labelText={"row"}
            setDim={setRowCount}
            isEditable={!gameState.hasStarted}
            gameStartedBackground={gameStartedBackground}
          />
          <Text style={styles.dimXText}>X</Text>
          <DimInput
            labelText={"column"}
            setDim={setColumnCount}
            isEditable={!gameState.hasStarted}
            gameStartedBackground={gameStartedBackground}
          />
        </View>
      </View>

      {!!gameState.hasStarted && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {gameState.hasLost ? "Lost" : "Score:"}
          </Text>
          {!gameState.hasLost && (
            <Text style={styles.scoreText}>{gameState.score}</Text>
          )}
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Board />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  top: {
    margin: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameHeadline: {
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 35,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
  },
  gameDimInputsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  dimXText: {
    fontSize: 18,
    marginHorizontal: 15,
    color: "white",
    backgroundColor: "#ccc",
    padding: 5,
    width: 35,
    height: 35,
    borderRadius: 50,
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 5,
  },
  gameStateBtn: {
    padding: 10,
    minWidth: 100,
    backgroundColor: appColors.grey,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#555",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
  },
  gameStateBtnTxt: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  scoreContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: appColors.orange,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(50, 50, 50)",
    padding: 10,
  },
});
