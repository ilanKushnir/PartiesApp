import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 16
  },
  partyId: {
    fontSize: 17,
    padding: 10
  },
  partyName: {
    fontSize: 25,
    padding: 10,
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
    height: 50
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowHeader: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  rowPlayer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative",
    alignSelf: 'stretch'
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
    borderTopWidth: 1,
    borderTopColor: '#6C7A89',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#ECF0F1',
  },
  trackItemSelected: {
    flexDirection: 'row',
    alignContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#6C7A89',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#95A5A6',
  }
});