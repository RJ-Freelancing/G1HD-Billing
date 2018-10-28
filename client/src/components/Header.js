import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Logo from 'assets/logo.png';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';


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
});


class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
    }
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={()=>this.props.gotoLink('/profile')}>
          <ListItemIcon><SettingsIcon/></ListItemIcon>
          <ListItemText primary="My account" />
        </MenuItem>
        <MenuItem onClick={this.props.logout}>
          <ListItemIcon><LogoutIcon/></ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    );

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
      </>
    )
  }
}


export default withStyles(styles)(Header)