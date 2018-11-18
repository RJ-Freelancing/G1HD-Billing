import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash';
import { format } from 'date-fns'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import InputMask from 'react-input-mask';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Table from 'components/Table'
import Confirmation from 'components/Confirmation';
import EditIcon from '@material-ui/icons/Edit'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loading from 'components/Loading'

import { startCase } from 'lodash';
import SendIcon from '@material-ui/icons/Send'

import { getUsers } from 'actions/users'
import { addClient, updateClient, deleteClient, getSubscriptions, addSubscription, removeSubscription, sendEvent, checkMAC } from 'actions/clients'
import { getUserTransactions, updateCredits } from 'actions/transactions'
import { getTariffPlans } from 'actions/general'


const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
const validMAC = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 3fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ClientEditWrapper = styled(Paper)`
  padding: 20px 20px;
`

const ClientProfile = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  padding-bottom: 10px;
`

const CreditsWrapper = styled(Paper)`
  padding: 20px 20px;
`


const TariffWrapper = styled(Paper)`
  padding: 20px 20px;
`

const TariffDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
`

const TariffHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr  
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TariffPackagesHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 5px;
  }
  font-weight: bold;
`

const TariffPackages = styled.div`
  display: grid;
  grid-gap: 20px;
  // height: 100%;
  overflow-y: auto;
`

const TariffPackageRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 
  grid-gap: 0px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`


const STBDetailsWrapper = styled(Paper)`
  padding: 20px 20px;
  height: fit-content;
`

const STBDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding: 20px 20px;
`

const TransactionWrapper = styled(Paper)`
  @media only screen and (max-width: 768px) {
    grid-column: 1;
  }
  grid-column: 2 / -1;
`



const rows = [
  { field: 'createdAt', label: 'Date', type: 'date'},
  { field: 'transactionFrom', label: 'From', type: 'string'},
  { field: 'transactionTo', label: 'To', type: 'string'},
  { field: 'credits', label: 'Credits', type: 'integer'},
  { field: 'description', label: 'Description', type: 'string'},
]




class ClientEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      client: null,
      editingClient: null,
      deleteConfirmation: false,
      credits: {
        value: 1,
        action: "add"
      },
      subscriptions: [],
      msg: '',
      changeMAC: false,
      newMAC: '',
      checkMACStatus: '',
      transactions: []
    }
  }

  componentDidMount = () => {   
    this.props.getTariffPlans()
    const stb_mac = this.props.match.params.id
    const client = this.findClientFromMAC(stb_mac)
    if (client) {
      this.props.getUserTransactions(stb_mac)
      .then(resnponseTransactions => { 
        this.setState({client, editingClient: {...client}, transactions: resnponseTransactions.payload.data})
      })
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const stb_mac = this.props.match.params.id
    const client = this.findClientFromMAC(stb_mac)
    if (!isEqual(prevState.client, client)) {
      this.setState({client, editingClient: {...client}})
    }
  }

  findClientFromMAC = stb_mac => {
    return this.props.clients.find(client=>client.stb_mac===stb_mac)
  }

  handleTextChange = (field, value) => {
    this.setState({editingClient: {...this.state.editingClient, [field]: value}})
  }

  updateClient = (event) => {
    event.preventDefault()
    const { stb_mac } = this.state.editingClient
    const { full_name, phone, comment, status } = this.state.editingClient
    this.props.updateClient(stb_mac, {full_name, phone, comment, status})
  }

  checkValidation = () => {
    const loginEmpty = this.state.editingClient.login==="";
    const phoneInvalid = this.state.editingClient.phone && !this.state.editingClient.phone.match(validPhoneNo);
    return loginEmpty || phoneInvalid
  }

  deleteConfirmationProceed = () => this.setState({deleteConfirmation: false})
  deleteConfirmationCancel = () => this.setState({deleteConfirmation: false})

  deleteClient = (event) => {
    event.preventDefault()
    this.deleteConfirmationProceed = () => {
      this.setState({deleteConfirmation: false}, ()=>{
        this.props.deleteClient(this.state.editingClient.stb_mac)
        .then(() => this.props.history.push('/clients'))
    })}
    this.setState({deleteConfirmation: true})
  }

  updateCredits = () => {
    this.props.updateCredits({
      credits: this.state.credits.action==="add" ? this.state.credits.value : this.state.credits.value*-1,
      description: `${startCase(this.state.credits.action)}ed ${this.state.credits.value} credits`,
      transactionTo: this.state.editingClient.stb_mac
    }, this.state.client.accountBalance)
    .then((transactionResponse)=>{
      this.setState({transactions: [...this.state.transactions, transactionResponse.payload.data.transaction[0]]})
    })
  }

  setSubscription = (subscribed, checked) => {
    if (checked)
      this.props.addSubscription(this.state.editingClient.stb_mac, subscribed)
      .then(()=>this.setState({subscriptions: [...this.state.subscriptions, subscribed]}))
    else
      this.props.removeSubscription(this.state.editingClient.stb_mac, subscribed)
      .then(()=>this.setState({subscriptions: this.state.subscriptions.filter(sub => sub !== subscribed)}))
  }

  sendMessage = (event) => {
    event.preventDefault()
    this.props.sendEvent({
      event: "send_msg",
      ids: [this.state.editingClient.stb_mac],
      msg: this.state.msg,
      ttl: 240
    })
    .then(()=>this.setState({msg: ''}))
  }

  changeMAC = (event) => {
    event.preventDefault();
    this.setState({checkMACStatus: ''}, ()=>{
      this.props.checkMAC(this.state.newMAC)
      .then(response => {
        if (response.payload.data.status === 'Available.') {        
          this.props.updateClient(this.state.editingClient.stb_mac, {stb_mac: this.state.newMAC})
          .then(()=>this.props.history.push(`/clients/${this.state.newMAC}`))
        } else {
          this.setState({checkMACStatus: `Given MAC Address is already in use and will expire on ${format(Date.parse(response.payload.data.expiryDate), 'd MMMM YYYY')}`})
        }
      })
    })
  }

  getTableData = (transactions) => {    
    let displayData = []
    for (let transaction of transactions) {
      let transactionData = {}
      for (let row of rows) {
        transactionData[row.field] = transaction[row.field]
      }
      displayData.push({...transactionData})
    }
    return displayData
  } 

  render() {   
    if (!this.state.client)
      return (
        <Typography variant="h4">
            Client with MAC {this.props.match.params.id} was not found
        </Typography>
      )

    return (
      <Wrapper>
        <ClientEditWrapper elevation={24}>
          <Typography variant="h4" noWrap>
            Edit Client: {this.state.client.login}
          </Typography>
          <br/>
          {this.state.editingClient &&
            <form onSubmit={this.updateClient} style={{padding: 10}}>
              <ClientProfile>
                <TextField
                  label="Full Name"
                  type="name"
                  value={this.state.editingClient.full_name}
                  onChange={(e)=>this.handleTextChange('full_name', e.target.value)}
                  fullWidth
                  disabled={this.props.loading}
                />
                <InputMask mask="999-999-9999" 
                  value={this.state.editingClient.phone}  
                  onChange={(e)=>this.handleTextChange('phone', e.target.value)}
                >
                  {(inputProps) => (
                    <TextField 
                      {...inputProps} 
                      label="Phone"
                      fullWidth
                      disabled={this.props.loading}
                      error={Boolean(this.state.editingClient.phone) && !this.state.editingClient.phone.match(validPhoneNo)}
                      helperText={this.state.editingClient.phone && !this.state.editingClient.phone.match(validPhoneNo) ? "Invalid Phone" : null}
                    />
                  )}
                </InputMask>
                <TextField
                  label="Comments"
                  type="comment"
                  value={this.state.editingClient.comment ? this.state.editingClient.comment : ''}
                  onChange={(e)=>this.handleTextChange('comment', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  rowsMax="3"
                  disabled={this.props.loading}
                />
                <FormControlLabel
                  label={`Account Status (${this.state.editingClient.status===1 ? 'Active' : 'Inactive'})`}
                  control={
                    <Switch
                      checked={this.state.editingClient.status===1}
                      onChange={(e)=>this.handleTextChange('status', e.target.checked ? 1 : 0)}
                      value={this.state.editingClient.status}
                      color="primary"
                      disabled={this.props.loading}
                    />
                  }
                />
              </ClientProfile>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: 20}}>
                <Button 
                  variant="contained" 
                  type="submit" 
                  color="primary" 
                  disabled={this.props.loading || this.checkValidation() || isEqual(this.state.editingClient, this.state.client)}
                >
                  Update
                  <SaveIcon style={{marginLeft: 5}}/>
                </Button>
                <Button variant="contained" type="submit" color="secondary" disabled={this.props.loading} onClick={this.deleteClient}>
                  Delete
                  <DeleteIcon style={{marginLeft: 5}}/>
                </Button>
              </div>
            </form>
          }
        </ClientEditWrapper>
        <div>
          <CreditsWrapper elevation={24}>
            <Typography variant="h4"> Credits </Typography>
            {this.props.authUsername===this.state.client.parentUsername  &&
              <div>
                <br/><br/>
                <TextField
                  label="Select Credits"
                  type="number"
                  inputProps={{ min: 1, max: 12 }}
                  value={this.state.credits.value}
                  onChange={(e)=>this.setState({credits: {...this.state.credits, value: e.target.value}})}
                  fullWidth
                  disabled={this.props.loading}
                  error={
                    (this.state.credits.value < 1) || 
                    (this.state.credits.value > 12) || 
                    (this.state.credits.action==='add' && (this.props.authCreditsAvailable<=0 && this.state.client.accountBalance===0)) ||
                    (this.state.credits.action==='recover' && (this.state.client.accountBalance-this.state.credits.value < 0))
                  }
                  helperText={
                    (this.state.credits.value < 1 || this.state.credits.value > 12) ? 'Credits can only be transferred in the range from 1 to 12' 
                    : (this.state.credits.action==='add' && (this.props.authCreditsAvailable<=0 && this.state.client.accountBalance===0)) ? "You don't have enough credits to transfer"
                    : (this.state.credits.action==='recover' && (this.state.client.accountBalance-this.state.credits.value < 0)) ? 'Client has not enough credits to recover'
                    : null
                  }
                />
                <br/><br/>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    value={this.state.credits.action}
                    style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}
                    onChange={(e)=>this.setState({credits: {...this.state.credits, action: e.target.value}})}
                  >
                    <FormControlLabel value="add" control={<Radio />} label="Add" />
                    <FormControlLabel value="recover" control={<Radio />} label="Recover" />
                  </RadioGroup>
                </FormControl>
                <Button 
                  variant="contained" 
                  type="submit" 
                  color="primary" 
                  disabled={
                    (this.props.loading) || 
                    (this.state.credits.value < 1) || 
                    (this.state.credits.value > 12) || 
                    (this.state.credits.action==='add' && (this.props.authCreditsAvailable<=0 && this.state.client.accountBalance===0)) ||
                    (this.state.credits.action==='recover' && (this.state.client.accountBalance-this.state.credits.value < 0))
                  } 
                  style={{float: 'right'}} 
                  onClick={this.updateCredits}
                >
                  Submit
                  <SaveIcon style={{marginLeft: 5}}/>
                </Button>
              </div>
            }
            <br/><br/>
            {this.state.client && 
            <div style={{textAlign: 'center'}}>
              Credits Available<br/> <div style={{fontSize: 50}}> {this.state.client.accountBalance} </div>
            </div>
            }
          </CreditsWrapper>

          <Paper style={{padding: 20, textAlign: 'center', marginTop: 10}}>
            <Typography variant="h4" style={{textAlign: 'left', paddingBottom: 10}}> Send Message </Typography>
            <TextField
              // label="Send Message"
              type="text"
              value={this.state.msg ? this.state.msg : ''}
              onChange={(e)=>this.setState({msg: e.target.value})}
              fullWidth
              multiline
              rows={5}
              rowsMax="5"
              disabled={this.props.loading}
              placeholder="Send a message to this client to display in portal"
            /><br/><br/>
            <Button variant="contained" color="primary" disabled={this.props.loading || this.state.msg===""} onClick={this.sendMessage}>
              Send
              <SendIcon style={{marginLeft: 5}}/>
            </Button>
          </Paper>
        </div>
        <TariffWrapper elevation={24}>
          <Typography variant="h4"> Edit Tariff Plan</Typography>
          <br/><br/>
          <TariffDetails>
            <TariffHeader>
              <Select
                label="Tarriff Plan"
                value={this.state.client.tariff_plan}
                onChange={(e)=>this.props.updateClient(this.state.client.stb_mac, {tariff_plan: e.target.value})}
                inputProps={{ id: 'tariff_plan' }}
              >
                {
                  this.props.tariffPlans.map(plan=>(
                    <MenuItem key={plan.id} value={parseInt(plan.id)}> {plan.name} </MenuItem>
                  ))
                }
              </Select>
              <Typography variant="body2" style={{alignSelf: 'center', justifySelf: 'center'}}>
                Tariff Expires on : <strong>{format(Date.parse(this.state.client.tariff_expired_date), 'd MMMM YYYY')}</strong>
              </Typography>
            </TariffHeader>
            <TariffPackagesHeader>
              <div>Name</div><div style={{justifySelf: 'center'}}>Optional</div><div style={{justifySelf: 'center'}}>Subscribed</div>
            </TariffPackagesHeader>
            <TariffPackages>
              {
                this.props.tariffPlans.find(plan=>parseInt(plan.id)===this.state.client.tariff_plan) &&
                this.props.tariffPlans.find(plan=>parseInt(plan.id)===this.state.client.tariff_plan).packages.map(tariffPackage=>(
                  <TariffPackageRow key={tariffPackage.name}>
                    <div>{tariffPackage.name}</div>
                    <div style={{justifySelf: 'center'}}>{tariffPackage.optional==="1" ? "Yes": "No"}</div>
                    <Checkbox 
                      checked={tariffPackage.optional==="1" ? this.state.subscriptions.includes(tariffPackage.id) : true} 
                      disabled={tariffPackage.optional==="1" ? false: true}  
                      style={{padding: 10, justifySelf: 'center', height: 15}}
                      onChange={(e)=>this.setSubscription(tariffPackage.id, e.target.checked)}
                    />
                  </TariffPackageRow>
                ))
              }
            </TariffPackages>
          </TariffDetails>
        </TariffWrapper>
        <STBDetailsWrapper elevation={24}>
          <Typography variant="h4"> STB Details </Typography>
          <br/><br/>
          <STBDetails>           
            <Typography variant="subtitle2" style={{alignSelf: 'center'}}>MAC Address</Typography>
            <Typography variant="body2">
              {this.state.client.stb_mac}
              <Tooltip title="Change MAC">
                <IconButton aria-label="Change MAC" style={{padding: 9}} onClick={()=>this.setState({changeMAC: true})}>
                  <EditIcon fontSize="small" color="primary"/>
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography variant="subtitle2">Receiver Status</Typography>
            <Typography variant="body2">{this.state.client.online==="1" ? 'Online' : 'Offline'}</Typography>
            <Typography variant="subtitle2">IP</Typography>
            <Typography variant="body2">{this.state.client.ip}</Typography>
            <Typography variant="subtitle2">STB Type</Typography>
            <Typography variant="body2">{this.state.client.stb_type}</Typography>
            <Typography variant="subtitle2">STB Serial</Typography>
            <Typography variant="body2">{this.state.client.serial_number}</Typography>
            <Typography variant="subtitle2">Last Active</Typography>
            <Typography variant="body2">{format(Date.parse(this.state.client.last_active), 'd MMMM YYYY @ HH:mm:ss')}</Typography>
          </STBDetails>
        </STBDetailsWrapper>

        <TransactionWrapper elevation={24}>
          <Typography variant="h4" style={{padding: 20, paddingBottom: 5}}> Transactions </Typography>
          <Table
            rows={rows}
            data={this.getTableData(this.state.transactions)}
            orderBy='createdAt'
            orderByDirection='desc'
            mobileView={this.props.mobileView}
            tableHeight='450px'
            viewOnly={true}
          />
        </TransactionWrapper>
        <Confirmation
          open={this.state.deleteConfirmation}
          message={(this.state.client.accountBalance > 0) ? 'Client has active credits. Please recover them before deleting.'
            : 'Are you sure you want to delete this client ?'
          }
          confirmationProceed={this.deleteConfirmationProceed}
          confirmationCancel={this.deleteConfirmationCancel}
          disabled={this.state.client.accountBalance > 0}
        />

        <Dialog
          open={this.state.changeMAC}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <form onSubmit={this.changeMAC}>
            <DialogTitle id="form-dialog-title">
              Changing MAC Address for {this.state.client.login}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" style={{paddingBottom: 20, textAlign: 'center'}}> Current MAC Address: {this.state.client.stb_mac} </Typography>           
              <InputMask mask="**:**:**:**:**:**" 
                value={this.state.newMAC}  
                onChange={(e)=>this.setState({newMAC: e.target.value.toUpperCase()})}
              >
                {(inputProps) => (
                  <TextField 
                    {...inputProps} 
                    autoFocus
                    label="New MAC Address"
                    disabled={this.props.loading}
                    fullWidth
                    error={Boolean(this.state.newMAC) && !this.state.newMAC.match(validMAC)}
                    helperText={this.state.newMAC && !this.state.newMAC.match(validMAC) ? "Invalid MAC Given" : null}
                  />
                )}
              </InputMask>
              <Typography variant="subtitle1" color='secondary' style={{paddingTop: 20, textAlign: 'center'}}> {this.state.checkMACStatus} </Typography>           
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>this.setState({changeMAC: false})} color="secondary">
                Cancel
              </Button>
              <Button variant="contained" type="submit" color="primary" disabled={this.props.loading || !this.state.newMAC || (Boolean(this.state.newMAC) && !this.state.newMAC.match(validMAC))} onClick={this.changeMAC}>
                Submit
              </Button>
            </DialogActions>
          </form>
          <Loading />
        </Dialog>

      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  clients: state.users.clients,
  authCreditsAvailable: state.auth.creditsAvailable,
  authCreditsOnHold: state.auth.creditsOnHold,
  tariffPlans: state.general.tariffPlans,
  authUsername: state.auth.username, 
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  addClient: (client) => dispatch(addClient(client)),
  updateClient: (stb_mac, client) => dispatch(updateClient(stb_mac, client)),
  deleteClient: stb_mac => dispatch(deleteClient(stb_mac)),
  getUsers: () => dispatch(getUsers()),
  getTariffPlans: () => dispatch(getTariffPlans()),
  updateCredits: (transaction, currentAccountBalance) => dispatch(updateCredits(transaction, currentAccountBalance)),
  getSubscriptions: stb_mac => dispatch(getSubscriptions(stb_mac)),
  addSubscription: (stb_mac, subscribedID) => dispatch(addSubscription(stb_mac, subscribedID)),
  removeSubscription: (stb_mac, subscribedID) => dispatch(removeSubscription(stb_mac, subscribedID)),
  sendEvent: event => dispatch(sendEvent(event)),
  checkMAC: mac => dispatch(checkMAC(mac)),
  getUserTransactions: username => dispatch(getUserTransactions(username)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientEdit)