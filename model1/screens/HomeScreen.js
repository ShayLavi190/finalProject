import React from 'react';
import { use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const HomePage = ({ navigation,handleGlobalClick }) => {

  const buttons = [
    { label: 'Bank', route: 'Bank' },
    { label: 'Health Fund', route: 'HealthFund' },
    { label: 'Entertainment', route: 'Entertainment' },
    { label: 'SuperMarket', route: 'SuperMarket' },
    { label: 'Emergency', route: 'Emergency' },
    { label: 'Performance', route: 'Performance' },
    { label: 'Premissions', route: 'Premission' },
    { label: 'Personal Information', route: 'Setup' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome Back</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {buttons.map((button, index) => (
          <View key={button.label} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate(button.route);
              }}>
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Text style={styles.subtitle}>
        This is the screen where you can choose the services you want to use. Because we are in the Basic model, we don't have any textual or vocal explanation for each service.
      </Text>
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
    marginBottom:30,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomePage;
