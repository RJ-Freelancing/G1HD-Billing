import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsers } from 'actions/users'


class EditClient extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stb_mac: null
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.loadClientFromMac(this.props.match.params.id)
  }

  loadClientFromMac = (stb_mac) => {
    let client = {};
    client = this.props.clients.find(client=>client.stb_mac===stb_mac)
    this.setState({...client})
  }

  
  render() {   
    
    return (
      <div>
        TO DO TO TO DO
        {!this.state.stb_mac ?
         <h2>Client with given MAC not found</h2>
        :
        <h2>CLIENT EDIT PAGE: TO DO for {this.state.stb_mac}</h2>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  clients: state.users.clients,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditClient)
