import React from 'react'
import Navigator from './app/navigation/Navigator.js'
window.addEventListener = x => x;   //  mock eventListener to satisfy Firestore
console.ignoredYellowBox = ['Warning:'];
console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return(
      <Navigator/>
    )
  }
}
