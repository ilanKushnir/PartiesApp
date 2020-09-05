import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  homePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },
  appBackgroundColor: {
    backgroundColor: '#fff7e3',
  },

  title: {
    fontSize: 24,
    marginBottom: 16
  },
  partyId: {
    height: 25,
    // fontSize: 20,
    // padding: 10
  },
  partyName: {
    fontSize: 25,
    padding: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
    maxWidth: 250
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
    height: 50
  },
  loginButton: {
    width: 200,
    height: 50
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  rowHeader: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  rowPlayer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    alignSelf: 'stretch',
    borderRadius: 5,
    borderWidth: 1

  },
  column: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackItem: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    alignSelf: 'stretch',
    backgroundColor: '#DBE0E0',
  },
  trackItemSelected: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    alignSelf: 'stretch',
    backgroundColor: '#95A5A6',
  },
  publicSwitch: {
    marginHorizontal: 10
  },
  partyModePicker: {
    marginHorizontal: 10
  },
  partyItemPlayed: {
    // flexDirection: 'row',
    alignContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#6C7A89',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#e7ffcf',
  },
  partyItemPaused: {
    // flexDirection: 'row',
    alignContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#6C7A89',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },

  ParticipantItem: {
    flexDirection: 'row',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: '#6C7A89',
    marginHorizontal: 5,
    justifyContent: 'space-between',
    marginBottom: 5,
    backgroundColor: '#DBE0E0',
    borderRadius: 10,
    paddingLeft: 5,
    paddingTop: 15

  },
  ActivePlaylistItem: {
    flexDirection: 'row',
    alignContent: 'center',
    marginHorizontal: 5,
    paddingTop: 23,
    alignSelf: 'stretch',
    marginBottom: 5,
    backgroundColor: '#DBE0E0',
    borderRadius: 10,
    borderWidth: 1,

  },
  PlaylistItem: {
    alignContent: 'center',
    alignSelf: 'stretch',
    marginBottom: 5,
    backgroundColor: '#DBE0E0',
    borderRadius: 10,
    borderWidth: 1.5,
    alignSelf: 'stretch'
  }
});