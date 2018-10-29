import React, { Component } from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux'

import { getUsers } from 'actions/users'


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 350px);
  grid-gap: 40px;
  margin: 20px 20px;
  justify-content: center
`

const DashboardItem = styled(Paper)`
  min-height: 250px;
`



class Dashboard extends Component {
  componentDidMount = () => {
    // console.log('GONNA CALL MOUNT');

    // this.props.getUsers()
  }

  render() {
    return (
      <Wrapper>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
      </Wrapper>
    )
  }
}



const mapStateToProps = state => ({
  mobileMenu: state.general.mobileMenu,
  admins: state.users.admins,
  'super-resellers': state.users['super-resellers'],
  resellers: state.users.resellers,
  clients: state.users.clients,
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
