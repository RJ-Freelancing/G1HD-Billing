import React, { Component } from 'react'
import { Offline } from "react-detect-offline";
import PopupMessage from 'components/PopupMessage'
import NoInternetGIF from 'assets/noInternet.gif'


export default class OfflinePopup extends Component {
  render() {
    return (
      <Offline polling={{interval: 30000, url: '/api/checkStatus'}}>
        <PopupMessage
          title='No Active Internet Connection Detected'
          description='You can continue with your work once the connection is back.'
          image={NoInternetGIF}
        />
      </Offline>
    )
  }
}
