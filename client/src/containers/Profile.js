import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash';
import { format } from 'date-fns'
import NumberFormat from 'react-number-format';
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import { updateUser } from 'actions/auth'


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
  padding: 20px 20px;
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
  padding: 20px 20px;
`

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding: 20px 20px;
`



class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props.auth
    }
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (!isEqual(prevProps.auth, this.props.auth)) {
      this.setState({...this.props.auth})
    }
  }

  handleTextChange = (field, value) => {
    this.setState({[field]: value})
  }

  updateUser = (event) => {
    event.preventDefault()
    const {username, email, firstName, lastName, phoneNo} = this.state
    this.props.updateUser(this.props.auth._id, {username, email, firstName, lastName, phoneNo})
  }

  checkValidation = () => {
    const usernameEmpty = this.state.username==="";
    return usernameEmpty
  }

  render() {
    return (
      <Wrapper>
        <ProfileEditWrapper elevation={24}>
          <Typography variant="display1" noWrap>
              Edit Profile
          </Typography>
          <br/>
          <form onSubmit={this.updateUser} style={{padding: 10}}>
            <ProfileEdit>
              <TextField
                label="Username"
                type="username"
                value={this.state.username}
                onChange={(e)=>this.handleTextChange('username', e.target.value)}
                fullWidth
                required
                error={this.state.username===""}
                helperText={this.state.username==="" ? "Required" : null}
                disabled={this.props.loading}
              />
              <TextField
                label="Email"
                type="email"
                value={this.state.email}
                onChange={(e)=>this.handleTextChange('email', e.target.value)}
                fullWidth
                disabled={this.props.loading}
              />
              <TextField
                label="First Name"
                value={this.state.firstName}
                onChange={(e)=>this.handleTextChange('firstName', e.target.value)}
                fullWidth
                disabled={this.props.loading}
              />
              <TextField
                label="Last Name"
                value={this.state.lastName}
                onChange={(e)=>this.handleTextChange('lastName', e.target.value)}
                fullWidth
                disabled={this.props.loading}
              />
              <NumberFormat 
                customInput={TextField} 
                label="Telephone"
                format="+1 (###) ###-####"
                mask="_"
                onValueChange={(values) => this.handleTextChange('phoneNo', values.formattedValue)}
                value={this.state.phoneNo}
                fullWidth
                disabled={this.props.loading}
              />
            </ProfileEdit>
            <br/><br/>
            <Button variant="contained" type="submit" color="primary" disabled={this.props.loading || this.checkValidation() || isEqual(this.props.auth, this.state)}>
              Update&nbsp;
              <SaveIcon />
            </Button>
          </form>
        </ProfileEditWrapper>
        
        <ProfileDetailsWrapper elevation={24}>
          <Typography variant="display1"> Account Details </Typography>
          <br/><br/>
          <ProfileDetails>
            <Typography variant="subtitle2">Account Type</Typography>
            <Typography variant="body2">{this.state.userType}</Typography>
            <Typography variant="subtitle2">Credits Available</Typography>
            <Typography variant="body2">{this.state.creditsAvailable}</Typography>
            <Typography variant="subtitle2">Credits on Hold</Typography>
            <Typography variant="body2">{this.state.creditsOnHold}</Typography>
            <Typography variant="subtitle2">Date Joined</Typography>
            <Typography variant="body2">{format(Date.parse(this.state.createdAt), 'd MMMM YYYY @ HH:mm:ss')}</Typography>
            <Typography variant="subtitle2">Last Updated</Typography>
            <Typography variant="body2">{format(Date.parse(this.state.updatedAt), 'd MMMM YYYY @ HH:mm:ss')}</Typography>
          </ProfileDetails>
        </ProfileDetailsWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.general.loading,
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  updateUser: (userID, user) => dispatch(updateUser(userID, user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
