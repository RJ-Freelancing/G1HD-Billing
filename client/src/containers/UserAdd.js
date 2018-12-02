import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import InputMask from 'react-input-mask'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'


import { getUsers, addUser } from 'actions/users'
import { updateCredits } from 'actions/transactions'


const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

const Wrapper = styled.div`
  display: grid
  grid-template-columns: 1fr
  grid-gap: 20px
  margin: 20px 20px
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr
  }
`

const ClientEditWrapper = styled(Paper)`
  padding: 20px 20px
`

const ClientEdit = styled.div`
  display: grid
  grid-template-columns: 1fr 1fr
  grid-gap: 20px
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr
  }
`


class UserAdd extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newUser: {
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNo: "",
        accountStatus: true,
        credits: this.props.minimumTransferrableCredits
      },
      passwordConfirmation: ""
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!this.props.token) this.props.history.push('/login')
  }

  handleTextChange = (field, value) => {
    this.setState({newUser: {...this.state.newUser, [field]: value}})
  }

  addUser = (event) => {
    event.preventDefault()
    const { username, email, password, firstName, lastName, phoneNo, accountStatus } = this.state.newUser
    this.props.addUser({username, email, password, firstName, lastName, phoneNo, accountStatus, userType: this.getAddingUserType()})
    .then(clientAddResponse => {
      if (clientAddResponse.type==='ADD_USER_SUCCESS') {
        if (this.state.newUser.credits > 0) {
          this.props.updateCredits({
            credits: this.state.newUser.credits,
            description: "Add initial credits for new user",
            transactionTo: this.state.newUser.username
          })
          .then(creditAddResponse => {
            if (creditAddResponse.type==='UPDATE_CREDIT_SUCCESS') {
              this.props.history.push(`/users/${this.state.newUser.username}`)
            }
          })
        }
        else {
          this.props.history.push(`/users/${this.state.newUser.username}`)
        }
      }
    })
  }

  checkValidation = () => {
    const usernameEmpty = this.state.newUser.username===""
    const passwordEmpty = this.state.newUser.password===""
    const passwordConfirmationNonMatch = this.state.passwordConfirmation !== this.state.newUser.password
    const firstNameEmpty = this.state.newUser.firstName===""
    const lastNameEmpty = this.state.newUser.lastName===""
    const phoneNoInvalid = this.state.newUser.phoneNo==="" || !this.state.newUser.phoneNo.match(validPhoneNo)
    return usernameEmpty || passwordEmpty || passwordConfirmationNonMatch || firstNameEmpty || lastNameEmpty || phoneNoInvalid
  }

  getAddingUserType = () => {
    switch (this.props.authUserType) {
      case 'superAdmin':
        return 'admin'
      case 'admin':
        return 'superReseller'
      case 'superReseller':
        return 'reseller'
      default:
        return ''
    }
  }


  render() {   
    
    return (
      <Wrapper>
        <ClientEditWrapper elevation={24}>
          <Typography variant="h4" noWrap>
            Create a new {this.getAddingUserType()}
          </Typography>
          <br/>
          <form onSubmit={this.addUser} style={{padding: 10}}>
            <ClientEdit>
              <TextField
                label="Username"
                type="username"
                required
                value={this.state.newUser.username}
                onChange={(e)=>this.handleTextChange('username', e.target.value.toLowerCase().trim())}
                fullWidth
                disabled={this.props.loading}
                autoFocus
                error={this.state.newUser.username===""}
                helperText={this.state.newUser.username==="" ? "Required" : null}
              />
              <TextField
                label="Email"
                type="email"
                value={this.state.newUser.email}
                onChange={(e)=>this.handleTextChange('email', e.target.value)}
                fullWidth
                disabled={this.props.loading}
              />
              <TextField
                label="Password"
                type="password"
                required
                value={this.state.newUser.password}
                onChange={(e)=>this.handleTextChange('password', e.target.value)}
                fullWidth
                disabled={this.props.loading}
                error={Boolean(this.state.newUser.password) && this.state.newUser.password===""}
                helperText={this.state.newUser.password && this.state.newUser.password==="" ? "Required" : null}
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
                  (this.state.passwordConfirmation !== this.state.newUser.password)
                }
                helperText={
                  this.state.passwordConfirmation && this.state.passwordConfirmation==="" ? "Required" 
                  : (this.state.passwordConfirmation !== this.state.newUser.password) ? "Password & Password Confirmation must match"
                  : null
                }
              />
              <TextField
                label="First Name"
                type="firstName"
                required
                value={this.state.newUser.firstName}
                onChange={(e)=>this.handleTextChange('firstName', e.target.value)}
                fullWidth
                disabled={this.props.loading}
                error={Boolean(this.state.newUser.firstName) && this.state.newUser.firstName===""}
                helperText={this.state.newUser.firstName && this.state.newUser.firstName==="" ? "Required" : null}
              />
              <TextField
                label="Last Name"
                type="lastName"
                required
                value={this.state.newUser.lastName}
                onChange={(e)=>this.handleTextChange('lastName', e.target.value)}
                fullWidth
                disabled={this.props.loading}
                error={Boolean(this.state.newUser.lastName) && this.state.newUser.lastName===""}
                helperText={this.state.newUser.lastName && this.state.newUser.lastName==="" ? "Required" : null}
              />
              <InputMask mask="999-999-9999" 
                value={this.state.newUser.phoneNo}  
                onChange={(e)=>this.handleTextChange('phoneNo', e.target.value)}
              >
                {(inputProps) => (
                  <TextField 
                    {...inputProps} 
                    label="Phone"
                    fullWidth
                    required
                    disabled={this.props.loading}
                    error={Boolean(this.state.newUser.phoneNo) && !this.state.newUser.phoneNo.match(validPhoneNo)}
                    helperText={this.state.newUser.phoneNo && !this.state.newUser.phoneNo.match(validPhoneNo) ? "Invalid Phone" : null}
                  />
                )}
              </InputMask>
              <TextField 
                  label="Add Credits"
                  value={this.state.newUser.credits}
                  onChange={(e)=>this.handleTextChange('credits', e.target.value)}
                  type="number"
                  fullWidth
                  inputProps={{ min: this.props.minimumTransferrableCredits }}
                  disabled={this.props.loading}
                  error={
                    (this.state.newUser.credits < this.props.minimumTransferrableCredits) || 
                    (this.props.authCreditsAvailable < this.state.newUser.credits)
                  }
                  helperText={
                    (this.state.newUser.credits < this.props.minimumTransferrableCredits) ? `Minimum Transferrable credits is ${this.props.minimumTransferrableCredits}` 
                    : (this.props.authCreditsAvailable < this.state.newUser.credits) ? "You don't have enough credits to transfer" 
                    : null
                  }
                />
              <FormControlLabel
                label={`Account Status (${this.state.newUser.accountStatus ? 'Active' : 'Inactive'})`}
                control={
                  <Switch
                    checked={this.state.newUser.accountStatus}
                    onChange={(e)=>this.handleTextChange('accountStatus', e.target.checked)}
                    value={this.state.newUser.accountStatus}
                    color="primary"
                    disabled={this.props.loading}
                  />
                }
              />
            </ClientEdit>
            <br/><br/>
            <Button variant="contained" type="submit" color="primary" disabled={this.props.loading || this.checkValidation() || (this.state.newUser.credits < this.props.minimumTransferrableCredits) || (this.props.authCreditsAvailable < this.state.newUser.credits)}>
              Submit
              <SaveIcon />
            </Button>
            <Button variant="contained" color="secondary" onClick={()=>this.props.history.push('/')} style={{float: 'right'}}>
              Cancel
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
  authUserType: state.auth.userType,
  authCreditsAvailable: state.auth.creditsAvailable,
  minimumTransferrableCredits: state.config.minimumTransferrableCredits,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  addUser: (client) => dispatch(addUser(client)),
  getUsers: () => dispatch(getUsers()),
  updateCredits: (transaction) => dispatch(updateCredits(transaction))

})

export default connect(mapStateToProps, mapDispatchToProps)(UserAdd)
