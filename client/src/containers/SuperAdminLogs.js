import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { getAllLogs, readLog } from 'actions/users'


const Wrapper = styled.div`
  display: grid
  grid-gap: 10px
  grid-template-columns: 1fr
`


class SuperAdminLogs extends Component {

  constructor(props) {
    super(props)
    this.state = {
      allLogs: [],
      expanded: 'null',
      selectedLog: '',
    }
  }

  componentDidMount = () => {
    if (this.props.authUserType !== 'superAdmin') this.props.history.push('/')
    else {
      this.props.getAllLogs()
      .then(response => {
        this.setState({allLogs: response.payload.data})
      })
    }
  }

  handleChange = panel => (event, expanded) => {
    const expandedNew = expanded ? panel : false
    if (expandedNew) {
      this.props.readLog(panel)
      .then(response => {
        this.setState({
          expanded: expandedNew,
          selectedLog: response.payload.data
        })
      })
    } else {
      this.setState({ expanded: expandedNew })
    }
  }

  handleSearch = (e) => {
    const search = e.target.value
    if (search) {
      const filteredLogs = this.state.allLogs.filter( filename => {
        return ((filename).toLowerCase().includes(search.toLowerCase()))
      })
      this.setState({allLogs: filteredLogs})
    } else {
      this.props.getAllLogs()
      .then(response => {
        this.setState({allLogs: response.payload.data})
      })
    }
  }

  render() {
    const { expanded } = this.state

    return (
      <Wrapper>
        <TextField
          id="search"
          label="Search"
          onChange={this.handleSearch}
          margin="normal"
        />
        {this.state.allLogs.map(filename => 
          <ExpansionPanel key={filename} expanded={expanded === filename} onChange={this.handleChange(filename)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{background: 'linear-gradient(60deg, #66bb6a, #43a047)'}}>
              <Typography>{filename}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{background: '#F1F3F6'}}>
              <pre style={{overflowX: 'scroll', width: '75vw'}}>
                {this.state.selectedLog}
              </pre>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
      </Wrapper>
    )
  }
}



const mapStateToProps = state => ({
  authUserType: state.auth.userType,
})


const mapDispatchToProps = dispatch => ({
  getAllLogs: () => dispatch(getAllLogs()),
  readLog: filename => dispatch(readLog(filename)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdminLogs)
