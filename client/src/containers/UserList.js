import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'components/Table'
import { startCase } from 'lodash';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';

class UserList extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      filter: 'active'
    }
  }


  getTableData = (rows, urlPath) => {    
    const users = this.props[urlPath]
    let displayData = []
    for (let user of users) {     
      let canPush = (this.state.filter==='active' && user.accountStatus) || (this.state.filter==='inactive' && !user.accountStatus)
      if (canPush) {
        let userData = {}
        for (let row of rows) {
          userData[row.field] = user[row.field]
        }
        displayData.push({...userData})
      }
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

  handleFilter = (event, filter) => {
    this.setState({ filter })
  }
  
  render() {       
    
    let rows = [
      { field: 'username', label: 'Username', type: 'string' },
      { field: 'email', label: 'Email', type: 'string' },
      { field: 'phoneNo', label: 'Telephone', type: 'string' },
      // { field: 'accountStatus', label: 'Account Status', type: 'boolean' },
      { field: 'parentUsername', label: 'Parent', type: 'string' },
      { field: 'creditsAvailable', label: 'Credits Available', type: 'integer' },
      { field: 'creditsOwed', label: 'Credits Owed', type: 'integer' },
      { field: 'createdAt', label: 'Created At', type: 'date' },
    ]
    if (this.props.location.pathname.substr(1) !== 'resellers') rows.splice(6, 1)

    return (
      <>
        <Tabs value={this.state.filter} onChange={this.handleFilter} >
          <Tab label="Active" value='active' icon={<Icon style={{color:'green'}}>thumb_up</Icon>}/>
          <Tab label="Inactive" value='inactive' icon={<Icon style={{color:'red'}}>thumb_down</Icon> }/>
        </Tabs>
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
      </>
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
