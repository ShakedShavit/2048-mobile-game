import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

export default function Tile({
    tileObj: { id, value, rowIndex, columnIndex },
    width,
    height,
    lastMove,
    animDuration,
    style,
}) {
    const moveAnim = useRef(
        new Animated.ValueXY({ x: columnIndex * width, y: rowIndex * height })
    ).current;
    const newTileAnim = useRef(new Animated.Value(0)).current;

    const [tileBackground, setTileBackground] = useState("#cdc1b4");

    useEffect(() => {
        if (!value) return;
        switch (value % 2048) {
            case 0:
                setTileBackground("#e8be4e");
                break;
            case 1024:
                setTileBackground("#e7c257");
                break;
            case 512:
                setTileBackground("#edc950");
                break;
            case 256:
                setTileBackground("#edcc62");
                break;
            case 128:
                setTileBackground("#edd073");
                break;
            case 64:
                setTileBackground("#f75f3b");
                break;
            case 32:
                setTileBackground("#f77c5f");
                break;
            case 16:
                setTileBackground("#f69664");
                break;
            case 8:
                setTileBackground("#f3b27a");
                break;
            case 4:
                setTileBackground("#eee1c9");
                break;
            case 2:
                setTileBackground("#eee4da");
                break;
            default:
                setTileBackground("#cdc1b4");
                break;
        }
    }, [value]);

    useEffect(() => {
        if (!lastMove) return;
        moveHandler(...lastMove);
    }, [lastMove]);

    const moveHandler = (row, column) => {
        Animated.timing(moveAnim, {
            toValue: {
                x: column * width,
                y: row * height,
            },
            duration: animDuration,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        Animated.spring(newTileAnim, {
            toValue: 1,
            duration: animDuration,
            useNativeDriver: true,
            speed: 100,
        }).start();
    });

    return (
        <Animated.View
            style={[
                {
                    ...style,
                    ...styles.tile,
                    backgroundColor: tileBackground,
                },
                { opacity: newTileAnim },
                {
                    transform: [...moveAnim.getTranslateTransform(), { scale: newTileAnim }],
                },
            ]}
        >
            {value !== 0 && (
                <Text
                    style={{
                        ...styles.valueText,
                        color: value % 8 > 0 ? "#555" : "#fff",
                    }}
                >
                    {value}
                </Text>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tile: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    valueText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#555",
    },
});
