import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash';
import { format } from 'date-fns'
import InputMask from 'react-input-mask';
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Confirmation from 'components/Confirmation'
import Table from 'components/Table'

import { updateProfile } from 'actions/users'
import { getLoginActivities } from 'actions/auth'




const Wrapper = styled.div`
display: grid;
grid-template-columns: 2fr 1fr;
grid-gap: 20px;
margin: 20px 20px;
@media only screen and (max-width: 768px) {
  grid-template-columns: 1fr;
}
`

const ProfileEditWrapper = styled(Paper)`
// padding: 20px 20px;
`

const ProfileEdit = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
grid-gap: 30px;
@media only screen and (max-width: 768px) {
  grid-template-columns: 1fr;
}
`

const ProfileDetailsWrapper = styled(Paper)`
// padding: 20px 20px;
`

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding: 20px 20px;
`


const ProfileActivityWrapper = styled.div`
// padding: 20px 20px;
  grid-column: 1/-1
`

const rows = [
  { field: 'loginDate', label: 'Login Date', type: 'date' },
  { field: 'loginIp', label: 'Login IP', type: 'string'  },
  { field: 'loginUserAgent', label: 'User Agent', type: 'string'  },
]



const validPhoneNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: {...props.auth},
      newPassword: "",
      confirmation: false,
    }
  }

  componentDidMount = () => {
    this.props.getLoginActivities()
  }


  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!isEqual(prevProps.auth, this.props.auth)) {
      this.setState({auth: {...this.props.auth}})
    }
  }

  handleTextChange = (field, value) => {
    this.setState({auth: {...this.state.auth, [field]: value}})
  }

  updateProfile = (event) => {
    event.preventDefault()
    const {username, email, firstName, lastName, phoneNo} = this.state.auth
    if (this.state.newPassword){
      this.confirmationProceed = () => {
        this.setState({confirmation: false}, ()=>{
          this.props.updateProfile(username, {email, password: this.state.newPassword, firstName, lastName, phoneNo})
        })
      }
      this.setState({confirmation: true})
    } else {
      this.props.updateProfile(username, {email, firstName, lastName, phoneNo})
    }
  }

  checkValidation = () => {
    const usernameEmpty = this.state.auth.username==="";
    const phoneNoInvalid = this.state.auth.phoneNo && !this.state.auth.phoneNo.match(validPhoneNo);
    return usernameEmpty || phoneNoInvalid
  }

  confirmationProceed = () => this.setState({confirmation: false})
  confirmationCancel = () => this.setState({confirmation: false})


  getTableData = () => {    
    let displayData = []
    for (let activity of this.props.loginActivities) {
      let activityData = {}
      for (let row of rows) {
        activityData[row.field] = activity[row.field]
      }
      displayData.push({...activityData})

    }
    return displayData
  } 


  render() {
    return (
      <Wrapper>
        <ProfileEditWrapper elevation={24}>
          <Typography variant="overline" style={{background: 'rgb(72, 117, 180)', padding: 20, color: 'white', fontSize: '25px', letterSpacing: 1}} noWrap>
              Edit Profile
          </Typography>
          <br/>
          <form onSubmit={this.updateProfile} style={{padding: 10}}>
            <ProfileEdit>
              <TextField
                label="Email"
                type="email"
                value={this.state.auth.email}
                onChange={(e)=>this.handleTextChange('email', e.target.value)}
                fullWidth
                disabled={this.props.loading}
              />
              <InputMask mask="999-999-9999" 
                value={this.state.auth.phoneNo}  
                onChange={(e)=>this.handleTextChange('phoneNo', e.target.value)}
              >
                {(inputProps) => (
                  <TextField 
                    {...inputProps} 
                    label="Phone"
                    fullWidth
                    disabled={this.props.loading}
                    error={Boolean(this.state.auth.phoneNo) && !this.state.auth.phoneNo.match(validPhoneNo)}
                    helperText={this.state.auth.phoneNo && !this.state.auth.phoneNo.match(validPhoneNo) ? "Invalid Phone" : null}
                  />
                )}
              </InputMask>
              <TextField
                label="First Name"
                value={this.state.auth.firstName}
                onChange={(e)=>this.handleTextChange('firstName', e.target.value)}
                fullWidth
                disabled={this.props.loading}
              />
              <TextField
                label="Last Name"
                value={this.state.auth.lastName}
                onChange={(e)=>this.handleTextChange('lastName', e.target.value)}
                fullWidth
                disabled={this.props.loading}
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
            </ProfileEdit>
            <br/><br/>
            <Button 
              variant="contained" 
              type="submit" 
              color="primary" 
              disabled={(!this.state.newPassword) && (this.props.loading || this.checkValidation() || isEqual(this.props.auth, this.state.auth))}
            >
              Update
              <SaveIcon style={{marginLeft: 5}}/>
            </Button>
          </form>
        </ProfileEditWrapper>
        
        <ProfileDetailsWrapper elevation={24}>
          <Typography variant="overline" style={{background: 'linear-gradient(60deg, rgb(102, 187, 106), rgb(67, 160, 71))', padding: 20, color: 'white', fontSize: '25px', letterSpacing: 1}}> Account Details </Typography>
          <br/><br/>
          <ProfileDetails>
            <Typography variant="overline" style={{fontSize: '12px'}}>Account Type</Typography>
            <Typography variant="overline" style={{fontSize: '12px'}}>{this.state.auth.userType}</Typography>
            <Typography variant="overline" style={{fontSize: '12px'}}>Credits Available</Typography>
            <Typography variant="overline" style={{fontSize: '12px'}}>{this.state.auth.creditsAvailable}</Typography>
            {this.props.auth.userType==='reseller' && 
              <>
                <Typography variant="overline" style={{fontSize: '12px'}}>Credits on Hold</Typography>
                <Typography variant="overline" style={{fontSize: '12px'}}>{this.state.auth.creditsOwed}</Typography>
              </>
            }
            <Typography variant="overline" style={{fontSize: '12px'}}>Date Joined</Typography>
            <Typography variant="overline" style={{fontSize: '12px'}}>{format(Date.parse(this.state.auth.createdAt), 'D MMM YYYY @ HH:mm:ss')}</Typography>
            <Typography variant="overline" style={{fontSize: '12px'}}>Last Updated</Typography>
            <Typography variant="overline" style={{fontSize: '12px'}}>{format(Date.parse(this.state.auth.updatedAt), 'D MMM YYYY @ HH:mm:ss')}</Typography>
          </ProfileDetails>
        </ProfileDetailsWrapper>

        <ProfileActivityWrapper>
          <Typography variant="overline" style={{background: 'linear-gradient(60deg, rgb(255, 167, 38), rgb(251, 140, 0))', padding: 20, color: 'white', fontSize: '25px', letterSpacing: 1}}> Account Activity </Typography>
          <br/>
          <Table
            rows={rows}
            data={this.getTableData()}
            orderBy='loginDate'
            orderByDirection='asc'
            mobileView={this.props.mobileView}
            viewOnly={true}
          />

        </ProfileActivityWrapper>

      <Confirmation
        open={this.state.confirmation}
        message="You are changing your password. Are you sure you want to continue ?"
        confirmationProceed={this.confirmationProceed}
        confirmationCancel={this.confirmationCancel}
        disabled={!this.state.newPassword}
      />
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  loginActivities: state.auth.loginActivities
})

const mapDispatchToProps = dispatch => ({
  updateProfile: (username, user) => dispatch(updateProfile(username, user)),
  getLoginActivities: () => dispatch(getLoginActivities())
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
