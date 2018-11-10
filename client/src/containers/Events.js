import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsers } from 'actions/users'
import Table from 'components/EventsTable'



const rows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string'  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'account_balance', label: 'Credits Available', type: 'integer'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'comment', label: 'Reseller', type: 'string'  },
  { field: 'now_playing_content', label: 'Box Status', type: 'boolean'  },
]

class Events extends Component {

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

  render() {
    return (
      <Table
        title={'MAC IDs'}
        rows={rows}
        data={this.getTableData()}
        orderBy='tariff_expired_date'
        mobileView={this.props.mobileView}
        sendEvent={(macIDs)=>console.log('SHOE SEND EVENT POPUTP FOR', macIDs)}
        tableHeight='70vh'
      />
    )
  }
}






const mapStateToProps = state => ({
  token: state.auth.token,
  clients: state.users.clients,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),

})

export default connect(mapStateToProps, mapDispatchToProps)(Events)
