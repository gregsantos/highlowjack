import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { metrics } from '../themes'

const BodyOuter = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  &.fade-appear,
  &.fade-enter {
    opacity: 0;
    z-index: 1;
    transform: translateX(24px);
    @media (max-width: 480px) {
      transform: translateX(0px);
    }
  }
  &.fade-appear-active,
  &.fade-enter.fade-enter-active {
    opacity: 1;
    transform: translateX(0px);
    transition: opacity 400ms linear 400ms, transform 400ms ease-out 400ms;
  }

  &.fade-exit {
    opacity: 1;
    transform: translateX(0px);
  }
  &.fade-exit.fade-exit-active {
    opacity: 0;
    transform: translateX(-24px);
    transition: opacity 400ms linear, transform 400ms ease-in;
    @media (max-width: 480px) {
      transform: translateX(0px);
    }
  }
`

const BodyWrapper = styled.div`
  margin-top: ${metrics.headerHeight}px;
  width: 100%;
  @media (max-width: 480px) {
    width: 100%;
    margin-top: 0px;
    margin-bottom: 47px;
  }
`

const RoomWrapper = (props) => {
  const scrollRef = useRef()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [])

  return (
    <BodyOuter ref={scrollRef}>
      <BodyWrapper>{props.children}</BodyWrapper>
    </BodyOuter>
  )
}

export default RoomWrapper
