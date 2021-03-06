import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Offline } from "react-detect-offline";
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Logo from 'assets/logo.png'
import Notification from 'components/Notification'
import Loading from 'components/Loading'
import Paper from '@material-ui/core/Paper';
import PopupMessage from 'components/PopupMessage'
import NoInternetGIF from 'assets/noInternet.gif'
import Typography from '@material-ui/core/Typography'


import { login } from 'actions/auth'
import { getTransactions } from 'actions/transactions'
import { getUsers, getConfig } from 'actions/users'
import { getTariffPlans } from 'actions/general'


const Wrapper = styled(Paper)`
  max-width: 400px;
  max-height: 600px;
  margin: 10vh auto;
  text-align: center;
  background: #fff !important;
`

const TextInput = styled(TextField)`
  margin: 10px 0 !important;
`

const LoginButton = styled(Button)`
  margin: 10px 0 !important;
  max-width: 70%;
`

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      recaptchaError: false
    }
  }

  componentDidMount = () => {
    if (this.props.token) this.props.history.push('/')
  }

  componentDidUpdate = () => {
    if (this.props.token) this.props.history.push('/')
  }

  handleTextChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  login = (event) => {
    event.preventDefault()
    const { username, password } = this.state
    this.props.login({username, password})
    .then(loginResponse => {
      if (loginResponse.type === 'LOGIN_SUCCESS') {
        this.props.getUsers()
        .then(()=>this.props.getTariffPlans())
        .then(()=>this.props.getTransactions(loginResponse.payload.data.user.username))
        .then(()=>this.props.getConfig())
      }
    })

  }

  render() {     
    return (
      <Wrapper elevation={24}>
        {this.props.loading && <Loading />}
        <Notification />
        <form onSubmit={this.login} style={{padding: 10, display: 'grid', justifyItems: 'center'}}>
          <Typography variant='h6'>G1HD Billing</Typography>
          <img src={Logo} alt="Logo" style={{maxWidth: 200, padding: 10}}/>
          <TextInput
            name="username"
            label="Username"
            type="username"
            autoComplete="username"
            fullWidth
            autoFocus
            onChange={this.handleTextChange}
            value={this.state.username}
            required
          />
          <TextInput
            name="password"
            label="Password"
            type="password"
            autoComplete="password"
            fullWidth
            onChange={this.handleTextChange}
            value={this.state.password}
            required
          />
          {this.state.recaptchaError && 
            <Typography variant='h6' color='secondary'>ReCaptcha Error</Typography>
          }
          <LoginButton variant="contained" type="submit" color="primary" fullWidth>
            Login
          </LoginButton>
        </form>
        <Offline polling={{interval:30000, url: '/api/checkStatus'}}>
          <Loading />
          <PopupMessage
            title='No Active Internet Connection Detected'
            description='You can continue with your work once the connection is back.'
            image={NoInternetGIF}
          />
        </Offline>
      </Wrapper>
    )
  }
}


const mapStateToProps = state => ({
  token: state.auth.token,
  loading: state.general.loading
})

const mapDispatchToProps = dispatch => ({
  login: credentials => dispatch(login(credentials)),
  getTransactions: username => dispatch(getTransactions(username)),
  getConfig: () => dispatch(getConfig()),
  getUsers: () => dispatch(getUsers()),
  getTariffPlans: () => dispatch(getTariffPlans()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)