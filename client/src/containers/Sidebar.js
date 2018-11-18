import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography'
import Logo from 'assets/logo.png'

import { toggleMobileSideBar, clearNotification } from 'actions/general'
import { logout } from 'actions/auth'


const styles = theme => ({
  drawerPaper: {
    width: 240,
    border: 'none',
    background: 'linear-gradient(to left, #1d239b, #0e2388, #032175, #021e61, #061b4e)',
  },
  menu: {
    minHeight: 60, 
    cursor: 'pointer',
  },
  menuItem: {
    color: '#fff',
  }
})


const permissionsDenied = {
  'superAdmin': [],
  'admin': ['/admins', '/config'],
  'superReseller': ['/admins', '/superResellers', '/config'],
  'reseller': ['/admins', '/superResellers', '/resellers', '/config']
}


const menus = [
  {label: 'Dashboard', link: '/', icon: 'dashboard'},
  {label: 'Admins', link: '/admins', icon: 'local_library'},
  {label: 'Super Resellers', link: '/superResellers', icon: 'group'},
  {label: 'Resellers', link: '/resellers', icon: 'person'},
  {label: 'Clients', link: '/clients', icon: 'airplay'},
  {label: 'Transactions', link: '/transactions', icon: 'attach_money'},
  {label: 'Events', link: '/events', icon: 'near_me'},
  {label: 'Configuration', link: '/config', icon: 'info'},
  {label: 'My Account', link: '/profile', icon: 'settings'},
];



const Sidebar = (props) => {
  const { classes, mobileView, authUserType, activePage, gotoLink, clearNotification, logout } = props
  
  const onLinkClick = (link) => {
    if (mobileView) props.toggleMobileSideBar(false)
    if (activePage!==link) {
      gotoLink(link)
      clearNotification()
    }
  }

  const logo = (          
    <div style={{textAlign: 'center'}}>
      <img src={Logo} alt="Logo" style={{maxWidth:100, padding: '10px 10px'}}/>
      <Typography variant="h5" color="inherit" noWrap style={{color: 'white'}}>
        G1HD Billing
      </Typography>
      <br/>
    </div>
  )

  const authInfo = (
    <div style={{textAlign: 'center', marginBottom: 20}}>
      <Typography variant="subtitle2" color="inherit" noWrap style={{color: 'white'}}>
        Welcome {props.auth.username} <br/>
      </Typography>
      <Typography variant="subtitle2" color="inherit" noWrap style={{color: 'white'}}>
        Credits Available <strong style={{fontSize: 20}}>{props.auth.creditsAvailable}</strong>
      </Typography>
      {authUserType==='reseller' &&
        <Typography variant="subtitle2" color="inherit" noWrap style={{color: 'white'}}>
          Credits Owed <strong style={{fontSize: 20}}>{props.auth.creditsOwed}</strong>
        </Typography>
      }
      {props.auth.creditsOwed > props.auth.creditsAvailable &&
        <Typography variant="subtitle2" color="secondary">
          WARNING ! <br/>You owe more credits than available
        </Typography>
      }
    </div>
  )

  const renderLinks = menus.map(({ label, link, icon }, idx) =>
    !permissionsDenied[authUserType].includes(link) &&
    <ListItem 
      key={idx} 
      button 
      classes={{root: classes.menu}} 
      style={{background: activePage===link ? 'radial-gradient(circle, #9553eb, #714ad0, #5040b5, #2f3598, #082a7c)' : ''}}
      onClick={()=>onLinkClick(link)}
    >
      <ListItemIcon style={{color: 'white'}}>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{className: classes.menuItem}} />
    </ListItem>
  )

  const footer = (
    <ListItem 
      onClick={logout}
      button 
      classes={{root: classes.menu}}  
      style={{marginTop: 10}}
    >
      <ListItemIcon classes={{root: classes.menuItem}}><Icon>logout</Icon></ListItemIcon>
      <ListItemText primary="Logout" primaryTypographyProps={{className: classes.menuItem}} />
    </ListItem>
  )

  return (
    <SwipeableDrawer
      open={!mobileView || props.mobileMenu} 
      variant={!mobileView ? "permanent" : "temporary"}
      onClose={()=>props.toggleMobileSideBar(false)}
      onOpen={()=>props.toggleMobileSideBar(true)}
      classes={{ paper: classes.drawerPaper }}
    >
      {logo}
      {authInfo}
      {renderLinks}
      {footer}
    </SwipeableDrawer>
  )
}


const mapStateToProps = state => ({
  auth: state.auth,
  authUserType: state.auth.userType,
  mobileMenu: state.general.mobileMenu,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  toggleMobileSideBar: (open) => dispatch(toggleMobileSideBar(open)),
  clearNotification: () => dispatch(clearNotification()),
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sidebar))
