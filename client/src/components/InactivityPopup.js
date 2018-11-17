import React, { Component } from 'react'
import PopupMessage from 'components/PopupMessage'
import Inactivity from 'assets/inactivity.gif'
import PropTypes from 'prop-types';


export default class InactivityPopup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inactivity: 0
    }
  }

  componentDidMount = () => {
    window.onmousemove = this.resetInactiveTimer
    window.addEventListener("scroll", this.resetInactiveTimer, true)
    this.idleTimer = setTimeout(this.onIdle, 120000)
  }

  onIdle = () => {
    this.timer = setInterval(this.progress, 1000)
  }


  componentWillUnmount = () => { 
    clearInterval(this.timer)
    clearTimeout(this.idleTimer)
    window.removeEventListener("scroll", this.resetInactiveTimer)
  }

  resetInactiveTimer = () => {
    if (this.state.inactivity && this.state.inactivity < 60)
      this.setState({ inactivity: 0 }, ()=>{
        clearInterval(this.timer)
        clearTimeout(this.idleTimer)
        this.idleTimer = setTimeout(this.onIdle, 120000)
      })
  }

  progress = () => {
    const { inactivity } = this.state
    if (inactivity >= 60) this.props.logout()
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
  logout: PropTypes.func.isRequired,
};