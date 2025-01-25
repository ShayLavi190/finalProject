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
    { label: 'בנק', route: 'Bank' },
    { label: 'קופת חולים', route: 'HealthFund' },
    { label: 'בידור', route: 'Entertainment' },
    { label: 'סופרמרקט', route: 'SuperMarket' },
    { label: 'חירום', route: 'Emergency' },
    { label: 'ביצועים', route: 'Performance' },
    { label: 'הרשאות פרטיות', route: 'Premission' },
    { label: 'עידכון פרטים אישיים', route: 'Setup' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ברוך הבא</Text>
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
