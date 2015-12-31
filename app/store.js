import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import drawing from './reducers/drawing';

const storeReducer = combineReducers({
  drawing
});

const logger = createLogger();

const createStoreWithMiddleware = applyMiddleware( thunk, logger )( createStore );
const store = createStoreWithMiddleware( storeReducer );

export default store;
