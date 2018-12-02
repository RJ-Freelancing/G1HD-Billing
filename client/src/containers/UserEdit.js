import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash'
import { startCase } from 'lodash'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import InputMask from 'react-input-mask'
import Switch from '@material-ui/core/Switch'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Table from 'components/Table'
import Confirmation from 'components/Confirmation'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loading from 'components/Loading'

import { getUsers, updateUser, deleteUser, upgradeUser, getConfig } from 'actions/users'
import { getUserTransactions, updateCredits } from 'actions/transactions'



const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const UserEditWrapper = styled(Paper)`
  // padding: 20px 20px;
`

const UserProfile = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CreditsWrapper = styled(Paper)`
  // padding: 20px 20px;
`

const TransactionWrapper = styled(Paper)`
  grid-column: 1 / -1;
  @media only screen and (max-width: 768px) {
    grid-column: 1;
  }
`

const rows = [
  { field: 'createdAt', label: 'Date', type: 'date'},
  { field: 'transactionFrom', label: 'From', type: 'string'},
  { field: 'transactionTo', label: 'To', type: 'string'},
  { field: 'credits', label: 'Credits', type: 'integer'},
  { field: 'description', label: 'Description', type: 'string'},
]



class UserEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: null,
      editingUser: null,
      confirmation: false,
      confirmationMessage: "",
      credits: {
        value: props.minimumTransferrableCredits,
        action: "add"
      },
      newPassword: "",
      transactions: [],
      upgradingUser: false,
      upgradingNewUsername: "",
      upgradingNewPassword: "",
      upgradingNewPasswordConfirmation: ""
    }
  }

  componentDidMount = () => {   
    const username = this.props.match.params.id
    const user = this.findInternalUserFromUsername(username)
    if (user) {
      this.props.getUserTransactions(username)
      .then(resnponseTransactions => { 
        this.setState({user, editingUser: {...user}, transactions: resnponseTransactions.payload.data}, ()=>{
          this.props.getConfig()
        })
      })
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const username = this.props.match.params.id
    const user = this.findInternalUserFromUsername(username)
    if (!isEqual(prevState.user, user)) {
      this.setState({user, editingUser: {...user}})
    }
  }

  findInternalUserFromUsername = (username) => {   
    let user
    user = this.props.admins.find(admin=>admin.username===username)
    if (!user)
      user = this.props.superResellers.find(superReseller=>superReseller.username===username)
    if (!user)
      user = this.props.resellers.find(reseller=>reseller.username===username)
    return user
  }

  handleTextChange = (field, value) => {
    this.setState({editingUser: {...this.state.editingUser, [field]: value}})
  }

  checkValidation = () => {
    const usernameEmpty = this.state.editingUser.username===""
    const phoneNoInvalid = this.state.editingUser.phoneNo && !this.state.editingUser.phoneNo.match(validPhoneNo)
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
        .then(() => this.props.history.push(`/${this.state.user.userType}s`))
      })
    }
    this.setState({confirmation: true, confirmationMessage: "Are you sure you want to delete this user ?", newPassword: ""})
  }

  updateCredits = () => {
    this.props.updateCredits({
      credits: this.state.credits.action==="add" ? this.state.credits.value : this.state.credits.value*-1,
      description: `${startCase(this.state.credits.action)}ed ${this.state.credits.value} credits`,
      transactionTo: this.state.user.username
    })
    .then((transactionResponse)=>{
      this.setState({transactions: [transactionResponse.payload.data.transaction, ...this.state.transactions]})
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


  upgradeUser = (e) => {
    e.preventDefault()
    const username = this.state.user.username
    const { upgradingNewUsername, upgradingNewPassword } = this.state
    const upgradingUserType = this.getUpgradingUserType()
    const upgradingUser = {
      username: upgradingNewUsername, 
      userType: upgradingUserType,
      password: upgradingNewPassword
    }
    this.props.upgradeUser(username, upgradingUser)
    .then((upgradeResponse)=>{
      if (upgradeResponse.type==='UPGRADE_USER_SUCCESS')
        this.props.history.push(`/${upgradingUserType}s`)
      else
        this.setState({upgradingUser: false})
    })
  }

  getUpgradingUserType = () => {
    switch (this.state.user.userType) {
      case 'reseller':
        return 'superReseller'
      case 'superReseller':
        return 'admin'
      default:
        return false
    }
  }
  
  render() {    
    if (!this.state.user)
      return (
        <Wrapper>
          <Typography variant="h4" noWrap>
              User with username {this.props.match.params.id} was not found
          </Typography>
        </Wrapper>
      )

    const userIsUpgradable = !this.state.user.upgradedAccount && ['superReseller', 'reseller'].includes(this.state.user.userType)

    return (
      <Wrapper>
        <UserEditWrapper elevation={24}>
          <Typography variant="h4" style={{textAlign: 'left', background: 'linear-gradient(60deg, rgb(102, 187, 106), rgb(67, 160, 71))', padding: 20, color: 'white', fontSize: '25px', letterSpacing: 1}}>
            Edit User:  {this.state.user.username}
          </Typography>
          <br/>
          {this.state.editingUser &&
            <form onSubmit={this.updateUser} style={{padding: 10}}>
              <UserProfile>
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
                <InputMask mask="999-999-9999" 
                  value={this.state.editingUser.phoneNo}  
                  onChange={(e)=>this.handleTextChange('phoneNo', e.target.value)}
                >
                  {(inputProps) => (
                    <TextField 
                      {...inputProps} 
                      label="Phone"
                      fullWidth
                      error={Boolean(this.state.editingUser.phoneNo) && !this.state.editingUser.phoneNo.match(validPhoneNo)}
                      helperText={this.state.editingUser.phoneNo && !this.state.editingUser.phoneNo.match(validPhoneNo) ? "Invalid Phone" : null}
                    />
                  )}
                </InputMask>
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
              </UserProfile>
              <br/><br/>
              <div style={{display: 'grid', gridTemplateColumns: userIsUpgradable ? '1fr 1fr 1fr' : '1fr 1fr', gridGap: 20}}>
                <Button variant="contained" type="submit" color="primary" disabled={(!this.state.newPassword) && (this.props.loading || this.checkValidation() || isEqual(this.state.editingUser, this.state.user))}>
                  Update
                  <SaveIcon style={{marginLeft: 5}} />
                </Button>
                {userIsUpgradable &&
                <Button variant="contained" color="primary" disabled={(this.props.loading)} onClick={()=>this.getUpgradingUserType() && this.setState({upgradingUser: true})}>
                  Upgrade
                  <TrendingUpIcon style={{marginLeft: 5}} />
                </Button>
                }
                <Button variant="contained" type="submit" color="secondary" disabled={this.props.loading} onClick={this.deleteUser}>
                  Delete
                  <DeleteIcon style={{marginLeft: 5}} />
                </Button>
              </div>
            </form>
          }
        </UserEditWrapper>
          <CreditsWrapper elevation={24}>
            <Typography variant="h4" style={{textAlign: 'left', background: 'linear-gradient(60deg, rgb(255, 167, 38), rgb(251, 140, 0))', padding: 20, color: 'white', fontSize: '25px', letterSpacing: 1}}> Credits </Typography>
            <br/><br/>
            {this.state.user && this.props.authUsername===this.state.user.parentUsername  &&
              <div>
                <TextField
                  label="Select Credits"
                  type="number"
                  inputProps={{ min: this.state.credits.action==='recover' ? 1 : this.props.minimumTransferrableCredits }}
                  value={this.state.credits.value}
                  onChange={(e)=>this.setState({credits: {...this.state.credits, value: parseInt(e.target.value)}})}
                  fullWidth
                  disabled={this.props.loading}
                  error={
                    (this.state.credits.action==='add' && (this.state.credits.value < this.props.minimumTransferrableCredits)) || 
                    (this.state.credits.action==='add' && (this.props.authCreditsAvailable < this.state.credits.value)) ||
                    (this.state.credits.action==='recover' && (this.state.user.creditsAvailable-this.state.credits.value < 0))
                  }
                  helperText={
                    (this.state.credits.action==='add' && (this.state.credits.value < this.props.minimumTransferrableCredits)) ? `Minimum Transferrable credits is ${this.props.minimumTransferrableCredits}` 
                    : (this.state.credits.action==='add' && (this.props.authCreditsAvailable < this.state.credits.value)) ? "You don't have enough credits to transfer" 
                    : (this.state.credits.action==='recover' && (this.state.user.creditsAvailable-this.state.credits.value < 0)) ? 'User has not enough credits to recover'
                    : null
                  }
                />
                <br/><br/>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    value={this.state.credits.action}
                    style={{display: 'grid', gridTemplateColumns: '1fr 1fr' , justifyItems: 'center' }}
                    onChange={(e)=>this.setState({credits: {...this.state.credits, action: e.target.value}})}
                  >
                    <FormControlLabel 
                      value="add" 
                      control={<Radio disabled={this.props.loading}/>} 
                      label="Add" 
                    />
                    <FormControlLabel 
                      value="recover" 
                      control={<Radio disabled={this.props.loading}/>} 
                      label="Recover" 
                    />
                  </RadioGroup>
                </FormControl>
                <Button 
                  variant="contained" 
                  type="submit" 
                  color="primary" 
                  disabled={
                    (this.props.loading) || 
                    (this.state.credits.action==='add' && (this.state.credits.value < this.props.minimumTransferrableCredits)) || 
                    (this.state.credits.action==='add' && (this.props.authCreditsAvailable < this.state.credits.value)) ||
                    (this.state.credits.action==='recover' && (this.state.user.creditsAvailable-this.state.credits.value < 0))
                  } 
                  style={{float: 'right'}} 
                  onClick={()=>this.updateCredits()}
                >
                  Submit
                  <SaveIcon style={{marginLeft: 5}}/>
                </Button>
              </div>
           }
            <br/><br/><br/>
            <div style={{textAlign: 'center'}}>
              Credits Available<br/> <div style={{fontSize: 50}}> {this.state.user.creditsAvailable} </div>
              {this.state.user.userType==='reseller' &&
                <>
                <br/><br/>
                Credits Owed<br/> <div style={{fontSize: 50}}> {this.state.user.creditsOwed} </div>
                </>
              }
            </div>
          </CreditsWrapper>
        <TransactionWrapper elevation={24}>
          <Table
            title='Transactions'
            rows={rows}
            data={this.getTableData(this.state.transactions)}
            orderBy='createdAt'
            orderByDirection='desc'
            mobileView={this.props.mobileView}
            tableHeight='100%'
            viewOnly={true}
            backgroundColor='linear-gradient(60deg, #2D3446, #566384)'
            headingColor='white'
          />
        </TransactionWrapper>
        <Confirmation
          open={this.state.confirmation}
          message={
            this.state.newPassword ? this.state.confirmationMessage :
            this.state.user.childUsernames.length > 0 ? 'User has active children. Please remove/move all children before deleting.'
            : (this.state.user.creditsAvailable+this.state.user.creditsOwed > 0) ? 'User has active credits. Please recover them before deleting.'
            : this.state.confirmationMessage
          }
          confirmationProceed={this.confirmationProceed}
          confirmationCancel={this.confirmationCancel}
          disabled={!this.state.newPassword && (this.state.user.childUsernames.length > 0 || (this.state.user.creditsAvailable+this.state.user.creditsOwed > 0))}
        />
        <Dialog
          open={this.state.upgradingUser}
          aria-labelledby="form-dialog-title"
          fullWidth
        >
          <form onSubmit={this.upgradeUser}>
            <DialogTitle id="form-dialog-title">
              Upgrade {this.state.user.username} to {this.getUpgradingUserType()}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                id="upgradingNewUsername"
                label="Upgrading Username"
                type="text"
                required
                value={this.state.upgradingNewUsername}
                onChange={(e)=>this.setState({upgradingNewUsername: e.target.value})}
                fullWidth
                error={this.state.upgradingNewUsername===''}
                helperText={this.state.upgradingNewUsername===''? "Required" : null}
              />
              <TextField
                label="Password"
                type="password"
                required
                value={this.state.upgradingNewPassword}
                onChange={(e)=>this.setState({upgradingNewPassword: e.target.value})}
                fullWidth
                disabled={this.props.loading}
                error={this.state.upgradingNewPassword===""}
                helperText={this.state.upgradingNewPassword && this.state.upgradingNewPassword==="" ? "Required" : null}
              />
              <TextField
                label="Password Confirmation"
                type="password"
                required
                value={this.state.upgradingNewPasswordConfirmation}
                onChange={(e)=>this.setState({upgradingNewPasswordConfirmation: e.target.value})}
                fullWidth
                disabled={this.props.loading}
                error={
                  (this.state.upgradingNewPasswordConfirmation==="") ||
                  (this.state.upgradingNewPasswordConfirmation !== this.state.upgradingNewPassword)
                }
                helperText={
                  this.state.upgradingNewPasswordConfirmation==="" ? "Required" 
                  : (this.state.upgradingNewPasswordConfirmation !== this.state.upgradingNewPassword) ? "Password & Password Confirmation must match"
                  : null
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>this.setState({upgradingUser: false})} color="secondary">
                Cancel
              </Button>
              <Button 
                variant="contained" 
                type="submit" 
                color="primary" 
                disabled={
                  this.props.loading || 
                  this.state.upgradingNewUsername==='' || 
                  (this.state.upgradingNewPassword==="") || 
                  (this.state.upgradingNewPasswordConfirmation !== this.state.upgradingNewPassword)
                } 
                onClick={this.upgradeUser}
              >
                Upgrade
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
  authUserType: state.auth.userType,
  authCreditsAvailable: state.auth.creditsAvailable,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  authUsername: state.auth.username, 
  mobileView: state.general.mobileView,
  minimumTransferrableCredits: state.config.minimumTransferrableCredits,
  loading: state.general.loading
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
  updateUser: (username, user) => dispatch(updateUser(username, user)),
  updateCredits: (transaction) => dispatch(updateCredits(transaction)),
  deleteUser: (username) => dispatch(deleteUser(username)),
  getConfig: () => dispatch(getConfig()),
  getUserTransactions: username => dispatch(getUserTransactions(username)),
  upgradeUser: (username, upgradingUser) => dispatch(upgradeUser(username, upgradingUser))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit)
