import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import general from 'reducers/general';
import auth from 'reducers/auth';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['general']
}

const rootReducer = combineReducers({
  general,
  auth
})

export default persistReducer(persistConfig, rootReducer)