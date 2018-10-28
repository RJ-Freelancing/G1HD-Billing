import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'config/store'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import Loading from 'components/Loading';
import App from 'App'

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

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true
