import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Notification from 'components/Notification'
import Loading from 'components/Loading'
import InactivityPopup from 'components/InactivityPopup'
import OfflinePopup from 'components/OfflinePopup'
import FourOhFour from 'components/FourOhFour'
import Header from 'components/Header'
import Sidebar from 'containers/Sidebar'
import Profile from 'containers/Profile'
import Dashboard from 'containers/Dashboard';
import UserList from 'containers/UserList'
import UserAdd from 'containers/UserAdd'
import UserEdit from 'containers/UserEdit'
import ClientList from 'containers/ClientList'
import ClientAdd from 'containers/ClientAdd'
import ClientEdit from 'containers/ClientEdit'
import Transaction from 'containers/Transaction'
import Events from 'containers/Events'
import SuperAdminConfig from 'containers/SuperAdminConfig'

import { refreshToken, logout } from 'actions/auth'
import { setMobileView, toggleMobileSideBar } from 'actions/general'


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

  gotoLink = link => this.props.history.push(link)

  render() {

    const {token, username, mobileView, location} = this.props
    console.log(this.props);
    
  
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
      margin-left: ${mobileView ? 'inherit' : '240px'}
      padding-top: ${mobileView ? '70px' : '10px'}
    `

    if (!token) return <></>

    return (
      <RootDiv>
        {mobileView && <Header gotoLink={this.gotoLink} toggleMobileSideBar={this.props.toggleMobileSideBar} username={username}/>}
        <Sidebar gotoLink={this.gotoLink} activePage={location.pathname} />
        <ContentDiv>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/(admins|superResellers|resellers)" component={UserList} />
            <Route exact path="/clients" component={ClientList} />
            <Route exact path="/transactions" component={Transaction} />
            <Route exact path="/events" component={Events} />
            <Route exact path="/config" component={SuperAdminConfig} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/users/new" component={UserAdd} />
            <Route exact path="/clients/new" component={ClientAdd} />
            <Route path="/users/:id" component={UserEdit} />
            <Route path="/clients/:id" component={ClientEdit} />
            <Route component={FourOhFour} />
          </Switch>
        </ContentDiv>
        <Loading />
        <Notification />
        <OfflinePopup />
        <InactivityPopup logout={this.props.logout} refreshToken={this.props.refreshToken}/>
      </RootDiv>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  username: state.auth.username,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  setMobileView: (mobileView) => dispatch(setMobileView(mobileView)),
  toggleMobileSideBar: (open) => dispatch(toggleMobileSideBar(open)),
  refreshToken: () => dispatch(refreshToken()),
  logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper)
