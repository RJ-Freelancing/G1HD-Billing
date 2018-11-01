import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'components/Table'
import { format } from 'date-fns'
import { startCase } from 'lodash';
import { getUsers } from 'actions/users'

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
    if (!this.props.token) this.props.history.push('/login')
    else this.props.getUsers()
  }

  
  getTableData = (urlPath) => {    
    const users = this.props[urlPath.substr(1)]
    let displayData = []
    for (let user of users) {
      let userData = {}
      for (let row of rows) {
        if (row.field==='createdAt') {
          userData[row.field] = format(Date.parse(user[row.field]), 'd MMMM YYYY')
        } else {
          userData[row.field] = user[row.field]
        }
      }
      displayData.push({...userData})
    }
    return displayData
  } 
  
  render() {   
    return (
      <Table
        title={startCase(this.props.location.pathname.substr(1))}
        rows={rows}
        data={this.getTableData(this.props.location.pathname)}
        orderBy='creditsAvailable'
        mobileView={this.props.mobileView}
        gotoLink={(user)=>this.props.history.push(`/users/${user.username}`)} 
      />
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(InternalUser)
