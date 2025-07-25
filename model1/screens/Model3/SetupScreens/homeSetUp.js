import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import { useUser } from '../../Model2/userContext';

const HomeSetUp = ({ handleGlobalClick }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, updateUser } = useUser();

  const handlePress = (screenName) => {
      navigation.navigate(screenName);
  };
  const handelMoveToNext = () => {
    if (user && user.name !== '' && user.id!=='' && user.idr !== '' && user.phone !== '' && user.street !== '' && user.number !== '' && user.city !== '' && user.country !== '') {
      navigation.navigate('HomePermissions');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All personal details must be filled in',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };
  const setupOptions = [
    { title: 'Personal Details', icon: 'person', screen: 'SetUp31', color: '#FFCDD2' },
    { title: 'Residential Address', icon: 'home', screen: 'SetUp23', color: '#BBDEFB' },
    { title: 'Bank Details', icon: 'account-balance', screen: 'SetUp33', color: '#C8E6C9' },
    { title: 'Health Insurance Fund', icon: 'local-hospital', screen: 'SetUp43', color: '#FFF9C4' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting up personal details</Text>
      <Text style={styles.subtitle}>
        In order for the care robot to be able to operate its services for your benefit, we will need your personal
        details. All information is stored securely and is not shared with any external party
        without performing a dedicated service. All steps must be completed to proceed to the permissions page.
      </Text>
      {setupOptions.map((option, index) => (
        <Animatable.View
          key={index}
          animation="fadeInUp"
          delay={index * 200}
          style={[styles.box, { backgroundColor: option.color }]}
        >
          <TouchableOpacity style={styles.buttonContent} onPress={() => handlePress(option.screen)}>
            <Icon name={option.icon} size={40} color="#333" />
            <Text style={styles.title}>{option.title}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ))}
        <View>
            <TouchableOpacity style={styles.button} onPress={() =>handelMoveToNext()}>
              <Text style={styles.buttonText}>Continue to set privacy permissions</Text>
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
    height: 120,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    backgroundColor: "green",
    marginTop: 20,
    width: 300,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 25,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  }
});

export default HomeSetUp;
