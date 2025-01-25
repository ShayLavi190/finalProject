import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactBankerScreen = ({ navigation, handleGlobalClick }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!subject || !description) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    Alert.alert('Success', 'Message sent successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Bank'), 
      },
    ]);
  };

  return (
    <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>צור קשר עם הבנקאי</Text>
        </View>
        <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'בחר פעולה', value: '' }} 
        onValueChange={(value) => {setSubject(value);handleGlobalClick();}}
        items={[
            { label: 'בקשה למידע נוסף', value: 'בקשה למידע נוסף' },
            { label: 'תלונה', value: 'תלונה' },
            { label: 'שירות לקוחות', value: 'שירות לקוחות' },
            { label: 'פעולה', value: 'פעולה' },
            { label: 'הגדלת מסגרת', value: 'הגדלת מסגרת' },
            { label: 'הלוואה', value: 'הלוואה' },
            { label: 'אחר', value: 'אחר' },
        ]}
        Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
        />

      <TextInput
        style={[styles.desc, styles.textRight]}
        placeholder="תיאור"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        onPress={handleGlobalClick}
      />

      <View style={styles.buttonContainer}>
        <Button title="שליחה" onPress= {() => {handleSubmit();handleGlobalClick();}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 200,
    marginTop: 100, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  desc: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 300,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  textRight: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
    textAlign: 'center',
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
    textAlign: 'right',
  },
});

export default ContactBankerScreen;
