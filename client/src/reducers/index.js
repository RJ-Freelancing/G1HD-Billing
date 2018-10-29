import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import general from 'reducers/general';
import auth from 'reducers/auth';
import users from 'reducers/users';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['general']
}

const rootReducer = combineReducers({
  general,
  auth,
  users
})

export default persistReducer(persistConfig, rootReducer)