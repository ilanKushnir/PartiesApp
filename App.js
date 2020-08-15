import React from 'react'
import Navigator from './app/views/subComponents/Navigator.js'
window.addEventListener = x => x;   //  mock eventListener to satisfy Firestore

export default class App extends React.Component {
  render() {
    return(
      <Navigator/>
    )
  }
}
