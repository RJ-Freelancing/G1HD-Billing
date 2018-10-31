import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import { getTransactions } from 'actions/users'

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


class Transaction extends Component {

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.props.getTransactions()
  }

  
  getTableData = () => {    
    let displayData = []
    for (let transaction of this.props.transactions) {
      let transactionData = {}
      for (let row of rows) {
        if (['tariff_expired_date', 'last_active'].includes(row.field)) {
          transactionData[row.field] = format(Date.parse(transaction[row.field]), 'd MMMM YYYY @ HH:mm:ss')
        } else {
          transactionData[row.field] = transaction[row.field]
        }
      }
      displayData.push({...transactionData})
    }
    return displayData
  } 

  render() {
    return (
      <Table
        title={'Transactions'}
        rows={rows}
        data={this.getTableData()}
        orderBy='tariff_expired_date'
        mobileView={this.props.mobileView}
      />
    )
  }
}


const mapStateToProps = state => ({
  token: state.auth.token,
  transactions: state.users.transactions,
})

const mapDispatchToProps = dispatch => ({
  getTransactions: () => dispatch(getTransactions()),

})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
