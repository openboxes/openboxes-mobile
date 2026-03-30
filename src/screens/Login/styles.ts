import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 20
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    width: 120,
    height: 120
  },
  profileCard: {
    backgroundColor: '#f5f6f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20
  },
  profileCardOuter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileCardInner: {
    flex: 1
  },
  profileCardTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileCardServerIcon: {
    marginRight: 12
  },
  profileCardText: {
    flex: 1
  },
  profileCardLabel: {
    fontWeight: '600',
    lineHeight: 18
  },
  profileCardUrl: {
    lineHeight: 14,
    marginTop: 0
  }
});

export default styles;
