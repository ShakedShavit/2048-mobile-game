import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import appColors from "../../constants/Colors";

export default function NumInput({
    style,
    maxVal,
    minVal = 0,
    defaultVal = 0,
    isEditable = true,
    setVal,
}) {
    const [chosenNum, setNum] = useState(defaultVal.toString());

    useEffect(() => {
        setVal(chosenNum);
    }, [chosenNum]);

    const numOnChangeHandler = (e) => {
        const setNumState = (num) => setNum(num.toString());

        const input = e.replace(/[^0-9]/g, "");
        inputLen = input.length;
        if (inputLen === 0) return setNumState(minVal);

        const valueInt = parseInt(input[inputLen - 1]);
        if (valueInt < minVal) return setNumState(minVal);
        if (valueInt > maxVal) return setNumState(maxVal);
        setNumState(valueInt);
    };

    return (
        <TextInput
            style={{ ...styles.numInput, ...style }}
            value={chosenNum}
            onChangeText={numOnChangeHandler}
            keyboardType="numeric"
            editable={isEditable}
        />
    );
}

const styles = StyleSheet.create({
    numInput: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 3,
        borderColor: appColors.orange,
    },
});
