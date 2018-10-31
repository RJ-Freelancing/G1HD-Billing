import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import CssBaseline from '@material-ui/core/CssBaseline'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar'
import Notification from 'components/Notification'
import Loading from 'components/Loading'
import { logout } from 'actions/auth'
import { toggleMobileSideBar } from 'actions/general'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Offline } from "react-detect-offline";
import OfflinePopup from 'components/OfflinePopup'

import 'assets/transition.css'

import { setLastActiveTime, clearLastActiveTime } from 'actions/general'


export default function (ComposedComponent) {
  class PageWrap extends Component {

    constructor(props) {
      super(props)
      this.state = {
        mobileView: false,
        height: window.innerHeight,
        width: window.innerWidth,
        inactivity: 0
      }
      this.idleTimer = null;
    }
  
    onIdle = () => {
      !this.props.lastActiveTime && this.props.setLastActiveTime(true)
      this.timer = setInterval(this.progress, 1000)
    }

    componentWillMount = () => {
      if (!this.props.token) this.props.history.push('/login')
      this.updateDimensions()
    }

    componentDidMount = () => {
      window.addEventListener("resize", this.updateDimensions)
      window.onload = this.resetInactiveTimer
      window.onmousemove = this.resetInactiveTimer
      window.onmousedown = this.resetInactiveTimer
      window.ontouchstart = this.resetInactiveTimer
      window.onclick = this.resetInactiveTimer
      window.onkeypress = this.resetInactiveTimer
      window.addEventListener("scroll", this.resetInactiveTimer, true)
    }

    componentDidUpdate = () => {
      if (!this.props.token) this.props.history.push('/login')
    }

    componentWillUnmount = () => { 
      window.removeEventListener("resize", this.updateDimensions)
      window.removeEventListener("scroll", this.resetInactiveTimer)
      clearInterval(this.timer)
    }

    resetInactiveTimer = () => {
      clearInterval(this.timer)
      // this.setState({inactivity: 0})
      this.props.lastActiveTime && this.props.clearLastActiveTime()
      clearTimeout(this.idleTimer)
      this.idleTimer = setTimeout(this.onIdle, 60000)
    }

    progress = () => {
      const { inactivity } = this.state
      if (inactivity >= 60) this.setState({inactivity: 0}, ()=>this.props.logout())
      else this.setState({ inactivity: inactivity + 1 })
    }

    updateDimensions = () => {
      let mobileView = window.innerWidth<=768
      this.setState({ height: window.innerHeight, width: window.innerWidth, mobileView })
    }
    
    render() {

      const { mobileView } = this.state
      
      const RootDiv = styled.div`
        flex-grow: 1,
        z-index: 1,
        overflow: hidden,
        position: relative,
        display: flex
      `
      
      const ContentDiv = styled.div`
        flex-grow: 1
        min-width: 0px
        padding: 16px
        margin-left: ${mobileView ? 'inherit' : '240px'}
        padding-top: 70px
      `

      return (
        <RootDiv>
            <CssBaseline />
            <Header 
              logout={this.props.logout} 
              username={this.props.username}
              toggleMobileSideBar={this.props.toggleMobileSideBar}
              mobileView={mobileView}
              gotoLink={(link)=>this.props.history.push(link)} 
              lastActiveTime={this.props.lastActiveTime}
              inactivity={this.state.inactivity}
            />
            <Sidebar 
              activePage={this.props.match.path} 
              gotoLink={(link)=>this.props.history.push(link)} 
              mobileMenu={this.props.mobileMenu}
              toggleMobileSideBar={this.props.toggleMobileSideBar}
              mobileView={mobileView}
              userType={this.props.userType}
            />
            <ContentDiv>
              <ReactCSSTransitionGroup
                transitionName="wrapper"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                <ComposedComponent location={this.props.location.pathname} mobileView={this.state.mobileView} />
              </ReactCSSTransitionGroup>
            </ContentDiv>
          <Loading />
          <Notification />
          <Offline polling={{interval:30000}}>
            <Loading />
            <OfflinePopup/>
          </Offline>
        </RootDiv>
      )
    }
  }

  const mapStateToProps = state => ({
    token: state.auth.token,
    username: state.auth.username,
    userType: state.auth.userType,
    mobileMenu: state.general.mobileMenu,
    lastActiveTime: state.general.lastActiveTime
  })

  const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    toggleMobileSideBar: (open) => dispatch(toggleMobileSideBar(open)),
    setLastActiveTime: (time) => dispatch(setLastActiveTime(time)),
    clearLastActiveTime: () => dispatch(clearLastActiveTime())
  })

  return connect(mapStateToProps, mapDispatchToProps)(PageWrap)
}