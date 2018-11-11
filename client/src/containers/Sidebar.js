import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography'
import Logo from 'assets/logo.png'
import SettingsIcon from '@material-ui/icons/Settings'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'

import { toggleMobileSideBar, clearNotification } from 'actions/general'
import { logout } from 'actions/auth'


const styles = theme => ({
  drawerPaper: {
    width: 240,
    border: 'none',
    background: 'linear-gradient(to left, #1d239b, #0e2388, #032175, #021e61, #061b4e)',
  },
  toolbar: {
    ...theme.mixins.toolbar,
    minHeight: '65px !important'
  },
  menu: {
    minHeight: 60, 
    cursor: 'pointer',
  },
  menuItem: {
    color: '#fff',
  }
})

const permissions = {
  'super-admin': ['/', '/admins', '/superResellers', '/resellers', '/clients', '/transactions', '/events', '/config'],
  'admin': ['/', '/superResellers', '/resellers', '/clients', '/transactions', '/events'],
  'superReseller': ['/', '/resellers', '/clients', '/transactions', '/events'],
  'reseller': ['/', '/clients', '/transactions', '/events']
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
];


const Sidebar = (props) => {
  const { classes, mobileView, authUserType } = props
  
  const Menus = menus.map(({ label, link, icon }, idx)=> 
    authUserType && permissions[authUserType].includes(link) && 
    <ListItem 
      key={idx} 
      button 
      classes={{root: classes.menu}} 
      onClick={()=>{
        mobileView && props.toggleMobileSideBar(false)
        if (props.activePage!==link) {props.gotoLink(link);props.clearNotification()}
      }}
      style={{background: props.activePage===link ? 'radial-gradient(circle, #9553eb, #714ad0, #5040b5, #2f3598, #082a7c)' : 'inherit'}}
    >
      <ListItemIcon classes={{root: classes.menuItem}}>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{className: classes.menuItem}}/>
    </ListItem>
  )


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
    <div style={{textAlign: 'center', paddingBottom: 10}}>
      <Typography variant="subtitle2" color="inherit" noWrap style={{color: 'white'}}>
        Welcome {props.auth.username}
      </Typography>
      <Typography variant="subtitle2" color="inherit" noWrap style={{color: 'white'}}>
        Credits Available {props.auth.creditsAvailable}
      </Typography>
      {authUserType==='reseller' &&
        <Typography variant="subtitle2" color="inherit" noWrap style={{color: 'white'}}>
          Credits On Hold {props.auth.creditsOnHold}
        </Typography>
      }
    </div>
  )

  const footer = (
    <>
    <br/>
    <ListItem 
      onClick={()=>{props.gotoLink('/profile');props.clearNotification()}}
      button 
      classes={{root: classes.menu}}  
      style={{background: props.activePage==='/profile' ? 'radial-gradient(circle, #9553eb, #714ad0, #5040b5, #2f3598, #082a7c)' : 'inherit'}}
    >
      <ListItemIcon classes={{root: classes.menuItem}}><SettingsIcon/></ListItemIcon>
      <ListItemText primary="My account" primaryTypographyProps={{className: classes.menuItem}}/>
    </ListItem>
    <ListItem 
      onClick={()=>{props.logout();props.gotoLink('/login')}}
      button 
      classes={{root: classes.menu}}  
    >
      <ListItemIcon classes={{root: classes.menuItem}}><LogoutIcon/></ListItemIcon>
      <ListItemText primary="Logout" primaryTypographyProps={{className: classes.menuItem}}/>
    </ListItem>
    </>
  )

  return (
    <>
      {!mobileView ? 
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {logo}
          {authInfo}
          {Menus}
          {footer}
        </Drawer>
        :
        <SwipeableDrawer
          open={props.mobileMenu} 
          onClose={()=>props.toggleMobileSideBar(false)}
          onOpen={()=>props.toggleMobileSideBar(true)}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {logo}
          {Menus}
          {footer}
        </SwipeableDrawer>
      }
    </>
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
  logout: () => dispatch(logout()),


})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sidebar))

