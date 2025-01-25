import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

const EntertainmentPage = ({ navigation, handleGlobalClick }) => {
  const buttons = [
    {
      label: 'עיתונים',
      route: 'Newspaper',
    },
    {
      label: 'חדשות',
      route: 'NewsChannels',
    },
    {
      label: 'משחקים',
      route: 'Games',
    },
    {
      label: 'דו שיח',
      action: () => {
        Alert.alert('דו שיח', 'אתה מועבר לדף דו שיח');
        handleGlobalClick('דו שיח');
      },
    },
  ];

  const handleButtonPress = (button) => {
    if (button.route) {
      navigation.navigate(button.route);
    } else if (button.action) {
      button.action();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>בידור</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {buttons.map((button) => (
          <View key={button.label} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress(button)}
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

export default EntertainmentPage;
