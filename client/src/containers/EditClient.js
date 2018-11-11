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
import { startCase } from 'lodash';
import SendIcon from '@material-ui/icons/Send'


import { getUsers } from 'actions/users'
import { updateClient, deleteClient, getSubscriptions, addSubscription, removeSubscription, sendEvent } from 'actions/clients'
import { updateCredits } from 'actions/transactions'
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

const ClientEdit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  height: 300px;
  overflow-y: scroll;
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
  { field: 'date', numeric: false, label: 'Date' },
  { field: 'from', numeric: false, label: 'From' },
  // { field: 'firstName', numeric: false, label: 'First Name' },
  // { field: 'lastName', numeric: false, label: 'Last Name' },
  { field: 'to', numeric: false, label: 'To' },
  { field: 'credits', numeric: true, label: 'Credits' },
  { field: 'description', numeric: false, label: 'Description' },
  // { field: 'parentID', numeric: false, label: 'Parent Username' },
  // { field: 'childrenCount', numeric: true, label: 'No of Children' },
  // { field: 'creditsOnHold', numeric: true, label: 'Credits on Hold' },
  // { field: 'createdAt', numeric: false, label: 'Created At' },
  // { field: 'updatedAt', numeric: false, label: 'Updated At' }
]


const data = [
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'resellerName',
    to: 'clientName',
    credits: 2,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'resellerName',
    to: 'clientName',
    credits: 1,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'resellerName',
    to: 'clientName',
    credits: 20,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'resellerName',
    to: 'clientName',
    credits: -10,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'resellerName',
    to: 'clientName',
    credits: 5,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'resellerName',
    to: 'clientName',
    credits: 2,
    description: "soething useful here",
  },
]


class EditClient extends Component {

  constructor(props) {
    super(props)
    this.state = {
      editingClient: null,
      deleteConfirmation: false,
      credits: {
        value: 1,
        action: "add"
      },
      subscriptions: [],
      msg: ''
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else {
      this.props.getTariffPlans()
      this.setEditingClient(this.props.match.params.id)
      this.props.getSubscriptions(this.props.match.params.id)
      .then(resoponse => {    
        this.setState({subscriptions: resoponse.payload.data[0].subscribed})
      })
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    let client = this.props.clients.find(client=>client.stb_mac===this.props.match.params.id)
    if (!isEqual(prevState.editingClient, client) && prevState.editingClient && prevState.editingClient.tariff_plan!==client.tariff_plan) {
      if (!this.props.token) this.props.history.push('/login')
      else this.setEditingClient(this.props.match.params.id)
    }
  }

  setEditingClient = (stb_mac) => {
    let client = this.props.clients.find(client=>client.stb_mac===stb_mac)
    this.setState({editingClient: {...client}})
  }

  handleTextChange = (field, value) => {
    this.setState({editingClient: {...this.state.editingClient, [field]: value}})
  }

  updateClient = (event) => {
    event.preventDefault()
    const { stb_mac } = this.state.editingClient
    const { full_name, phone, comment } = this.state.editingClient
    this.props.updateClient(stb_mac, {full_name:full_name, phone, comment})
  }

  checkValidation = () => {
    const loginEmpty = this.state.editingClient.login==="";
    const invalidMAC = this.state.editingClient.stb_mac && !this.state.editingClient.stb_mac.match(validMAC);
    const phoneInvalid = this.state.editingClient.phone && !this.state.editingClient.phone.match(validPhoneNo);
    return loginEmpty || phoneInvalid || invalidMAC
  }

  deleteConfirmationProceed = () => this.setState({deleteConfirmation: false})
  deleteConfirmationCancel = () => this.setState({deleteConfirmation: false})

  deleteClient = (event) => {
    event.preventDefault()
    this.deleteConfirmationProceed = () => {
      this.setState({deleteConfirmation: false}, ()=>{
        this.props.deleteClient(this.state.editingClient.stb_mac)
        .then(clientDeleteResponse => {
          if (clientDeleteResponse.type==='DELETE_CLIENT_SUCCESS') {
            this.props.getUsers()
            .then(()=>this.props.history.push('/clients'))
          }
        })
      })
    }
    this.setState({deleteConfirmation: true})
  }

  updateCredits = () => {
    this.props.updateCredits({
      credits: this.state.credits.action==="add" ? this.state.credits.value : this.state.credits.value*-1,
      description: `${startCase(this.state.credits.action)}ed ${this.state.credits.value} credits`,
      transactionFrom: this.props.authUsername,
      transactionTo: this.state.editingClient.stb_mac
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

  render() {   
    const client = this.props.clients.find(client=>client.stb_mac===this.props.match.params.id)
   
    return (
      <Wrapper>
        <ClientEditWrapper elevation={24}>
          <Typography variant="h4" noWrap>
            Edit Client
          </Typography>
          <br/>
          {this.state.editingClient &&
            <form onSubmit={this.updateClient} style={{padding: 10}}>
              <ClientEdit>
                <TextField
                  label="Username"
                  type="username"
                  value={client && client.login}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Full Name"
                  type="name"
                  value={this.state.editingClient.full_name}
                  onChange={(e)=>this.handleTextChange('full_name', e.target.value)}
                  fullWidth
                  disabled={this.props.loading}
                />
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
              </ClientEdit>
              <br/><br/>
              <Button variant="contained" type="submit" color="primary" disabled={this.props.loading || this.checkValidation() || isEqual(this.state.editingClient, client)}>
                Update&nbsp;
                <SaveIcon />
              </Button>
              <Button variant="contained" type="submit" color="secondary" disabled={this.props.loading} style={{float: 'right'}} onClick={this.deleteClient}>
                Delete&nbsp;
                <DeleteIcon />
              </Button>
            </form>
          }
        </ClientEditWrapper>
        <CreditsWrapper elevation={24}>
            <Typography variant="h4"> Credits </Typography>
            {client && this.props.authUsername===client.parentUsername  &&
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
                <Button variant="contained" type="submit" color="primary" disabled={this.props.loading} style={{float: 'right'}} onClick={()=>this.updateCredits()}>
                  Submit&nbsp;
                  <SaveIcon />
                </Button>
              </div>
            }
            <br/><br/>
            {client && 
            <div style={{textAlign: 'center'}}>
              Credits Available<br/> <div style={{fontSize: 50}}> {client.account_balance} </div>
            </div>
            }
            <br/><br/><br/>
            <Paper style={{padding: 20, textAlign: 'center'}}>
              <TextField
                label="Send Message"
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
                Send&nbsp;
                <SendIcon />
              </Button>
            </Paper>
        </CreditsWrapper>


        <TariffWrapper elevation={24}>
          <Typography variant="h4"> Edit Tariff Plan</Typography>
          <br/><br/>
          {client &&
            <TariffDetails>
              <TariffHeader>
                <Select
                  label="Tarriff Plan"
                  value={client.tariff_plan}
                  onChange={(e)=>this.props.updateClient(client.stb_mac, {tariff_plan: e.target.value})}
                  inputProps={{ id: 'tariff_plan' }}
                >
                  {
                    this.props.tariffPlans.map(plan=>(
                      <MenuItem key={plan.id} value={parseInt(plan.id)}> {plan.name} </MenuItem>
                    ))
                  }
                </Select>
                <Typography variant="body2" style={{alignSelf: 'center', justifySelf: 'center'}}>
                  Tariff Expires on : <strong>{format(Date.parse(client.tariff_expired_date), 'd MMMM YYYY')}</strong>
                </Typography>
              </TariffHeader>
              <TariffPackagesHeader>
                <div>Name</div><div style={{justifySelf: 'center'}}>Optional</div><div style={{justifySelf: 'center'}}>Subscribed</div>
              </TariffPackagesHeader>
              <TariffPackages>
                {
                  this.props.tariffPlans.find(plan=>parseInt(plan.id)===client.tariff_plan) &&
                  this.props.tariffPlans.find(plan=>parseInt(plan.id)===client.tariff_plan).packages.map(tariffPackage=>(
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
          }
        </TariffWrapper>
        <STBDetailsWrapper elevation={24}>
          <Typography variant="h4"> STB Details </Typography>
          <br/><br/>
          {client && 
            <STBDetails>           
              <Typography variant="subtitle2">MAC Address</Typography>
              <Typography variant="body2">{client.stb_mac}</Typography>
              <Typography variant="subtitle2">Receiver Status</Typography>
              <Typography variant="body2">{client.online==="1" ? 'Online' : 'Offline'}</Typography>
              <Typography variant="subtitle2">IP</Typography>
              <Typography variant="body2">{client.ip}</Typography>
              <Typography variant="subtitle2">STB Type</Typography>
              <Typography variant="body2">{client.stb_type}</Typography>
              <Typography variant="subtitle2">STB Serial</Typography>
              <Typography variant="body2">{client.serial_number}</Typography>
              <Typography variant="subtitle2">Last Active</Typography>
              <Typography variant="body2">{format(Date.parse(client.last_active), 'd MMMM YYYY @ HH:mm:ss')}</Typography>
            </STBDetails>
          }
        </STBDetailsWrapper>

        <TransactionWrapper elevation={24}>
          <Typography variant="h4" style={{padding: 20, paddingBottom: 0}}> Transactions </Typography>
          <Table
            rows={rows}
            data={data}
            orderBy='date'
            mobileView={this.props.mobileView}
            tableHeight='100%'
            viewOnly={true}
          />
        </TransactionWrapper>
        <Confirmation
          open={this.state.deleteConfirmation}
          message="Are you sure you want to delete this client ?"
          confirmationProceed={this.deleteConfirmationProceed}
          confirmationCancel={this.deleteConfirmationCancel}
        />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  clients: state.users.clients,
  tariffPlans: state.general.tariffPlans,
  authUsername: state.auth.username, 
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  updateClient: (stb_mac, client) => dispatch(updateClient(stb_mac, client)),
  deleteClient: stb_mac => dispatch(deleteClient(stb_mac)),
  getUsers: () => dispatch(getUsers()),
  getTariffPlans: () => dispatch(getTariffPlans()),
  updateCredits: (transaction) => dispatch(updateCredits(transaction)),
  getSubscriptions: stb_mac => dispatch(getSubscriptions(stb_mac)),
  addSubscription: (stb_mac, subscribedID) => dispatch(addSubscription(stb_mac, subscribedID)),
  removeSubscription: (stb_mac, subscribedID) => dispatch(removeSubscription(stb_mac, subscribedID)),
  sendEvent: event => dispatch(sendEvent(event))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditClient)
