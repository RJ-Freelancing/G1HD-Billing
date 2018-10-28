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

import 'assets/transition.css'

export default function (ComposedComponent) {
  class PageWrap extends Component {

    constructor(props) {
      super(props)
      this.state = {
        mobileView: false,
        height: window.innerHeight,
        width: window.innerWidth
      }
    }

    componentWillMount = () => {
      if (!this.props.token) this.props.history.push('/login')
      this.updateDimensions()
    }

    componentDidMount = () => {
      window.addEventListener("resize", this.updateDimensions)
    }

    componentDidUpdate = () => {
      if (!this.props.token) this.props.history.push('/login')
    }

    componentWillUnmount = () => { 
      window.removeEventListener("resize", this.updateDimensions)
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
            loading={this.props.loading} 
            username={this.props.username}
            toggleMobileSideBar={this.props.toggleMobileSideBar}
            mobileView={mobileView}
            gotoLink={(link)=>this.props.history.push(link)} 
          />
          <Sidebar 
            activePage={this.props.match.path} 
            gotoLink={(link)=>this.props.history.push(link)} 
            loading={this.props.loading}
            mobileMenu={this.props.mobileMenu}
            toggleMobileSideBar={this.props.toggleMobileSideBar}
            mobileView={mobileView}
          />
          <ContentDiv>
            <ReactCSSTransitionGroup
              transitionName="wrapper"
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              <ComposedComponent {...this.props} mobileView key={this.props.location.pathname}/>
            </ReactCSSTransitionGroup>
          </ContentDiv>
          {this.props.loading && <Loading />}
          <Notification />
        </RootDiv>
      )
    }
  }

  const mapStateToProps = state => ({
    token: state.auth.token,
    username: state.auth.username,
    loading: state.general.loading,
    mobileMenu: state.general.mobileMenu
  })

  const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    toggleMobileSideBar: (open) => dispatch(toggleMobileSideBar(open))
  })

  return connect(mapStateToProps, mapDispatchToProps)(PageWrap)
}