import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { getUsers } from 'actions/users'
import { updateCredits } from 'actions/transactions'
import { incrementClientCredit } from 'actions/clients'
import { updateAuthResellerCredits } from 'actions/auth'



const rows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string'  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  // { field: 'firstName', label: 'First Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'accountBalance', label: 'Credits Available', type: 'integer'  },
  // { field: 'tariff_plan_id', label: 'Tariff Plan', type: 'string'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'comment', label: 'Reseller', type: 'string'  },
  { field: 'now_playing_content', label: 'Box Status', type: 'boolean'  },
  // { field: 'last_active', label: 'Last Active', type: 'date'  },
  // { field: 'status', label: 'Account Status', type: 'boolean'  }
]


class Client extends Component {

  componentDidMount = () => this.props.getUsers()

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

  incrementClientCredit = (stb_mac) => {
    this.props.updateCredits({
      credits: 1,
      description: 'Added 1 credit',
      transactionTo: stb_mac
    })
    .then(()=>{
      this.props.incrementClientCredit(stb_mac)
      this.props.updateAuthResellerCredits(-1)
    })
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
        incrementClientCredit={(stb_mac)=>this.incrementClientCredit(stb_mac)}
        authCreditsAvailable={this.props.authCreditsAvailable}
        authCreditsOnHold={this.props.authCreditsOnHold}
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
  authCreditsOnHold: state.auth.creditsOnHold,
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
  updateCredits: transaction => dispatch(updateCredits(transaction)),
  incrementClientCredit: stb_mac => dispatch(incrementClientCredit(stb_mac)),
  updateAuthResellerCredits: creditsAvailable => dispatch(updateAuthResellerCredits(creditsAvailable))
})

export default connect(mapStateToProps, mapDispatchToProps)(Client)
