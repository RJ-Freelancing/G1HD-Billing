import React, { Component } from 'react'
import PopupMessage from 'components/PopupMessage'
import Inactivity from 'assets/inactivity.gif'
import PropTypes from 'prop-types';


export default class InactivityPopup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inactivity: 0,
    }
  }

  componentDidMount = () => {
    window.onmousemove = this.resetInactiveTimer
    window.onclick = this.resetInactiveTimer
    window.onkeypress = this.resetInactiveTimer
    window.onscroll = this.resetInactiveTimer
    this.idleTimer = setTimeout(this.onIdle, 120000)
    this.refreshTokenTimer = setInterval(this.props.refreshToken, 280000)
  }

  onIdle = () => {
    this.timer = setInterval(this.progress, 1000)
  }


  componentWillUnmount = () => { 
    clearInterval(this.timer)
    clearTimeout(this.idleTimer)
    clearInterval(this.refreshTokenTimer)
    window.removeEventListener('onmousemove', this.resetInactiveTimer)
    window.removeEventListener('onclick', this.resetInactiveTimer)
    window.removeEventListener('onkeypress', this.resetInactiveTimer)
    window.removeEventListener('onscroll', this.resetInactiveTimer)
  }

  resetInactiveTimer = () => {

    this.setState({ inactivity: 0 }, ()=>{
      clearTimeout(this.idleTimer)
      clearInterval(this.timer)
      this.idleTimer = setTimeout(this.onIdle, 120000)
    }
  )}

  progress = () => {
    const { inactivity } = this.state
    if (inactivity >= 60) {
      clearInterval(this.timer)
      clearTimeout(this.idleTimer)
      clearInterval(this.refreshTokenTimer)
      window.removeEventListener('onmousemove', this.resetInactiveTimer)
      window.removeEventListener('onclick', this.resetInactiveTimer)
      window.removeEventListener('onkeypress', this.resetInactiveTimer)
      window.removeEventListener('onscroll', this.resetInactiveTimer)
      this.props.logout()
    }
    else this.setState({ inactivity: inactivity + 1 })
  }

  render() {
    if (!this.state.inactivity || this.state.inactivity > 60) return <></>

    return (
      <PopupMessage
        title="Session Idle"
        description={`You will be logged out in ${60-this.state.inactivity} seconds due to inactivity.`}
        image={Inactivity}
      /> 
    )
  }
}


InactivityPopup.propTypes = {
  refreshToken: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};