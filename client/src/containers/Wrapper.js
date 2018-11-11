import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Header from 'containers/Header'
import Sidebar from 'containers/Sidebar'
import { logout } from 'actions/auth'
import FourOhFour from 'components/FourOhFour'
import Profile from 'containers/Profile'
import Dashboard from 'containers/Dashboard';
import InternalUser from 'containers/InternalUser'
import Client from 'containers/Client'
import Transaction from 'containers/Transaction'
import Events from 'containers/Events'
import EditInternalUser from 'containers/EditInternalUser'
import EditClient from 'containers/EditClient'
import AddClient from 'containers/AddClient'
import AddUser from 'containers/AddUser'
import SuperAdminConfig from 'containers/SuperAdminConfig'

import { setMobileView } from 'actions/general'


class Wrapper extends Component {

  componentWillMount = () => {
    if (!this.props.token) this.props.history.push('/login')
    this.updateDimensions()
  }

  componentDidMount = () => {
    if (!this.props.token) this.props.history.push('/login')
    let mobileView = window.innerWidth<=768
    if (this.props.mobileView !== mobileView) this.props.setMobileView(mobileView)
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
    if (this.props.mobileView !== mobileView) this.props.setMobileView(mobileView)
  }

  render() {
  
    const RootDiv = styled.div`
      flex-grow: 1;
      z-index: 1;
      overflow: hidden;
      position: relative;
      display: flex;
    `
    
    const ContentDiv = styled.div`
      flex-grow: 1;
      min-width: 0px;
      padding: 16px;
      margin-left: ${this.props.mobileView ? 'inherit' : '240px'}
      padding-top: ${this.props.mobileView ? '70px' : '10px'}
    `

    return (
      <RootDiv>
         <Header 
            gotoLink={(link)=>this.props.history.push(link)} 
          />
         
          <Sidebar 
            gotoLink={(link)=>this.props.history.push(link)} 
            activePage={this.props.location.pathname} 
          />
        <ContentDiv>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/admins" component={InternalUser} />
            <Route exact path="/superResellers" component={InternalUser} />
            <Route exact path="/resellers" component={InternalUser} />
            <Route exact path="/clients" component={Client} />
            <Route exact path="/transactions" component={Transaction} />
            <Route exact path="/events" component={Events} />
            <Route exact path="/config" component={SuperAdminConfig} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/users/new" component={AddUser} />
            <Route exact path="/clients/new" component={AddClient} />
            <Route path="/users/:id" component={EditInternalUser} />
            <Route path="/clients/:id" component={EditClient} />
            <Route component={FourOhFour} />
          </Switch>
        </ContentDiv>
      </RootDiv>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  username: state.auth.username,
  userType: state.auth.userType,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  setMobileView: (mobileView) => dispatch(setMobileView(mobileView)),
  logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
