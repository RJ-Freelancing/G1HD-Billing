import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'

import { updateCredits } from 'actions/transactions'



const rows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string'  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'accountBalance', label: 'Credits Available', type: 'integer'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'parentUsername', label: 'Reseller', type: 'string'  },
  // { field: 'comment', label: 'Comments', type: 'string'  },
  // { field: 'now_playing_content', label: 'Box Status', type: 'string'  },
  { field: 'status', label: 'Account Status', type: 'boolean'  }
]


class ClientList extends Component {

  getTableData = () => {    
    let displayData = []
    for (let client of this.props.clients) {
      let clientData = {}
      for (let row of rows) {
        clientData[row.field] = client[row.field]
      }
      displayData.push({...clientData})
    }
    return displayData
  } 

  incrementClientCredit = (client) => {
    this.props.updateCredits({
      credits: 1,
      description: 'Added 1 credit',
      transactionTo: client.stb_mac
    }, client.accountBalance)
  }

  render() {
    return (
      <Table
        title={'Clients'}
        rows={rows}
        data={this.getTableData()}
        orderBy='tariff_expired_date'
        orderByDirection='asc'
        mobileView={this.props.mobileView}
        gotoLink={(client)=>this.props.history.push(`/clients/${client.stb_mac}`)}
        addNew={()=>this.props.history.push('/clients/new')}
        incrementClientCredit={this.props.authUserType==='reseller' ? (client)=>this.incrementClientCredit(client) : false}
        authCreditsAvailable={this.props.authCreditsAvailable}
        authcreditsOwed={this.props.authcreditsOwed}
        tableHeight={this.props.mobileView ? '70vh' : '80vh'}
        canAdd={this.props.authUserType==='reseller'}
      />
    )
  }
}


const mapStateToProps = state => ({
  token: state.auth.token,
  authUserType: state.auth.userType,
  clients: state.users.clients,
  mobileView: state.general.mobileView,
  authCreditsAvailable: state.auth.creditsAvailable,
  authcreditsOwed: state.auth.creditsOwed,
})

const mapDispatchToProps = dispatch => ({
  updateCredits: (transaction, currentAccountBalance) => dispatch(updateCredits(transaction, currentAccountBalance)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientList)
