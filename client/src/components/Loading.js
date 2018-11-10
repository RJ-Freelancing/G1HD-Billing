import React from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'


const ball1 = keyframes`
  0% {
    box-shadow: 30px 0 0 #f8b334;
  }
  50% {
    box-shadow: 0 0 0 #f8b334;
    margin-bottom: 0;
    -webkit-transform: translate(15px,15px);
    -moz-transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #f8b334;
    margin-bottom: 10px;
  }
`

const ball2 = keyframes`
  0% {
    box-shadow: 30px 0 0 #97bf0d;
  }
  50% {
    box-shadow: 0 0 0 #97bf0d;
    margin-top: -20px;
    -webkit-transform: translate(15px,15px);
    -moz-transform: translate(15px, 15px);
  }
  100% {
    box-shadow: 30px 0 0 #97bf0d;
    margin-top: 0;
  }
`

const Rotate = keyframes`
  0% {
    -webkit-transform: rotate(0deg) scale(1.4);
    -moz-transform: rotate(0deg) scale(1.4);
  }
  50% {
    -webkit-transform: rotate(360deg) scale(2.0);
    -moz-transform: rotate(360deg) scale(2.0);
  }
  100% {
    -webkit-transform: rotate(720deg) scale(1.4);
    -moz-transform: rotate(720deg) scale(1.4);
  }
`

const Loader = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  animation: ${Rotate} 1s infinite;
  height: 50px;
  width: 50px;
  z-index: 9999;
  &:before,
  &:after {
    border-radius: 50%;
    content: '';
    display: block;
    height: 20px;
    width: 20px;
  }
  &:before {
    animation: ${ball1} 1s infinite;
    background-color: #cb2025;
    box-shadow: 30px 0 0 #f8b334;
    margin-bottom: 10px;
  }
  &:after {
    animation: ${ball2} 1s infinite;
    background-color: #00a096;
    box-shadow: 30px 0 0 #97bf0d;
  }
`

const Loading = (props) => {
  if (props.loading) return <Loader/>
  else return <></>
}

const mapStateToProps = state => ({
  loading: state.general.loading
})

export default connect(mapStateToProps)(Loading)