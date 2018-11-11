import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsers } from 'actions/users'
import Table from 'components/EventsTable'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Loading from 'components/Loading'


import { sendEvent } from 'actions/clients'

const rows = [
  { field: 'stb_mac', label: 'MAC Address', type: 'string'  },
  { field: 'full_name', label: 'Full Name', type: 'string'  },
  { field: 'phone', label: 'Telephone', type: 'string'  },
  { field: 'accountBalance', label: 'Credits Available', type: 'integer'  },
  { field: 'tariff_expired_date', label: 'Tariff Expiry', type: 'date'  },
  { field: 'comment', label: 'Reseller', type: 'string'  },
  { field: 'now_playing_content', label: 'Box Status', type: 'boolean'  },
]

class Events extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ids: [],
      event: 'send_msg',
      msg: '',
      ttl: 240,
      need_reboot: 0,
      channel: 1,
      open: false
    }
  }  

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

  checkValidation = () => {
    const msgEmpty = this.state.event==='send_msg' && this.state.msg==="";
    const channelEmpty = this.state.event==='play_channel' && (this.state.channel==="" || this.state.channel < 1)
    const ttlInvalid = this.state.ttl < 1
    return msgEmpty || channelEmpty || ttlInvalid
  }

  sendEvent = (e) => {
    e.preventDefault()
    const { ids, event, msg, ttl, ened_reboot, channel } = this.state
    this.props.sendEvent({ids, event, msg, ttl, ened_reboot, channel})
    .then((response => this.setState({open: false})))
  }

  render() {
    return (
      <div>
        <Paper>
          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr'}}>
          <Typography variant="h6" style={{marginLeft: 20}}>Select MAC IDs to send Event</Typography>
          {this.props.authUserType === 'super-admin' && 
            <Button variant="contained" color="primary" disabled={this.props.loading} onClick={()=>this.setState({ids: [], open: true})}>
              Click Here To Send All
            </Button>          
          }
          </div>
        </Paper>
        <Table
          rows={rows}
          data={this.getTableData()}
          orderBy='tariff_expired_date'
          orderByDirection='desc'
          mobileView={this.props.mobileView}
          sendEvent={(ids)=>this.setState({ids, open: true})}
          tableHeight={this.props.mobileView ? '70vh' : '78vh'}
        />
        <Dialog
          open={this.state.open}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <form onSubmit={this.sendEvent}>
            <DialogTitle id="form-dialog-title">
              {this.props.authUserType === 'super-admin' && this.state.ids.length===0 ? 
                'Sending Event to All Mac Addresses'
              :
                `Sending Event to Selected ${this.state.ids.length} MAC Addresses`
              }
            </DialogTitle>
            <DialogContent>
              <div style={{display: 'grid', gridTemplateColumns: ['send_msg', 'play_channel'].includes(this.state.event) ? '1fr 1fr' : '1fr', gridGap: 20}}>
                <FormControl>
                  <InputLabel htmlFor="event">Event Type</InputLabel>
                  <Select
                    label="Event Type"
                    value={this.state.event}
                    onChange={(e)=>this.setState({event: e.target.value})}
                    inputProps={{ id: 'event' }}
                    fullWidth
                  >
                    <MenuItem value='send_msg'> Send Message </MenuItem>
                    <MenuItem value='reboot'> Reboot </MenuItem>
                    <MenuItem value='reload_portal'> Reload Portal </MenuItem>
                    <MenuItem value='update_channels'> Update Channels </MenuItem>
                    <MenuItem value='play_channel'> Play Channel </MenuItem>
                    <MenuItem value='update_image'> Update Image </MenuItem>
                    <MenuItem value='cut_off'> Cut Off </MenuItem>
                  </Select>
                </FormControl>
                {this.state.event==='send_msg' && 
                  <FormControlLabel
                    labelPlacement='start'
                    style={{justifySelf: 'center'}}
                    control={
                      <Checkbox
                        checked={this.state.need_reboot===1 ? true : false}
                        onChange={(e)=>this.setState({need_reboot: e.target.checked ? 1 : 0})}
                      />
                    }
                    label="Need Reboot"
                  />
                }
                {this.state.event==='play_channel' && 
                  <TextField
                    id="channel"
                    label="Channel Number"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={this.state.channel}
                    onChange={(e)=>this.setState({channel: e.target.value})}
                    error={this.state.event==='play_channel' && (this.state.channel==="" || this.state.channel < 1)} 
                    helperText={this.state.event==='play_channel' && (this.state.channel==="" || this.state.channel < 1)  ? "Channel Number Required > 0" : null}
                  />
                }
              </div>
              <br/><br/>
              <TextField
                autoFocus
                id="msg"
                label="Message"
                multiline
                required={this.state.event==='send_msg'}
                rows={5}
                rowsMax="4"
                value={this.state.msg}
                onChange={(e)=>this.setState({msg: e.target.value})}
                fullWidth
                placeholder="Send a message to display in portal"
                error={this.state.event==='send_msg' && this.state.msg===""}
                helperText={this.state.event==='send_msg' && this.state.msg==="" ? "Required" : null}
              />
              <br/><br/>
              <TextField
                id="ttl"
                label="TTL (Time To Live in Seconds)"
                type="number"
                inputProps={{ min: 1 }}
                value={this.state.ttl}
                onChange={(e)=>this.setState({ttl: e.target.value})}
                fullWidth
                error={this.state.ttl < 1}
                helperText={this.state.ttl < 1 ? "TTL must be gretaer than 1" : null}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>this.setState({open: false})} color="secondary">
                Cancel
              </Button>
              <Button variant="contained" type="submit" color="primary" disabled={this.props.loading || this.checkValidation()} onClick={this.sendEvent}>
                Send
              </Button>
            </DialogActions>
          </form>
          <Loading />
        </Dialog>
      </div>
    )
  }
}






const mapStateToProps = state => ({
  token: state.auth.token,
  clients: state.users.clients,
  authUserType: state.auth.userType,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
  sendEvent: event => dispatch(sendEvent(event))

})

export default connect(mapStateToProps, mapDispatchToProps)(Events)
