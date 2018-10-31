import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsers } from 'actions/users'


class EditInternalUser extends Component {

  constructor(props) {
    super(props)
    this.state = {
      internalUser: null
    }
  }

  componentDidMount = () => {   
    if (!this.props.token) this.props.history.push('/login')
    else this.loadInternalUserFromUsername(this.props.match.params.id)
  }

  loadInternalUserFromUsername = (username) => {
    let internalUser;
    internalUser = this.props.admins.find(admin=>admin.username===username)
    if (!internalUser)
      internalUser = this.props.superResellers.find(admin=>admin.username===username)
    if (!internalUser)
      internalUser = this.props.resellers.find(admin=>admin.username===username)
    this.setState({internalUser})
  }

  
  render() {   
    
    return (
      <div>
        TO DO TO TO DO
        {!this.state.internalUser ?
         <h2>User with given username not found</h2>
        :
        <h2>INTERNAL USER EDIT PAGE: TO DO for {this.state.internalUser.username}</h2>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  admins: state.users.admins,
  superResellers: state.users.superResellers,
  resellers: state.users.resellers,
  mobileView: state.general.mobileView
})

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditInternalUser)
