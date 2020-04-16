import React from 'react'
import { AndroidBackHandler } from "react-navigation-backhandler";

export class BackButtonHandler extends React.Component {
  onBackButtonPressAndroid = () => { return true };

  render() {
    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}/>
    );
  }
}