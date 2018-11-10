import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'
import localForage from 'localforage';
import general from 'reducers/general';
import auth from 'reducers/auth';
import users from 'reducers/users';
import config from 'reducers/config';


const persistConfig = {
  key: 'root',
  storage: localForage,
  blacklist: ['general']
}

const rootReducer = combineReducers({
  general,
  auth,
  users,
  config
})

export default persistReducer(persistConfig, rootReducer)