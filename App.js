import React from "react";
import { Provider } from "react-redux";
import gameReducer from "./store/reducers/game";
import { createStore, combineReducers } from "redux";
import Main from "./screens/Main";

const rootReducer = combineReducers({
    game: gameReducer,
});
const store = createStore(rootReducer);

export default function App() {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
}
