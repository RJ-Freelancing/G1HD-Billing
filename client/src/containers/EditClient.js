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
import InputMask from 'react-input-mask';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getUsers } from 'actions/users'
import { updateClient } from 'actions/clients'


const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
const validMAC = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-gap: 20px;
  margin: 20px 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ClientEditWrapper = styled(Paper)`
  padding: 20px 20px;
`

const ClientEdit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ClientDetailsWrapper = styled(Paper)`
  padding: 20px 20px;
`

const ClientDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding: 20px 20px;
`



class EditClient extends Component {

  constructor(props) {
    super(props)
    this.state = {
      client: null,
      editingClient: null
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.loadClientFromMac(this.props.match.params.id)
  }

  loadClientFromMac = (stb_mac) => {
    let client = {};
    client = this.props.clients.find(client=>client.stb_mac===stb_mac)
    this.setState({client, editingClient:{...client}})
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!isEqual(prevState.client, this.state.client)) {
      if (!this.props.token) this.props.history.push('/login')
      else this.loadClientFromMac(this.props.match.params.id)
    }
  }

  handleTextChange = (field, value) => {
    this.setState({editingClient: {...this.state.editingClient, [field]: value}})
  }

  updateClient = (event) => {
    event.preventDefault()
    const { stb_mac } = this.state.editingClient
    const { full_name, phone, status, tarriff_plan, tarriff_expired_date, subscribed, subscribed_id } = this.state.editingClient
    this.props.updateClient(stb_mac, {full_name, phone, status, tarriff_plan, tarriff_expired_date, subscribed, subscribed_id})
  }

  checkValidation = () => {
    const loginEmpty = this.state.editingClient.login==="";
    const invalidMAC = this.state.editingClient.stb_mac && !this.state.editingClient.stb_mac.match(validMAC);
    const phoneInvalid = this.state.editingClient.phone && !this.state.editingClient.phone.match(validPhoneNo);
    return loginEmpty || phoneInvalid || invalidMAC
  }

  render() {   
    
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
                  label="Login"
                  type="username"
                  value={this.state.editingClient.login}
                  onChange={(e)=>this.handleTextChange('login', e.target.value)}
                  fullWidth
                  required
                  error={this.state.editingClient.login===""}
                  helperText={this.state.editingClient.login==="" ? "Required" : null}
                  disabled={this.props.loading}
                />
                <TextField
                  label="Full Name"
                  type="name"
                  value={this.state.editingClient.full_name}
                  onChange={(e)=>this.handleTextChange('full_name', e.target.value)}
                  fullWidth
                  disabled={this.props.loading}
                />
                <InputMask mask="**:**:**:**:**:**" 
                  value={this.state.editingClient.stb_mac}  
                  onChange={(e)=>this.handleTextChange('stb_mac', e.target.value.toUpperCase())}
                >
                  {(inputProps) => (
                    <TextField 
                      {...inputProps} 
                      label="MAC"
                      fullWidth
                      disabled={this.props.loading}
                      error={Boolean(this.state.editingClient.stb_mac) && !this.state.editingClient.stb_mac.match(validMAC)}
                      helperText={this.state.editingClient.stb_mac && !this.state.editingClient.stb_mac.match(validMAC) ? "Invalid MAC Given" : null}
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
                <Select
                  label="Tarriff Plan"
                  value={this.state.editingClient.tariff_plan}
                  onChange={(e)=>this.handleTextChange('tariff_plan', e.target.value)}
                >
                  <MenuItem value={"1"}>Plan One</MenuItem>
                  <MenuItem value={"2"}>Plan Two</MenuItem>
                  <MenuItem value={"3"}>Plan Three</MenuItem>
                </Select>
              </ClientEdit>
              <br/><br/>
              <Button variant="contained" type="submit" color="primary" disabled={this.props.loading || this.checkValidation() || isEqual(this.state.editingClient, this.state.client)}>
                Update&nbsp;
                <SaveIcon />
              </Button>
            </form>
          }
        </ClientEditWrapper>
        <ClientDetailsWrapper elevation={24}>
          <Typography variant="h4"> STB Details </Typography>
          <br/><br/>
          {this.state.client && 
            <ClientDetails>           
              <Typography variant="subtitle2">Receiver Status</Typography>
              <Typography variant="body2">{this.state.client.online==="1" ? 'Online' : 'Offline'}</Typography>
              <Typography variant="subtitle2">IP</Typography>
              <Typography variant="body2">{this.state.client.ip}</Typography>
              <Typography variant="subtitle2">STB Type</Typography>
              <Typography variant="body2">{this.state.client.stb_type}</Typography>
              <Typography variant="subtitle2">STB Serial</Typography>
              <Typography variant="body2">{this.state.client.stb_sn}</Typography>
              <Typography variant="subtitle2">Tarriff Plan</Typography>
              <Typography variant="body2">{this.state.client.tariff_plan}</Typography>
              <Typography variant="subtitle2">Tarriff Expiry</Typography>
              <Typography variant="body2">{format(Date.parse(this.state.client.tariff_expired_date), 'd MMMM YYYY')}</Typography>
              <Typography variant="subtitle2">Last Active</Typography>
              <Typography variant="body2">{format(Date.parse(this.state.client.last_active), 'd MMMM YYYY @ HH:mm:ss')}</Typography>
            </ClientDetails>
          }
        </ClientDetailsWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  clients: state.users.clients,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  updateClient: (mac, client) => dispatch(updateClient(mac, client)),
  getUsers: () => dispatch(getUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditClient)
