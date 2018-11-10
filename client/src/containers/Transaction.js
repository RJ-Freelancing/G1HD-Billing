import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { getTransactions } from 'actions/users'

const rows = [
  { field: 'created_at', label: 'Date', type: 'date'},
  { field: 'transactionFrom', label: 'From', type: 'string'},
  { field: 'transactionTo', label: 'To', type: 'string'},
  { field: 'credits', label: 'Credits', type: 'integer'},
  { field: 'description', label: 'Description', type: 'string'},
]


class Transaction extends Component {

  componentDidMount = () => this.props.getTransactions()
  
  getTableData = () => {    
    let displayData = []
    for (let transaction of this.props.transactions) {
      let transactionData = {}
      for (let row of rows) {
        transactionData[row.field] = transaction[row.field]
      }
      displayData.push({...transactionData})
    }
    return displayData
  } 

  render() {
    return (
      <Table
        title='Transactions'
        rows={rows}
        data={this.getTableData()}
        orderBy='tariff_expired_date'
        mobileView={this.props.mobileView}
        viewOnly={true}
        tableHeight='70vh'
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
