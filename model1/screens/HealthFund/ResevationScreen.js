import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppointmentScreen = ({ navigation, handleGlobalClick }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null); // Store time as a Date object
  const [appointmentType, setAppointmentType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSchedule = () => {
    if (!time || !appointmentType) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות.');
      return;
    }
    handleGlobalClick('קביעת תור');
    Alert.alert('הצלחה', 'אישור התור ישלח לטלפון הנייד שלך.', [
      {
        text: 'בסדר',
        onPress: () => navigation.navigate('HealthFund'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>קביעת תור</Text>
      </View>

      {/* Date Picker */}
      <Text style={styles.textRight}>בחר תאריך</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: '#333',textAlign: 'center' }}>
          {date.toLocaleDateString('he-IL')}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false); // Close the picker
            if (selectedDate) {
              setDate(selectedDate);
              handleGlobalClick('תאריך נבחר');
            }
          }}
        />
      )}

      {/* Time Picker */}
      <Text style={styles.textRight}>בחר שעה</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={{ color: '#333',textAlign: 'center', }}>
          {time
            ? time.toLocaleTimeString('he-IL', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'בחר שעה'}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <RNDateTimePicker
          value={time || new Date()} // Use the current time if none selected
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false); // Close the picker
            if (selectedTime) {
              setTime(selectedTime);
              handleGlobalClick('שעה נבחרה');
            }
          }}
        />
      )}

      {/* Appointment Type */}
      <Text style={styles.textRight}>בחר סוג תור</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'בחר סוג תור...', value: '' }}
        onValueChange={(value) => {
          setAppointmentType(value);
          handleGlobalClick(`סוג תור: ${value}`);
        }}
        items={[
          { label: 'בדיקה כללית', value: 'בדיקה כללית' },
          { label: 'רופא משפחה', value: 'רופא משפחה' },
          { label: 'בדיקות דם', value: 'בדיקות דם' },
        ]}
        Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
      />

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title="הזמנה" onPress={handleSchedule} />
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
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    justifyContent: 'center',
  },
  textRight: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
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
    padding: 15,
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
  },
});

export default AppointmentScreen;
