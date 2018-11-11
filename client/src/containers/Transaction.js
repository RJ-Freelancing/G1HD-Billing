import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { getTransactions } from 'actions/transactions'

const rows = [
  { field: 'createdAt', label: 'Date', type: 'date'},
  { field: 'transactionFrom', label: 'From', type: 'string'},
  { field: 'transactionTo', label: 'To', type: 'string'},
  { field: 'credits', label: 'Credits', type: 'integer'},
  { field: 'description', label: 'Description', type: 'string'},
]


class Transaction extends Component {

  componentDidMount = () => this.props.getTransactions(this.props.authUsername)
  
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
        orderBy='createdAt'
        mobileView={this.props.mobileView}
        viewOnly={true}
        tableHeight={this.props.mobileView ? '70vh' : '80vh'}
      />
    )
  }
}


const mapStateToProps = state => ({
  token: state.auth.token,
  authUsername: state.auth.username,
  transactions: state.users.transactions,
})

const mapDispatchToProps = dispatch => ({
  getTransactions: username => dispatch(getTransactions(username)),

})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
