import styled from 'styled-components'

export const AppContainer = styled.div`
height:100vh;
width:100vw;
display:grid;
grid-template-areas: "title""appbar""body";
grid-template-rows: 5% 5% auto;
`

export const Schedule = styled.iframe`
width:1075px;
height:90%;
`
