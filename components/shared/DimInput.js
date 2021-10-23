import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NumInput from "./NumInput";
import appColors from "../../constants/Colors";

export default function DimInput({ labelText, setDim, isEditable, gameStartedBackground }) {
    return (
        <View
            style={{
                ...styles.dimInputContainer,
                borderColor: gameStartedBackground,
            }}
        >
            <NumInput
                maxVal={6}
                minVal={2}
                defaultVal={4}
                isEditable={isEditable}
                setVal={setDim}
                style={{ borderColor: gameStartedBackground }}
            />
            <Text style={styles.dimText}>{labelText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    dimInputContainer: {
        flexDirection: "column",
        minWidth: 70,
        borderWidth: 0,
        borderBottomWidth: 2,
        borderColor: appColors.orange,
    },
    dimText: {
        fontSize: 16,
        padding: 5,
        color: "black",
    },
});
