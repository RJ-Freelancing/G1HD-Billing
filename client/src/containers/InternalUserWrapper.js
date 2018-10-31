import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Header from 'containers/Header'
import Sidebar from 'containers/Sidebar'
import Loading from 'components/Loading'

import { logout } from 'actions/auth'
import { getUsers } from 'actions/users'


export default function (ComposedComponent) {
  class PageWrap extends Component {

    constructor(props) {
      super(props)
      this.state = {
        mobileView: false,
        width: window.innerWidth,
      }
    }
  
    componentWillMount = () => {
      if (!this.props.token) this.props.history.push('/login')
      else this.updateDimensions()
    }
  
    componentDidMount = () => {
      window.addEventListener("resize", this.updateDimensions)
      if (!this.props.token) this.props.history.push('/login')
      else this.props.getUsers()
    }
  
    componentDidUpdate = () => {
      if (!this.props.token) this.props.history.push('/login')
    }

    componentWillUnmount = () => { 
      window.removeEventListener("resize", this.updateDimensions)
    }
  
     updateDimensions = () => {
      let mobileView = window.innerWidth<=768
      this.setState({ width: window.innerWidth, mobileView })
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
            <Header 
              gotoLink={(link)=>this.props.history.push(link)} 
            />
            <Sidebar 
              gotoLink={(link)=>this.props.history.push(link)} 
              mobileView={this.state.mobileView} 
              activePage={this.props.match.path} 
            />
            <ContentDiv>
              <ComposedComponent location={this.props.location.pathname} mobileView={this.state.mobileView} />
            </ContentDiv>
          <Loading />
        </RootDiv>
      )
    }
  }

  const mapStateToProps = state => ({
    token: state.auth.token,
  })

  const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    getUsers: () => dispatch(getUsers()),

  })

  return connect(mapStateToProps, mapDispatchToProps)(PageWrap)
}