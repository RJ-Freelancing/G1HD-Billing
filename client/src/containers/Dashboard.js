import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper';



const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  justify-content: center
`

const DashboardItem = styled(Paper)`
  min-height: 250px;
`



class Dashboard extends Component {
  render() {
    return (
      <Wrapper>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
        <DashboardItem elevation={10}/>
      </Wrapper>
    )
  }
}



const mapStateToProps = state => ({
  token: state.auth.token,
  authUserType: state.auth.userType,
  mobileView: state.general.mobileView,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  clients: state.users.clients,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
