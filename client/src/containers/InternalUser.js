import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'components/Table'
import { startCase } from 'lodash';
import { getUsers } from 'actions/users'


const rows = [
  { field: 'username', label: 'Username', type: 'string' },
  { field: 'email', label: 'Email', type: 'string' },
  // { field: 'firstName', label: 'First Name', type: 'string' },
  // { field: 'lastName', label: 'Last Name', type: 'string' },
  { field: 'phoneNo', label: 'Telephone', type: 'string' },
  { field: 'accountStatus', label: 'Account Status', type: 'boolean' },
  { field: 'parentUsername', label: 'Parent', type: 'string' },
  // { field: 'childrenCount', label: 'No of Children' },
  { field: 'creditsAvailable', label: 'Credits Available', type: 'integer' },
  { field: 'creditsOnHold', label: 'Credits on Hold', type: 'integer' },
  { field: 'createdAt', label: 'Created At', type: 'date' },
  // { field: 'updatedAt', label: 'Updated At', type: 'date' }
]



class InternalUser extends Component {

  componentDidMount = () => this.props.getUsers()

  
  getTableData = (urlPath) => {    
    const users = this.props[urlPath]
    let displayData = []
    for (let user of users) {
      let userData = {}
      for (let row of rows) {
        userData[row.field] = user[row.field]
      }
      displayData.push({...userData})
    }
    return displayData
  } 

  checkPermissionToAdd = (urlPath) => {
    if (urlPath==="admins")
      return this.props.authUserType==="super-admin"
    if (urlPath==="superResellers")
      return this.props.authUserType==="admin"
    if (urlPath==="resellers")
      return this.props.authUserType==="superResellers"
    return true
  }
  
  render() {   
    return (
      <Table
        title={startCase(this.props.location.pathname.substr(1))}
        rows={rows}
        data={this.getTableData(this.props.location.pathname.substr(1))}
        orderBy='creditsAvailable'
        orderByDirection='asc'
        mobileView={this.props.mobileView}
        gotoLink={(user)=>this.props.history.push(`/users/${user.username}`)} 
        canAdd={this.checkPermissionToAdd(this.props.location.pathname.substr(1))}
        addNew={()=>this.props.history.push('/users/new')}
        tableHeight={this.props.mobileView ? '70vh' : '80vh'}
      />
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  mobileView: state.general.mobileView,
  authUserType: state.auth.userType,
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(InternalUser)
