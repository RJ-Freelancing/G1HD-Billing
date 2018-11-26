import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual } from 'lodash';
import RichTextEditor from 'react-rte';
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import SaveIcon from '@material-ui/icons/Save'
import Button from '@material-ui/core/Button';


import { updateConfig } from 'actions/users'


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 20px;
  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const CreditsWrapper = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  padding: 20px;
`

const AnnouncementsWrapper = styled(Paper)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  padding: 20px;
`


class SuperAdminConfig extends Component {

  constructor(props) {
    super(props)
    this.state = {
      minimumTransferrableCredits: props.minimumTransferrableCredits,
      UserAnnouncements: RichTextEditor.createValueFromString(props.UserAnnouncements, 'html'),
    }
  }

  componentDidMount = () => {
    if (this.props.authUserType !== 'superAdmin') this.props.history.push('/')
  }


  render() {
    return (
      <Wrapper>
        <CreditsWrapper elevation={5}>
          <Typography variant="overline" style={{fontSize: '18px'}}>
            Minimum Transferrable Credits
          </Typography>
          <form 
            style={{textAlign: 'center'}}
            onSubmit={(e)=>{
              e.preventDefault()
              this.props.updateConfig({configName: 'minimumTransferrableCredits', configValue: this.state.minimumTransferrableCredits})
            }} 
          >
            <TextField
              type="number"
              inputProps={{ min: 1 }}
              value={this.state.minimumTransferrableCredits}
              onChange={(e)=>this.setState({minimumTransferrableCredits: e.target.value})}
              disabled={this.props.loading}
              error={this.state.minimumTransferrableCredits < 1}
              helperText={this.state.minimumTransferrableCredits < 1 ? "Value must be greater 0" : null}
            />
            <br/><br/>
            <Button 
              variant="contained" 
              color="primary" 
              disabled={
                this.props.loading || 
                this.state.minimumTransferrableCredits < 1 || 
                this.state.minimumTransferrableCredits===this.props.minimumTransferrableCredits
              } 
              onClick={()=>
                this.props.updateConfig({configName: 'minimumTransferrableCredits', configValue: this.state.minimumTransferrableCredits})
              }          
            >
              Update
              <SaveIcon style={{marginLeft: 10}}/>
            </Button>
          </form>
        </CreditsWrapper>

        <AnnouncementsWrapper elevation={5}>
          <Typography variant="overline"  style={{fontSize: '18px'}}>
            Announcements
          </Typography>
          <RichTextEditor
            value={this.state.UserAnnouncements}
            onChange={(value) => this.setState({ UserAnnouncements: value })}
          />
          <Button 
            variant="contained" 
            color="primary" 
            disabled={this.props.loading || isEqual(this.state.UserAnnouncements.toString('html'), this.props.UserAnnouncements)} 
            onClick={()=>
              this.props.updateConfig({configName: 'UserAnnouncements', configValue: this.state.UserAnnouncements.toString('html')})
            }
          >
            Update
            <SaveIcon style={{marginLeft: 10}}/>
          </Button>
        </AnnouncementsWrapper>
      </Wrapper>
    )
  }
}



const mapStateToProps = state => ({
  token: state.auth.token,
  mobileView: state.general.mobileView,
  authUserType: state.auth.userType,
  minimumTransferrableCredits: state.config.minimumTransferrableCredits,
  UserAnnouncements: state.config.UserAnnouncements
})

const mapDispatchToProps = dispatch => ({
  updateConfig: config => dispatch(updateConfig(config))
})

export default connect(mapStateToProps, mapDispatchToProps)(SuperAdminConfig)
