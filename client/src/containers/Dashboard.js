import React, { Component } from 'react'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper';


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 450px);
  grid-gap: 40px;
  margin: 20px 20px;
  justify-content: center
`

const DashboardItem = styled(Paper)`
  min-height: 250px;
`



export default class Dashboard extends Component {
  render() {
    return (
      <Wrapper>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
        <DashboardItem elevation={24}/>
      </Wrapper>
    )
  }
}