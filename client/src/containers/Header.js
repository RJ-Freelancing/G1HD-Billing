import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Logo from 'assets/logo.png'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import Notification from 'components/Notification'
import { Offline } from "react-detect-offline";
import Loading from 'components/Loading'
import PopupMessage from 'components/PopupMessage'
import NoInternetGIF from 'assets/noInternet.gif'
import Inactivity from 'assets/inactivity.gif'


import { logout } from 'actions/auth'

import { toggleMobileSideBar, clearNotification } from 'actions/general'

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(to right top, #051937, #00205b, #00267f, #0027a3, #1121c4)',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('xs')]: {
      display: 'flex',
    },
  },
})


class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      inactivity: 0
    }
  }

  onIdle = () => {
    this.timer = setInterval(this.progress, 1000)
  }

  componentWillMount = () => {
    if (!this.props.token) this.props.gotoLink('/login')
  }

  componentDidMount = () => {
    window.onmousemove = this.resetInactiveTimer
    window.addEventListener("scroll", this.resetInactiveTimer, true)
    this.idleTimer = setTimeout(this.onIdle, 120000)
  }

  componentDidUpdate = () => {
    if (!this.props.token) this.props.gotoLink('/login')
  }

  componentWillUnmount = () => { 
    clearInterval(this.timer)
    clearTimeout(this.idleTimer)
    window.removeEventListener("scroll", this.resetInactiveTimer)
  }

  resetInactiveTimer = () => {
    if (this.state.inactivity)
      this.setState({ inactivity: 0 }, ()=>{
        clearInterval(this.timer)
        clearTimeout(this.idleTimer)
        this.idleTimer = setTimeout(this.onIdle, 120000)
      })
  }

  progress = () => {
    const { inactivity } = this.state
    if (inactivity >= 60) {this.props.logout();this.props.gotoLink('/login')}
    else this.setState({ inactivity: inactivity + 1 })
  }


  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state
    const { classes } = this.props
    const isMenuOpen = Boolean(anchorEl)

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={()=>{this.props.gotoLink('/profile');this.props.clearNotification()}}>
          <ListItemIcon><SettingsIcon/></ListItemIcon>
          <ListItemText primary="My account" />
        </MenuItem>
        <MenuItem onClick={()=>{this.props.logout();this.props.gotoLink('/login')}}>
          <ListItemIcon><LogoutIcon/></ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    )

    return (
      <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={()=>this.props.toggleMobileSideBar(true)}>
            <MenuIcon />
          </IconButton>

          <img src={Logo} alt="Logo" style={{maxWidth:50, paddingRight: '10px'}}/>
          <Typography variant="h6" color="inherit" noWrap>
            G1HD Billing
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-owns={isMenuOpen ? 'material-appbar' : null}
              aria-haspopup="true"
              onClick={this.handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
              <Typography variant="subtitle1" color="inherit" noWrap style={{paddingLeft: '5px'}}>
                {this.props.username}
              </Typography>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Loading />
      <Notification />
      <Offline polling={{interval:30000, url: '/api/users'}}>
        <Loading />
        <PopupMessage
          title='No Active Internet Connection Detected'
          description='You can continue with your work once the connection is back.'
          image={NoInternetGIF}
        />
      </Offline>
      {this.state.inactivity ? 
        <PopupMessage
          title="Session Idle"
          description={`You will be logged out in ${60-this.state.inactivity} seconds due to inactivity.`}
          image={Inactivity}
        /> 
      : null}
      </>
    )
  }
}



const mapStateToProps = state => ({
  token: state.auth.token,
  username: state.auth.username
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  toggleMobileSideBar: (open) => dispatch(toggleMobileSideBar(open)),
  clearNotification: () => dispatch(clearNotification()),

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header))