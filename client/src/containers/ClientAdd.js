import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import InputMask from 'react-input-mask';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


import { getUsers } from 'actions/users'
import { addClient } from 'actions/clients'
import { updateCredits } from 'actions/transactions'
import { getTariffPlans } from 'actions/general'


const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
const validMAC = /^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  margin: 20px 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  justify-items: center;
`

const ClientEditWrapper = styled(Paper)`
  padding: 20px 20px;
  min-width: 1068px;
  @media only screen and (max-width: 768px) {
    min-width: 80vw;
  }
`

const ClientEdit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`


class ClientAdd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newClient: {
        login: "",
        stb_mac: "00-1A-79",
        password: "",
        full_name: "",
        phone: "",
        tariff_plan: "1",
        credits: 0
      },
      passwordConfirmation: ""
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.props.getTariffPlans()
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!this.props.token) this.props.history.push('/login')
  }

  handleTextChange = (field, value) => {
    this.setState({newClient: {...this.state.newClient, [field]: value}})
  }

  addClient = (event) => {
    event.preventDefault()
    const { login, stb_mac, full_name, phone, tariff_plan, password } = this.state.newClient
    this.props.addClient({login, stb_mac, full_name, phone, tariff_plan, status: 0})
    .then(clientAddResponse => {
      if (clientAddResponse.type==='ADD_CLIENT_SUCCESS') {
        if (this.state.newClient.credits > 0) {
          this.props.updateCredits({
            credits: this.state.newClient.credits,
            description: "Add initial credits for new client",
            transactionTo: this.state.newClient.stb_mac
          })
          .then(creditAddResponse => {
            if (creditAddResponse.type==='UPDATE_CREDIT_SUCCESS') {
              this.props.history.push(`/clients/${this.state.newClient.stb_mac}`)
            }
          })
        }
        else {
          this.props.history.push(`/clients/${this.state.newClient.stb_mac}`)
        }
      }
    })
  }

  checkValidation = () => {
    const loginEmpty = this.state.newClient.login==="";
    const passwordEmpty = this.state.newClient.password===""
    const passwordConfirmationNonMatch = this.state.passwordConfirmation !== this.state.newClient.password
    const fullNameEmpty = this.state.newClient.full_name==="";
    const invalidMAC = this.state.newClient.stb_mac==="" || !this.state.newClient.stb_mac.match(validMAC);
    const phoneInvalid = this.state.newClient.phone==="" || !this.state.newClient.phone.match(validPhoneNo);
    return loginEmpty || passwordEmpty || passwordConfirmationNonMatch || fullNameEmpty || phoneInvalid || invalidMAC
  }

  render() {   
    
    return (
      <Wrapper>
        <ClientEditWrapper elevation={24}>
          <Typography variant="h4" noWrap>
            Create a new Client
          </Typography>
          <br/>
          <form onSubmit={this.addClient} style={{padding: 10}}>
            <ClientEdit>
              <TextField
                label="Username"
                type="username"
                required
                value={this.state.newClient.login}
                onChange={(e)=>this.handleTextChange('login', e.target.value.toLowerCase().trim())}
                fullWidth
                disabled={this.props.loading || this.props.authCreditsAvailable<=0}
                autoFocus
                error={!this.props.authCreditsAvailable<=0 && this.state.newClient.login===""}
                helperText={!this.props.authCreditsAvailable<=0 && this.state.newClient.login==="" ? "Required" : null}
              />
              <InputMask mask="**:**:**:**:**:**" 
                value={this.state.newClient.stb_mac}  
                onChange={(e)=>this.handleTextChange('stb_mac', e.target.value.toUpperCase())}
                disabled={this.props.loading || this.props.authCreditsAvailable<=0}
              >
                {(inputProps) => (
                  <TextField 
                    {...inputProps} 
                    label="MAC Address"
                    fullWidth
                    
                    error={!this.props.authCreditsAvailable<=0 && Boolean(this.state.newClient.stb_mac) && !this.state.newClient.stb_mac.match(validMAC)}
                    helperText={!this.props.authCreditsAvailable<=0 && this.state.newClient.stb_mac && !this.state.newClient.stb_mac.match(validMAC) ? "Invalid MAC Given" : null}
                  />
                )}
              </InputMask>
              <TextField
                label="Password"
                type="password"
                required
                value={this.state.newClient.password}
                onChange={(e)=>this.handleTextChange('password', e.target.value)}
                fullWidth
                disabled={this.props.loading}
                error={Boolean(this.state.newClient.password) && this.state.newClient.password===""}
                helperText={this.state.newClient.password && this.state.newClient.password==="" ? "Required" : null}
              />
              <TextField
                label="Password Confirmation"
                type="password"
                required
                value={this.state.passwordConfirmation}
                onChange={(e)=>this.setState({passwordConfirmation: e.target.value})}
                fullWidth
                disabled={this.props.loading}
                error={
                  (Boolean(this.state.passwordConfirmation) && this.state.passwordConfirmation==="") ||
                  (this.state.passwordConfirmation !== this.state.newClient.password)
                }
                helperText={
                  this.state.passwordConfirmation && this.state.passwordConfirmation==="" ? "Required" 
                  : (this.state.passwordConfirmation !== this.state.newClient.password) ? "Password & Password Confirmation must match"
                  : null
                }
              />
              <TextField
                label="Full Name"
                type="name"
                required
                value={this.state.newClient.full_name}
                onChange={(e)=>this.handleTextChange('full_name', e.target.value)}
                fullWidth
                disabled={this.props.loading || this.props.authCreditsAvailable<=0}
                error={Boolean(this.state.newClient.full_name) && this.state.newClient.full_name===""}
                helperText={this.state.newClient.full_name && this.state.newClient.full_name==="" ? "Required" : null}
              />
              <InputMask mask="999-999-9999" 
                value={this.state.newClient.phone}  
                onChange={(e)=>this.handleTextChange('phone', e.target.value)}
                disabled={this.props.loading || this.props.authCreditsAvailable<=0}
              >
                {(inputProps) => (
                  <TextField 
                    {...inputProps} 
                    label="Phone"
                    fullWidth
                    required
                    error={Boolean(this.state.newClient.phone) && !this.state.newClient.phone.match(validPhoneNo)}
                    helperText={this.state.newClient.phone && !this.state.newClient.phone.match(validPhoneNo) ? "Invalid Phone" : null}
                  />
                )}
              </InputMask>
              <FormControl>
                <InputLabel htmlFor="tariff_plan">Tariff Plan</InputLabel>
                <Select
                  label="Tarriff Plan"
                  value={this.state.newClient ? this.state.newClient.tariff_plan : "1"}
                  onChange={(e)=>this.handleTextChange('tariff_plan', e.target.value)}
                  inputProps={{ id: 'tariff' }}
                  disabled={this.props.loading || this.props.authCreditsAvailable<=0}
                >
                  {
                    this.props.tariffPlans.map(plan=>(
                      <MenuItem key={plan.id} value={plan.id}> {plan.name} </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <TextField 
                  label="Add Credits"
                  value={this.state.newClient.credits}
                  onChange={(e)=>this.handleTextChange('credits', e.target.value)}
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, max: 12 }}
                  disabled={this.props.loading || this.props.authCreditsAvailable<=0}
                  error={
                    (this.state.newClient.credits > 12 || this.state.newClient.credits < 0) ||
                    (this.props.authCreditsAvailable<=0 && this.state.newClient.credits > 0)
                  }
                  helperText={ 
                    (this.state.newClient.credits > 12 || this.state.newClient.credits < 0) ? "Credits can range from 0 to 12" : 
                    (this.props.authCreditsAvailable<=0 && this.state.newClient.credits > 0) ? "You don't have enough credits to add" :
                    null}
                />
              {this.props.authCreditsAvailable<=0 && <Typography variant="h6" color='secondary'> You don't have enough credits to add a new client. </Typography>}
            </ClientEdit>
            <br/><br/>
            <Button 
              variant="contained" 
              type="submit" 
              color="primary" 
              disabled={this.props.loading || this.checkValidation() || (this.props.authCreditsAvailable<=0 && this.state.newClient.credits > 0) || this.props.authCreditsAvailable<=0}
            >
              Submit&nbsp;
              <SaveIcon />
            </Button>
            <Button variant="contained" color="secondary" onClick={()=>this.props.history.push('/')} style={{float: 'right'}}>
              Cancel&nbsp;
              <SaveIcon />
            </Button>
          </form>
        </ClientEditWrapper>

      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  authUsername: state.auth.username, 
  clients: state.users.clients,
  tariffPlans: state.config.tariffPlans,
  authCreditsAvailable: state.auth.creditsAvailable,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  addClient: (client) => dispatch(addClient(client)),
  getUsers: () => dispatch(getUsers()),
  getTariffPlans: () => dispatch(getTariffPlans()),
  updateCredits: (transaction) => dispatch(updateCredits(transaction))
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientAdd)
