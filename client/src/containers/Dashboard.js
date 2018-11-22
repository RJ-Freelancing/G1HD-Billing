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


import { checkMAC } from 'actions/clients'


const validMAC = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`


const CreditsSummary = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#41295a, #2F0743);
`


const Announcments = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#00bf8f, #001510);
  grid-column: 2 / 4;
  @media only screen and (max-width: 768px) {
    grid-column: 1;
  }
 
`

const CheckMAC = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#ABBAAB, #33001B);
`

const ClientsAboutToExpire = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#dc2430, #7b4397);
`

const TransactionsSummary = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#00467F, #A5CC82);
`

const UsersAccountBalance = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#3C3B3F, #605C3C);
`

const ChildrenSummary = styled(Paper)`
  min-height: 250px;
  background-image: linear-gradient(#F2994A, #F2C94C);
`

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


  render() {
    const { authUserType, authCreditsAvailable, authcreditsOwed, UserAnnouncements } = this.props
    const { checkMACResults } = this.state

    return (
      <Wrapper>
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

        <Announcments elevation={10}>
          <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h4"> Announcments </Typography>
          <div style={{color: 'white', padding: 10}}>
            {ReactHtmlParser(UserAnnouncements)}
          </div>
        </Announcments>


        <CheckMAC elevation={10}>
          <Typography  style={{textAlign: 'left', padding: 10, color: 'black'}} variant="h4"> Check MAC </Typography>
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
                    <Typography  style={{textAlign: 'left', padding: 10, color: 'white'}} variant="h5"> Expires on {format(Date.parse(checkMACResults.expiryDate), 'd MMMM YYYY')} </Typography>
                  }
                </div>
              </>
            }
          </div>

        </CheckMAC>

        <TransactionsSummary elevation={10}/>
        <ClientsAboutToExpire elevation={10}/>
        <UsersAccountBalance elevation={10}/>
        <ChildrenSummary elevation={10}/>
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
  UserAnnouncements: state.config.UserAnnouncements
})

const mapDispatchToProps = dispatch => ({
  checkMAC: mac => dispatch(checkMAC(mac))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
