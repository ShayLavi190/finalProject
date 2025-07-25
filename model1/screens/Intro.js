import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const Intro = ({ navigation, handleGlobalClick }) => {
  const models = [
    { label: 'Model 1', route: 'Setup' },
    { label: 'Model 2', route: 'SetUp' },
    { label: 'Model 3', route: 'HomeSetUp' ,params: { fromIntro: true } },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to our research</Text>
        <Text style={styles.subtitle}>Please select a model</Text>
      </View>
      <View style={styles.buttonRowContainer}>
        {models.map((model) => (
          <View key={model.label} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate(model.route, model.params || {});
              }}
            >
              <Text style={styles.buttonText}>{model.label}</Text>
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
    marginTop:20,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
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

export default Intro;
