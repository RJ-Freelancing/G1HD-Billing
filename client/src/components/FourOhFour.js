import React, { Component } from 'react'
import FourOhFourImage from 'assets/404.png'
import styled from 'styled-components'


const Page = styled.div`
  text-align: center;
`

class FourOhFour extends Component {
  render() {
    return (
      <Page>
        <img src={FourOhFourImage} alt="404"/>
      </Page>
    )
  }
}


export default FourOhFour