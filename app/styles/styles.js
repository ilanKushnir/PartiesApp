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
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 70
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
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: 'skyblue',
    borderColor: 'powderblue',
    borderWidth: 3
  },
  trackItemSelected: {
    flexDirection: 'row',
    alignContent: 'center',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: 'green',
    borderColor: 'green',
    borderWidth: 3
  }
});