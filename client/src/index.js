import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './config/store'
import Loading from './components/common/Loading';
import App from './App'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
