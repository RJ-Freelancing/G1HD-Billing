import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Confirmation from 'components/common/Confirmation'
import { format } from 'date-fns'

import { updateUser, deleteUser } from 'actions/auth'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteConfirmation: false,
      ...props.auth
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!isEqual(prevProps.auth, this.props.auth)) {
      this.setState({...this.props.auth})
    }
  }

  deleteConfirmationProceed = () => this.setState({deleteConfirmation: false})
  deleteConfirmationCancel = () => this.setState({deleteConfirmation: false})

  deleteMessage = (messageID) => {
    this.deleteConfirmationProceed = () => {
      this.setState({deleteConfirmation: false}, ()=>{
        this.props.deleteMessage(messageID)
      })
    }
    this.setState({deleteConfirmation: true})
  }

  handleTextChange = (field, value) => {
    this.setState({[field]: value})
  }

  updateUser = () => {
    this.props.updateUser(this.state._id, {...this.state})
  }

  deleteUser = () => {
    this.deleteConfirmationProceed = () => {
      this.setState({deleteConfirmation: false}, ()=>{
        this.props.deleteUser(this.state._id)
      })
    }
    this.setState({deleteConfirmation: true})
  }

  render() {
    return (
      <div>
        <Typography variant="display1" noWrap>
            My Account
        </Typography>
        <br/>
        <TextField
          label="Username"
          type="username"
          value={this.state.username}
          onChange={()=>this.handleTextChange('username')}
        />
        <br/>
        <TextField
          label="Email"
          type="email"
          value={this.state.email}
          onChange={()=>this.handleTextChange('email')}
        />
        <br/>
        <TextField
          label="First Name"
          value={this.state.firstName}
          onChange={()=>this.handleTextChange('firstName')}
        />
        <br/>
        <TextField
          label="Last Name"
          value={this.state.lastName}
          onChange={()=>this.handleTextChange('lastName')}
        />
        <br/>
        <TextField
          label="Telephone"
          value={this.state.phoneNo}
          onChange={()=>this.handleTextChange('phoneNo')}
        />
        <br/>
        <TextField
          label="Account Type"
          value={this.state.userType}
          disabled
        />
        <br/>
        <TextField
          label="Date Joined"
          value={format(Date.parse(this.state.createdAt), 'd MMMM YYYY')}
          onChange={()=>this.handleTextChange('createdAt')}
        />
        <br/>
        <TextField
          label="Last Updated"
          value={format(Date.parse(this.state.updatedAt), 'd MMMM YYYY')}
          disabled
        />
        <br/>
        <IconButton color="secondary" aria-label="delete" onClick={()=>this.deleteMessage()}><DeleteIcon /></IconButton>
        <Confirmation
          open={this.state.deleteConfirmation}
          confirmationDelete={this.deleteConfirmationProceed}
          confirmationCancel={this.deleteConfirmationCancel}
          message="Are you sure you want to delete your account?"
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.general.loading,
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  updateUser: (userID, user) => dispatch(updateUser(userID, user)),
  deleteUser: userID => dispatch(deleteUser(userID))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
