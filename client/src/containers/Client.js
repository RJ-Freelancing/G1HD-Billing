import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import { getUsers } from 'actions/users'

const rows = [
  { field: 'mac', numeric: false, label: 'MAC Address' },
  { field: 'fname', numeric: false, label: 'Full Name' },
  // { field: 'firstName', numeric: false, label: 'First Name' },
  { field: 'phone', numeric: false, label: 'Telephone' },
  { field: 'account_balance', numeric: true, label: 'Credits Available' },
  // { field: 'tariff_plan_id', numeric: false, label: 'Tariff Plan' },
  { field: 'tariff_expired_date', numeric: false, label: 'Tariff Expiry' },
  { field: 'comment', numeric: false, label: 'Reseller' },
  { field: 'now_playing_content', numeric: false, label: 'Box Status' },
  // { field: 'last_active', numeric: false, label: 'Last Active' },
  // { field: 'status', numeric: false, label: 'Account Status' }
]


class Client extends Component {

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.props.getUsers()
  }

  getTableData = () => {    
    let displayData = []
    for (let client of this.props.clients) {
      let clientData = {}
      for (let row of rows) {
        if (['tariff_expired_date', 'last_active'].includes(row.field)) {
          clientData[row.field] = format(Date.parse(client[row.field]), 'd MMMM YYYY @ HH:mm:ss')
        } else {
          clientData[row.field] = client[row.field]
        }
      }
      displayData.push({...clientData})
    }
    return displayData
  } 

  render() {
    return (
      <Table
        title={'Clients'}
        rows={rows}
        data={this.getTableData()}
        orderBy='tariff_expired_date'
        mobileView={this.props.mobileView}
        gotoLink={(client)=>this.props.history.push(`/clients/${client.mac}`)}
        addNew={()=>this.props.history.push('/clients/new')}
        tableHeight='70vh'
        canAdd={this.props.authUserType==='reseller'}
      />
    )
  }
}


const mapStateToProps = state => ({
  token: state.auth.token,
  authUserType: state.auth.userType,
  clients: state.users.clients,
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),

})

export default connect(mapStateToProps, mapDispatchToProps)(Client)
