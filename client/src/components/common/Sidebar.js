import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Icon from '@material-ui/core/Icon';


const styles = theme => ({
  drawerPaper: {
    width: 240,
    border: 'none',
    background: 'linear-gradient(to right, #051937, #0a2755, #173574, #294394, #3f51b5)',
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

const menus = [
  {label: 'Dashboard', link: '/', icon: 'dashboard'},
  {label: 'Users', link: '/users', icon: 'person_add'},
  {label: 'Clients', link: '/clients', icon: 'people'},
  {label: 'Transactions', link: '/transactions', icon: 'money'},
];


const Sidebar = (props) => {
  const { classes, mobileView } = props
  
  const Menus = menus.map(({ label, link, icon }, idx)=>
    <ListItem 
      key={idx} 
      button 
      classes={{root: classes.menu}} 
      onClick={()=>props.activePage===link ? {} : props.gotoLink(link)}
      style={{background: props.activePage===link ? 'radial-gradient(circle, #150271, #1d198e, #222ead, #2243cc, #1a59ed)' : 'inherit'}}
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


export default withStyles(styles)(Sidebar)