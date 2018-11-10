import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Icon from '@material-ui/core/Icon';

import { toggleMobileSideBar, clearNotification } from 'actions/general'


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
  const { classes, mobileView, userType } = props
  
  const Menus = menus.map(({ label, link, icon }, idx)=> 
    userType && permissions[userType].includes(link) && 
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

  return (
    <>
      {!mobileView ? 
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          {Menus}
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
          {Menus}
        </SwipeableDrawer>
      }
    </>
  )
}



const mapStateToProps = state => ({
  userType: state.auth.userType,
  mobileMenu: state.general.mobileMenu,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  toggleMobileSideBar: (open) => dispatch(toggleMobileSideBar(open)),
  clearNotification: () => dispatch(clearNotification()),

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sidebar))

