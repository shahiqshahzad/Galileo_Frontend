// import { createStore } from 'redux';
// import { persistStore } from 'redux-persist';
import rootReducer from "./reducer";
// import { applyMiddleware, compose, createStore } from "redux";

import { applyMiddleware, compose, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import rootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
// import { createBrowserHistory } from 'history';
// import { createBrowserHistory } from "history";

// ==============================|| REDUX - MAIN STORE ||============================== //

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(reducer);
// const persister = persistStore(store);

// export { store, persister };

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "customization"],
  blacklist: []
};

// const history = createBrowserHistory();

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();
// const routeMiddleware = routerMiddleware(history);

const middlewares = [sagaMiddleware];
// const middlewares = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState) {
  const store = createStore(persistedReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
  sagaMiddleware.run(rootSaga);
  return store;
}

const store = configureStore();

const persistor = persistStore(store);

export { store, persistor };
