import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';

const HomePermissions = ({ handleGlobalClick }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleMoveToNext = () => {
    navigation.navigate('Home13');
  };

  const permissionsOptions = [
    {
      title: 'Digital Services',
      icon: 'security',
      screen: 'Premissions13',
      color: '#FFECB3',
      description: 'Please allow the robot to perform digital actions on your behalf in governmental and banking systems.'
    },
    {
      title: 'Calls and Messages',
      icon: 'call',
      screen: 'Premissions23',
      color: '#C8E6C9',
      description: 'Please allow access to send messages and make calls on your behalf for service purposes.'
    },
    {
      title: 'Healthcare Services',
      icon: 'healing',
      screen: 'Premissions33',
      color: '#B3E5FC',
      description: 'Please allow the robot access to your medical information to help schedule appointments and tests for you.'
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions Setup for Service Execution</Text>
      <Text style={styles.subtitle}>
        In order for the caregiving robot to provide services on your behalf, your consent is required for certain actions. All data is securely stored and not shared with any third party unless needed for a specific service.
      </Text>

      {permissionsOptions.map((option, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          delay={index * 200}
          style={[styles.box, { backgroundColor: option.color }]}
        >
          <TouchableOpacity
            style={styles.buttonContent}
            onPress={() => handlePress(option.screen)}
          >
            <Icon name={option.icon} size={40} color="#333" />
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.description}>{option.description}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ))}

      <View>
        <TouchableOpacity style={styles.button} onPress={handleMoveToNext}>
          <Text style={styles.buttonText}>Finish Setup and Continue</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  box: {
    width: '85%',
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonContent: {
    alignItems: 'center',
  },
  optionTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: 'green',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  }
});

export default HomePermissions;
