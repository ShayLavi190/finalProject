import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';

const SuperMarketPage = ({ navigation, handleGlobalClick }) => {
  const buttons = [
    {
      label: 'עריכת סל קיים',
      route: 'EditCart',
      action: () => {
        handleGlobalClick('עריכת סל קיים');
        navigation.navigate('EditCart');
      },
    },
    {
      label: 'הזמנת סל קיים',
      action: () => {
        handleGlobalClick('הזמנת סל קיים');
        Alert.alert(
          'הזמנת סל קיים',
          'הסל הוזמן. יגיע אישור הזמנה למייל ולטלפון האישי שלך'
        );
      },
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>סופרמרקט</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {buttons.map((button, index) => (
          <View key={button.label} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={button.route ? button.action : button.action}
            >
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 130,
    marginTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 30,
    backgroundColor: '#5d9592',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SuperMarketPage;
