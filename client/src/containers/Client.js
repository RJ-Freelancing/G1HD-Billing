import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import { getUsers } from 'actions/users'

const rows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string'  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  // { field: 'firstName', label: 'First Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'account_balance', label: 'Credits Available', type: 'integer'  },
  // { field: 'tariff_plan_id', label: 'Tariff Plan', type: 'string'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'comment', label: 'Reseller', type: 'string'  },
  { field: 'now_playing_content', label: 'Box Status', type: 'boolean'  },
  // { field: 'last_active', label: 'Last Active', type: 'date'  },
  // { field: 'status', label: 'Account Status', type: 'boolean'  }
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
        clientData[row.field] = client[row.field]
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
        gotoLink={(client)=>this.props.history.push(`/clients/${client.stb_mac}`)}
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
