import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'config/store'
import CssBaseline from '@material-ui/core/CssBaseline'
import Loading from 'components/Loading';
import { BrowserRouter } from 'react-router-dom'
import App from 'App'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';



const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#566384',
    },
  },
  typography: {
    useNextVariants: true,
  },
});



window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
        <CssBaseline />
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
