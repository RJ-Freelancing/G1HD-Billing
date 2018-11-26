import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import ReactHtmlParser from 'react-html-parser';
import InputMask from 'react-input-mask';
import TextField from '@material-ui/core/TextField'
import { format } from 'date-fns'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Table from 'components/Table'
import Icon from '@material-ui/core/Icon';


import { checkMAC } from 'actions/clients'
import { updateCredits } from 'actions/transactions'


const validMAC = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
`

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
const Bottom = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
`

const CreditsSummary = styled(Paper)`
  background-image: linear-gradient(60deg, #7266BA, #7266BA);
`

const Announcements = styled(Paper)`
  background-image: linear-gradient(60deg, #42BBF6, #42BBF6);
`

const CheckMAC = styled(Paper)`
  background-image: linear-gradient(60deg, #7ED336, #7ED336);
`

const ChildrenSummary = styled(Paper)`
  background-image: linear-gradient(60deg, #F75D81, #F75D81);
  padding-bottom: 10px;
`

const ClientsAboutToExpire = styled.div`
`

const TransactionsSummary = styled.div`
`

const UsersAccountBalance = styled.div`
`



const transactionRows = [
  { field: 'createdAt', label: 'Date', type: 'date'},
  { field: 'transactionFrom', label: 'From', type: 'string'},
  { field: 'transactionTo', label: 'To', type: 'string'},
  { field: 'credits', label: 'Credits', type: 'integer'},
]

const clientRows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string'  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'accountBalance', label: 'Credits Available', type: 'integer'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'parentUsername', label: 'Reseller', type: 'string'  },
]

let userRows = [
  { field: 'username', label: 'Username', type: 'string' },
  { field: 'email', label: 'Email', type: 'string' },
  { field: 'phoneNo', label: 'Telephone', type: 'string' },
  { field: 'parentUsername', label: 'Parent', type: 'string' },
  { field: 'creditsAvailable', label: 'Credits Available', type: 'integer' },
]

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkMAC: '00-1A-79',
      checkMACResults: ''
    }
  }

  checkMac = () => {
    if (this.state.checkMAC.match(validMAC)) {
      this.props.checkMAC(this.state.checkMAC)
      .then(response => {
        if (response.type === 'CHECK_MAC_SUCCESS')
          this.setState({checkMACResults: response.payload.data})
        else 
          this.setState({checkMACResults: {status: 'Something went wrong while checking MAC availability'}})
      })
    } else {     
      if (!this.state.checkMAC.includes('_'))
        this.setState({checkMACResults: {status: 'Invalid MAC ID'}})
      else
        this.setState({checkMACResults: ''})
    }
  }

  getTransactionsData = () => {    
    let displayData = []
    for (let transaction of this.props.transactions) {
      let transactionData = {}
      for (let row of transactionRows) {
        transactionData[row.field] = transaction[row.field]
      }
      displayData.push({...transactionData})
    }
    return displayData
  } 

  getClientsData = () => {    
    let displayData = []
    for (let client of this.props.clients) {
      let clientData = {}
      for (let row of clientRows) {
        clientData[row.field] = client[row.field]
      }
      displayData.push({...clientData})
    }
    return displayData
  } 

  getUsersData = (rows, urlPath) => {       
    const users = [...this.props.admins, ...this.props.superResellers, ...this.props.resellers]
    let displayData = []
    for (let user of users) {    
      let userData = {}
      for (let row of userRows) {
        userData[row.field] = user[row.field]
      }   
      displayData.push({...userData})
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
    const { 
      authUserType, 
      authCreditsAvailable, 
      authcreditsOwed, 
      UserAnnouncements,
      admins,
      superResellers,
      resellers,
      clients
    } = this.props
    const { checkMACResults } = this.state

    return (
      <Wrapper>
        <Top>
          <CreditsSummary elevation={10}>
            <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h4"> Credits Summary </Typography>
            <div style={{display: 'grid', gridTemplateColumns: authUserType==='reseller' ? '2fr 1fr' : '1fr', alignItems: 'center', justifyItems: 'center'}}>
              <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h6"> Credits Available </Typography>
              <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h2"> {authCreditsAvailable} </Typography>
            </div>
            {authUserType==='reseller' && 
              <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', alignItems: 'center', justifyItems: 'center'}}>
                <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h6"> Credits Owed </Typography>
                <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h2"> {authcreditsOwed} </Typography>
              </div>
            }
          </CreditsSummary>

          <Announcements elevation={10}>
            <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h4"> Announcements </Typography>
            <div style={{color: 'white', padding: 10}}>
              {ReactHtmlParser(UserAnnouncements)}
            </div>
          </Announcements>

          <CheckMAC elevation={10}>
            <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h4"> Check MAC </Typography>
            <div style={{display: 'grid', gridGap: 20, padding: 10}}>
              <InputMask mask="**:**:**:**:**:**" 
                value={this.state.checkMAC}  
                onChange={(e)=>this.setState({checkMAC: e.target.value.toUpperCase()}, this.checkMac)}
              >
                {(inputProps) => (
                  <TextField 
                    {...inputProps} 
                    label="MAC Address"
                    fullWidth
                  />
                )}
              </InputMask>
              {this.state.checkMACResults && 
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', justifyItems: 'center'}}>
                    <Typography  style={{textAlign: 'left', color: 'white'}} variant="h5"> 
                      {checkMACResults.status==='Available.' ? <ThumbUpIcon fontSize="large"/> : <ThumbDownIcon fontSize="large"/>} 
                    </Typography>
                    <Typography  style={{textAlign: 'left', color: 'white'}} variant="h5"> {checkMACResults.status} </Typography>
                    {checkMACResults.expiryDate && 
                      <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h5"> Expires on {format(Date.parse(checkMACResults.expiryDate), 'D MMMM YYYY')} </Typography>
                    }
                  </div>
                </>
              }
            </div>
          </CheckMAC>

          <ChildrenSummary elevation={10}>
            <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h4"> Users Stats </Typography>
            {authUserType==='superAdmin' &&
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', alignItems: 'center'}}>
              <Typography  style={{textAlign: 'left', paddingLeft: 50, color: 'white'}} variant="h6"><Icon>local_library</Icon> Admins</Typography>
              <Typography  style={{textAlign: 'right', paddingRight: 50, color: 'white'}} variant="h4"> {admins.length} </Typography>
            </div>
            }
            {['superAdmin', 'admin'].includes(authUserType) &&
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', alignItems: 'center'}}>
              <Typography  style={{textAlign: 'left', paddingLeft: 50, color: 'white'}} variant="h6"><Icon>group</Icon> Super Resellers </Typography>
              <Typography  style={{textAlign: 'right', paddingRight: 50, color: 'white'}} variant="h4"> {superResellers.length} </Typography>
            </div>
            }
            {['superAdmin', 'admin', 'superReseller'].includes(authUserType) &&
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', alignItems: 'center'}}>
              <Typography  style={{textAlign: 'left', paddingLeft: 50, color: 'white'}} variant="h6"><Icon>person</Icon> Resellers </Typography>
              <Typography  style={{textAlign: 'right', paddingRight: 50, color: 'white'}} variant="h4"> {resellers.length} </Typography>
            </div>
            }
            {['superAdmin', 'admin', 'superReseller', 'reseller'].includes(authUserType) &&
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', alignItems: 'center'}}>
              <Typography  style={{textAlign: 'left', paddingLeft: 50, color: 'white'}} variant="h6"><Icon>airplay</Icon> Clients </Typography>
              <Typography  style={{textAlign: 'right', paddingRight: 50, color: 'white'}} variant="h4"> {clients.length} </Typography>
            </div>
            }
          </ChildrenSummary>
        </Top>
        
        <Bottom>
          <ClientsAboutToExpire elevation={10}>
            <Table
              title={'Clients About To Expire'}
              rows={clientRows}
              data={this.getClientsData()}
              orderBy='tariff_expired_date'
              orderByDirection='asc'
              mobileView={this.props.mobileView}
              gotoLink={(client)=>this.props.history.push(`/clients/${client.stb_mac}`)}
              incrementClientCredit={authUserType==='reseller' ? (client)=>this.incrementClientCredit(client) : false}
              authCreditsAvailable={this.props.authCreditsAvailable}
              authcreditsOwed={this.props.authcreditsOwed}
              tableHeight='100%'
              limit={5}
              noPagination
              backgroundColor='linear-gradient(60deg, #66bb6a, #43a047)'
          />
          </ClientsAboutToExpire>
          
          {authUserType!=='reseller' &&
            <UsersAccountBalance elevation={10}>
              <Table
                title='Users With Low Credits'
                rows={userRows}
                data={this.getUsersData()}
                orderBy='creditsAvailable'
                orderByDirection='asc'
                mobileView={this.props.mobileView}
                gotoLink={(user)=>this.props.history.push(`/users/${user.username}`)} 
                tableHeight='100%'
                limit={5}
                noPagination
                backgroundColor='linear-gradient(60deg, #ffa726, #fb8c00)'
              />
            </UsersAccountBalance>
          }

          <TransactionsSummary elevation={10}>
            <Table
              title='Recent Transactions'
              rows={transactionRows}
              data={this.getTransactionsData()}
              orderBy='createdAt'
              orderByDirection='desc'
              mobileView={this.props.mobileView}
              viewOnly={true}
              tableHeight='100%'
              limit={5}
              noPagination
              backgroundColor='linear-gradient(60deg, #ef5350, #e53935)'
            />
          </TransactionsSummary>
        </Bottom>

      </Wrapper>
    )
  }
}



const mapStateToProps = state => ({
  token: state.auth.token,
  authUserType: state.auth.userType,
  authCreditsAvailable: state.auth.creditsAvailable,
  authcreditsOwed: state.auth.creditsOwed,
  mobileView: state.general.mobileView,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  clients: state.users.clients,
  transactions: state.users.transactions,
  UserAnnouncements: state.config.UserAnnouncements
})

const mapDispatchToProps = dispatch => ({
  checkMAC: mac => dispatch(checkMAC(mac)),
  updateCredits: (transaction, currentAccountBalance) => dispatch(updateCredits(transaction, currentAccountBalance)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
