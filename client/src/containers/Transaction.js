import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'



const rows = [
  { field: 'createdAt', label: 'Date', type: 'date'},
  { field: 'transactionFrom', label: 'From', type: 'string'},
  { field: 'transactionTo', label: 'To', type: 'string'},
  { field: 'credits', label: 'Credits', type: 'integer'},
  { field: 'description', label: 'Description', type: 'string'},
]


class Transaction extends Component {

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
        orderByDirection='asc'
        mobileView={this.props.mobileView}
        viewOnly={true}
        tableHeight={this.props.mobileView ? '75vh' : '85vh'}
        canDownload={this.props.authUserType==='superAdmin'}
      />
    )
  }
}


const mapStateToProps = state => ({
  token: state.auth.token,
  authUsername: state.auth.username,
  authUserType: state.auth.userType,
  transactions: state.users.transactions,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
