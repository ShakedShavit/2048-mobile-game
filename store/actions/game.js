export const initiateGameActionType = "INITIATE_GAME";
export const moveActionType = "MOVE";
export const endOnGoingGameActionType = "END_GAME";

export const initiateGameAction = (rowCount, columnCount) => {
    return { type: initiateGameActionType, rowCount, columnCount };
};

export const moveAction = (direction) => {
    return { type: moveActionType, direction };
};

export const endOnGoingGameAction = () => {
    return { type: endOnGoingGameActionType };
};
