import styled from 'styled-components'

export const ButtonWrapper = styled.div`
  clear: both;
  display: inline-block;
`

export const RadioButton = styled.div`
  position: absolute;
  left: -9999em;
  top: -9999em;

  &:checked + label {
    background-color: red;
  }

  + label {
    float: left;
    padding: 0.5em 1em;
    cursor: pointer;
    border: 1px solid indianred;
    margin-right: -1px;
    color: #fff;
    background-color: darkseagreen;

    &:checked {
      background-color: red;
    }

    &:first-of-type {
      border-radius: 0.7em 0 0 0.7em;
    }

    &:last-of-type {
      border-radius: 0 0.7em 0.7em 0;
    }
  }
`
