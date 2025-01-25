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


const TransferScreen = ({ navigation,handleGlobalClick }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchNumber, setBranchNumber] = useState('');
  const [reason, setReason] = useState('');
  const [money, setMoney] = useState('');

  const handleTransfer = () => {
    if (!selectedBank || !accountNumber || !branchNumber || !reason || !money) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    Alert.alert('Success', 'Transfer submitted successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Bank'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
    <View style={styles.titleContainer}>
        <Text style={styles.title}>העברת כספים</Text>
    </View>

      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'בחר בנק...', value: '' }}
        onValueChange={(value) => {setSelectedBank(value);handleGlobalClick();}}
        items={[
            { label: 'לאומי', value: '10' },
            { label: 'פועלים', value: '12' },
            { label: 'דיסקונט', value: '11' },
            { label: 'יהב', value: '4' },
            { label: 'בנק הדואר', value: '9' },
            { label: 'אגוד', value: '13' },
            { label: 'אוצר החייל', value: '14' },
            { label: 'מרכנתיל', value: '17' },
            { label: 'Citibank N.A', value: '22' },
            { label: 'מזרחי טפחות', value: '20' },
            { label: 'HSBC Bank plc', value: '23' },
            { label: 'יובנק בע"מ', value: '26' },
            { label: 'Barclays Bank PLC', value: '27' },
            { label: 'בנק למסחר בע"מ', value: '30' },
            { label: 'הבינלאומי הראשון לישראל', value: '31' },
            { label: 'SBI State Bank of India', value: '39' },
            { label: 'מסד', value: '46' },
            { label: 'מרכז סליקה בנקאי', value: '50' },
            { label: 'פועלי אגודת ישראל', value: '52' },
            { label: 'חסך קופת חסכון לחינוך', value: '65' },
            { label: 'בנק ישראל', value: '99' },
        ]}
        Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
        />

      <TextInput
        style={styles.input}
        placeholder="מספר חשבון"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        onPress={handleGlobalClick}
      />

      <TextInput
        style={styles.input}
        placeholder="מספר סניף"
        value={branchNumber}
        onChangeText={setBranchNumber}
        keyboardType="numeric"
        onPress={handleGlobalClick}
      />
      <TextInput
        style={styles.input}
        placeholder="סכום"
        value={money}
        onChangeText={setMoney}
        keyboardType="numeric"
        onPress={handleGlobalClick}
      />
      <TextInput
        style={styles.input}
        placeholder="סיבה"
        value={reason}
        onChangeText={setReason}
        onPress={handleGlobalClick}
      />

      <View style={styles.buttonContainer}>
        <Button title="שליחה" onPress={()=>{handleTransfer();handleGlobalClick();}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 200,
    marginTop: 100, 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
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
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
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

export default TransferScreen;
