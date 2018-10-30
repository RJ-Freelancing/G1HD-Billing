import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { format } from 'date-fns'

import { getUsers } from 'actions/users'


const rows = [
  { field: 'stb_mac', numeric: false, label: 'MAC' },
  { field: 'full_name', numeric: false, label: 'Full Name' },
  // { field: 'firstName', numeric: false, label: 'First Name' },
  // { field: 'lastName', numeric: false, label: 'Last Name' },
  { field: 'phone', numeric: false, label: 'Telephone' },
  { field: 'tariff_expired_date', numeric: false, label: 'Expiry Date' },
  // { field: 'parentID', numeric: false, label: 'Parent Username' },
  // { field: 'childrenCount', numeric: true, label: 'No of Children' },
  { field: 'last_active', numeric: false, label: 'Last Active' },
  // { field: 'updatedAt', numeric: false, label: 'Updated At' }
]


class Client extends Component {

  componentDidMount = () => {
    this.props.getUsers()
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
      />
    )
  }
}


const mapStateToProps = state => ({
  clients: state.users.clients,
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Client)
