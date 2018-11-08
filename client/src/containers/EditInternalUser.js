import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash';
import { startCase } from 'lodash';
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import InputMask from 'react-input-mask';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Table from 'components/Table'
import Confirmation from 'components/Confirmation';

import { getUsers, updateUser, deleteUser } from 'actions/users'
import { updateCredits } from 'actions/transactions'

const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 20px;
  margin: 20px 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const UserEditWrapper = styled(Paper)`
  padding: 20px 20px;
`

const UserEdit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CreditsWrapper = styled(Paper)`
  padding: 20px 20px;
`

const TransactionWrapper = styled(Paper)`
  padding: 20px 20px;
  @media only screen and (max-width: 768px) {
    grid-column: 1;
  }
  grid-column: 1 / -1;
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
    from: 'someusername',
    to: 'username',
    credits: 2,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'someusername',
    to: 'username',
    credits: 1,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'someusername',
    to: 'username',
    credits: 20,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'someusername',
    to: 'username',
    credits: -10,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'someusername',
    to: 'username',
    credits: 5,
    description: "soething useful here",
  },
  {
    date: '2018-10-24T06:27:57.000Z',
    from: 'someusername',
    to: 'username',
    credits: 2,
    description: "soething useful here",
  },
]


class EditInternalUser extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null,
      editingUser: null,
      confirmation: false,
      confirmationMessage: "",
      credits: {
        value: 1,
        action: "add"
      },
      newPassword: ""
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.loadInternalUserFromUsername(this.props.match.params.id)
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!isEqual(prevState.user, this.state.user)) {
      if (!this.props.token) this.props.history.push('/login')
      else this.loadInternalUserFromUsername(this.props.match.params.id)
    }
  }

  loadInternalUserFromUsername = (username) => {
    let user;
    user = this.props.admins.find(admin=>admin.username===username)
    if (!user)
      user = this.props.superResellers.find(admin=>admin.username===username)
    if (!user)
      user = this.props.resellers.find(admin=>admin.username===username)
    this.setState({user, editingUser: {...user}})
  }

  handleTextChange = (field, value) => {
    this.setState({editingUser: {...this.state.editingUser, [field]: value}})
  }

  checkValidation = () => {
    const usernameEmpty = this.state.editingUser.username==="";
    const phoneNoInvalid = this.state.editingUser.phoneNo && !this.state.editingUser.phoneNo.match(validPhoneNo);
    return usernameEmpty || phoneNoInvalid
  }

  confirmationProceed = () => this.setState({confirmation: false})
  confirmationCancel = () => this.setState({confirmation: false})

  updateUser = (event) => {
    event.preventDefault()
    const { username } = this.state.editingUser
    const { email, firstName, lastName, phoneNo, accountStatus } = this.state.editingUser
    if (this.state.newPassword){
      this.confirmationProceed = () => {
        this.setState({confirmation: false}, ()=>{
          this.props.updateUser(username, {email, password: this.state.newPassword, firstName, lastName, phoneNo, accountStatus})
        })
      }
      this.setState({confirmation: true, confirmationMessage: "You are changing the user's password. Are you sure you want to continue ?"})
    } else {
      this.props.updateUser(username, {email, firstName, lastName, phoneNo, accountStatus})
    }
  }

  deleteUser = (event) => {
    event.preventDefault()
    this.confirmationProceed = () => {
      this.setState({confirmation: false}, ()=>{
        this.props.deleteUser(this.state.user.username)
        .then(userDeleteResponse => {
          if (userDeleteResponse.type==='DELETE_USER_SUCCESS') {
            this.props.getUsers()
            .then(()=>this.props.history.push(`/${this.state.user.userType}s`))
          }
        })
      })
    }
    this.setState({confirmation: true, confirmationMessage: "Are you sure you want to delete this user ?"})
  }

  updateCredits = () => {
    this.props.updateCredits({
      credits: this.state.credits.action==="add" ? this.state.credits.value : this.state.credits.value*-1,
      description: `${startCase(this.state.credits.action)}ed ${this.state.credits.value} credits`,
      transactionFrom: this.props.authUsername,
      transactionTo: this.state.user.username
    })
  }

  
  render() {   
    
    return (
      <Wrapper>
        <UserEditWrapper elevation={24}>
          <Typography variant="h4" noWrap>
            Edit User
          </Typography>
          <br/>
          {this.state.editingUser &&
            <form onSubmit={this.updateUser} style={{padding: 10}}>
              <UserEdit>
                <TextField
                  label="Username"
                  type="username"
                  value={this.state.editingUser.username}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={this.state.editingUser.email}
                  onChange={(e)=>this.handleTextChange('email', e.target.value)}
                  fullWidth
                  disabled={this.props.loading}
                  error={Boolean(this.state.editingUser.email) && this.state.editingUser.email===""}
                  helperText={this.state.editingUser.email && this.state.editingUser.email==="" ? "Required" : null}
                />
                <TextField
                  label="First Name"
                  type="firstName"
                  required
                  value={this.state.editingUser.firstName}
                  onChange={(e)=>this.handleTextChange('firstName', e.target.value)}
                  fullWidth
                  disabled={this.props.loading}
                  error={Boolean(this.state.editingUser.firstName) && this.state.editingUser.firstName===""}
                  helperText={this.state.editingUser.firstName && this.state.editingUser.firstName==="" ? "Required" : null}
                />
                <TextField
                  label="Last Name"
                  type="lastName"
                  required
                  value={this.state.editingUser.lastName}
                  onChange={(e)=>this.handleTextChange('lastName', e.target.value)}
                  fullWidth
                  disabled={this.props.loading}
                  error={Boolean(this.state.editingUser.lastName) && this.state.editingUser.lastName===""}
                  helperText={this.state.editingUser.lastName && this.state.editingUser.lastName==="" ? "Required" : null}
                />
                <TextField
                  label="Change Password"
                  type="password"
                  placeholder="Leave empty to keep the current password unchanged"
                  value={this.state.newPassword}
                  onChange={(e)=>this.setState({newPassword: e.target.value})}
                  fullWidth
                  disabled={this.props.loading}
                />
                <InputMask mask="999-999-9999" 
                  value={this.state.editingUser.phoneNo}  
                  onChange={(e)=>this.handleTextChange('phoneNo', e.target.value)}
                >
                  {(inputProps) => (
                    <TextField 
                      {...inputProps} 
                      label="Phone"
                      fullWidth
                      disabled={this.props.loading}
                      error={Boolean(this.state.editingUser.phoneNo) && !this.state.editingUser.phoneNo.match(validPhoneNo)}
                      helperText={this.state.editingUser.phoneNo && !this.state.editingUser.phoneNo.match(validPhoneNo) ? "Invalid Phone" : null}
                    />
                  )}
                </InputMask>
                <FormControlLabel
                  label={`Account Status (${this.state.editingUser.accountStatus ? 'Active' : 'Inactive'})`}
                  control={
                    <Switch
                      checked={this.state.editingUser.accountStatus}
                      onChange={(e)=>this.handleTextChange('accountStatus', e.target.checked)}
                      value={this.state.editingUser.accountStatus}
                      color="primary"
                      disabled={this.props.loading}
                    />
                  }
                />
              </UserEdit>
              <br/><br/>
              <Button variant="contained" type="submit" color="primary" disabled={(!this.state.newPassword) && (this.props.loading || this.checkValidation() || isEqual(this.state.editingUser, this.state.user))}>
                Update&nbsp;
                <SaveIcon />
              </Button>
              <Button variant="contained" type="submit" color="secondary" disabled={this.props.loading} style={{float: 'right'}} onClick={this.deleteUser}>
                Delete&nbsp;
                <DeleteIcon />
              </Button>
            </form>
          }
        </UserEditWrapper>
        <CreditsWrapper elevation={24}>
          <Typography variant="h4"> Credits </Typography>
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
          <br/><br/><br/>
          <div style={{textAlign: 'center'}}>
            {/* Credits Available<br/> <div style={{fontSize: 100}}>{this.state.user && this.state.user.account_balance} </div> */}
            Credits Available<br/> <div style={{fontSize: 50}}> 5 </div>
          </div>
        </CreditsWrapper>
        <TransactionWrapper elevation={24}>
          <Typography variant="h4"> Transactions </Typography>
          {/* <br/><br/> */}
          <Table
            // title={'Transactions'}
            rows={rows}
            data={data}
            orderBy='date'
            mobileView={this.props.mobileView}
            tableHeight='100%'
            viewOnly={true}
          />
        </TransactionWrapper>
        <Confirmation
          open={this.state.confirmation }
          message={this.state.confirmationMessage}
          confirmationProceed={this.confirmationProceed}
          confirmationCancel={this.confirmationCancel}
        />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  authUsername: state.auth.username, 
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
  updateUser: (user) => dispatch(updateUser(user)),
  updateCredits: (transaction) => dispatch(updateCredits(transaction)),
  deleteUser: (username) => dispatch(deleteUser(username))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditInternalUser)
