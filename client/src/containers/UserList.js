import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'components/Table'
import { startCase } from 'lodash';


class UserList extends Component {
  
  getTableData = (rows, urlPath) => {    
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
      return this.props.authUserType==="superAdmin"
    if (urlPath==="superResellers")
      return this.props.authUserType==="admin"
    if (urlPath==="resellers")
      return this.props.authUserType==="superReseller"
    return true
  }
  
  render() {       
    
    let rows = [
      { field: 'username', label: 'Username', type: 'string' },
      { field: 'email', label: 'Email', type: 'string' },
      { field: 'phoneNo', label: 'Telephone', type: 'string' },
      { field: 'accountStatus', label: 'Account Status', type: 'boolean' },
      { field: 'parentUsername', label: 'Parent', type: 'string' },
      { field: 'creditsAvailable', label: 'Credits Available', type: 'integer' },
      { field: 'creditsOwed', label: 'Credits Owed', type: 'integer' },
      { field: 'createdAt', label: 'Created At', type: 'date' },
    ]
    if (this.props.location.pathname.substr(1) !== 'resellers') rows.splice(6, 1)

    return (
      <Table
        title={startCase(this.props.location.pathname.substr(1))}
        rows={rows}
        data={this.getTableData(rows, this.props.location.pathname.substr(1))}
        orderBy='username'
        orderByDirection='desc'
        mobileView={this.props.mobileView}
        gotoLink={(user)=>this.props.history.push(`/users/${user.username}`)} 
        canAdd={this.checkPermissionToAdd(this.props.location.pathname.substr(1))}
        addNew={()=>this.props.history.push('/users/new')}
        tableHeight={this.props.mobileView ? '75vh' : '85vh'}
        canDownload={this.props.authUserType==='superAdmin'}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
