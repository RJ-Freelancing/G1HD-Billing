import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dashboard from 'containers/Dashboard';
import Admin from 'containers/Admin';
import SuperReseller from 'containers/SuperReseller';
import Reseller from 'containers/Reseller';
import Client from 'containers/Client';

import { getUsers } from 'actions/users'

const locations = {
  '/': <Dashboard/>,
  '/admins': <Admin/>,
  '/super-resellers': <SuperReseller/>,
  '/resellers': <Reseller/>
}

const rows = [
  { field: 'username', numeric: false, label: 'Username' },
  { field: 'email', numeric: false, label: 'Email' },
  // { field: 'firstName', numeric: false, label: 'First Name' },
  // { field: 'lastName', numeric: false, label: 'Last Name' },
  { field: 'phoneNo', numeric: false, label: 'Telephone' },
  { field: 'accountStatus', numeric: false, label: 'Account Status' },
  { field: 'parentUsername', numeric: false, label: 'Parent' },
  // { field: 'childrenCount', numeric: true, label: 'No of Children' },
  { field: 'creditsAvailable', numeric: true, label: 'Credits Available' },
  { field: 'creditsOnHold', numeric: true, label: 'Credits on Hold' },
  { field: 'createdAt', numeric: false, label: 'Created At' },
  // { field: 'updatedAt', numeric: false, label: 'Updated At' }
]


class InternalUser extends Component {
  
  componentDidMount = () => {
    console.log('COMPONENT DID MOUNT');
    // this.props.getUsers()
  }
  
  render() {     
    return (
      locations[this.props.location]
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

export default connect(mapStateToProps, mapDispatchToProps)(InternalUser)
