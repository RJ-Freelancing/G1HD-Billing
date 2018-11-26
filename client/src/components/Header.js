import React from 'react'
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import IconButton from '@material-ui/core/IconButton'
import Logo from 'assets/logo.png'


const Header = (props) => {
  const { username, toggleMobileSideBar } = props
  
  return (
    <AppBar position="fixed" style={{background: '#2D3446'}}>
      <Toolbar>
        <IconButton style={{margin: '0px 20px 0px -12px'}} color="inherit" aria-label="Open drawer" onClick={()=>toggleMobileSideBar(true)}>
          <MenuIcon />
        </IconButton>
        <img src={Logo} alt="Logo" style={{maxWidth:50, paddingRight: '10px'}}/>
        <Typography variant="h6" color="inherit" noWrap>
          G1HD Billing
        </Typography>
        <div style={{flexGrow: 1}} />
        <div style={{display: 'flex'}}>
          <AccountCircle />
          <Typography variant="subtitle1" color="inherit" noWrap style={{paddingLeft: '5px'}}>
            {username}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header


Header.propTypes = {
  username: PropTypes.string.isRequired,
  toggleMobileSideBar: PropTypes.func.isRequired,
};
