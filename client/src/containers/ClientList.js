import React, { Component } from 'react'
import Table from 'components/Table'
import { connect } from 'react-redux'
import Confirmation from 'components/Confirmation'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import { isPast } from 'date-fns'

import { updateCredits } from 'actions/transactions'
import { reactivateClient } from 'actions/clients'




const rows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string', link: true  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'accountBalance', label: 'Credits Available', type: 'integer'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'parentUsername', label: 'Reseller', type: 'string'  },
  { field: 'now_playing_content', label: 'Now Playing', type: 'string'  },
]


class ClientList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmation: false,
      plusOneClient: null,
      filter: 'active',
      showReactivateFilter: false
    }
  }

  componentDidMount = () => {
    for (let client of this.props.clients) {      
      if (this.props.authUserType === 'reseller' && !this.state.showReactivateFilter && client.accountBalance > 0 && client.status === 1) {       
        this.setState({showReactivateFilter: true})
        break
      } 
    }   
  }

  getTableData = () => {    
    let displayData = []
    for (let client of this.props.clients) {
      let canPush = (this.state.filter==='active' && !isPast(client.tariff_expired_date)) || (this.state.filter==='expired' && isPast(client.tariff_expired_date))
      canPush = canPush || (this.state.filter==='reactivate' && client.accountBalance > 0 && client.status === 1)
      if (canPush) {
        let clientData = {}
        for (let row of rows) {
          clientData[row.field] = client[row.field]
        }
        displayData.push({...clientData})
      }
    }
    return displayData
  } 

  confirmationProceed = () => this.setState({confirmation: false})
  confirmationCancel = () => this.setState({confirmation: false})

  incrementClientCredit = (client) => {
    this.confirmationProceed = () => {
      this.setState({confirmation: false}, ()=>{
        this.props.updateCredits({
          credits: 1,
          description: 'Added 1 credit',
          transactionTo: client.stb_mac
        }, client.accountBalance)
      })
    }
    this.setState({confirmation: true, plusOneClient: client.stb_mac})
  }


  handleFilter = (event, filter) => {
    this.setState({ filter })
  }

  render() {
    return (
      <>
        <Tabs value={this.state.filter} onChange={this.handleFilter} >
          <Tab label="Active" value='active' icon={<Icon style={{color:'green'}}>live_tv</Icon>}/>
          <Tab label="Expired" value='expired' icon={<Icon style={{color:'red'}}>tv_off</Icon> }/>
          {this.props.authUserType === 'reseller' && this.state.showReactivateFilter && 
            <Tab label="To Be Reactivated" value='reactivate' icon={<Icon style={{color:'blue'}}>settings_input_hdmi</Icon> }/>
          }
        </Tabs>
 
        <Table
          title={'Clients'}
          rows={rows}
          data={this.getTableData()}
          orderBy='tariff_expired_date'
          orderByDirection='desc'
          mobileView={this.props.mobileView}
          gotoLink={(client)=>this.props.history.push(`/clients/${client.stb_mac}`)}
          addNew={()=>this.props.history.push('/clients/new')}
          incrementClientCredit={this.props.authUserType==='reseller' ? (client)=>this.incrementClientCredit(client) : false}
          reactivateClient={this.state.filter==='reactivate' ? (client)=>this.props.reactivateClient(client.stb_mac) : false}
          authCreditsAvailable={this.props.authCreditsAvailable}
          authcreditsOwed={this.props.authcreditsOwed}
          tableHeight={this.props.mobileView ? '75vh' : '85vh'}
          canAdd={this.props.authUserType==='reseller'}
          canDownload={this.props.authUserType==='superAdmin'}
        />
        <Confirmation
          open={this.state.confirmation}
          message={`Are you sure you want to add +1 credits to ${this.state.plusOneClient}`}
          confirmationProceed={this.confirmationProceed}
          confirmationCancel={this.confirmationCancel}
        />
      </>
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
  reactivateClient: mac => dispatch(reactivateClient(mac))
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientList)
