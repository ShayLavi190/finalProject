import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import products from './products';

const EditCart = ({ handleGlobalClick }) => {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'חלב', quantity: 1 },
    { id: '2', name: 'לחם', quantity: 2 },
    { id: '3', name: 'ביצים', quantity: 1 },
  ]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      Alert.alert('שגיאה', 'הכמות חייבת להיות לפחות 1.');
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    handleGlobalClick(`שינוי כמות עבור פריט ${id}`);
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    handleGlobalClick(`הסרת פריט ${id}`);
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      Alert.alert('שגיאה', 'אנא בחר מוצר.');
      return;
    }
    if (productQuantity < 1) {
      Alert.alert('שגיאה', 'אנא בחר כמות גדולה מ-1.');
      return;
    }
    setCartItems((prevItems) => [
      ...prevItems,
      {
        id: (prevItems.length + 1).toString(),
        name: selectedProduct,
        quantity: productQuantity,
      },
    ]);
    setSelectedProduct('');
    setProductQuantity(1);
    handleGlobalClick(`הוספת פריט ${selectedProduct}`);
  };

  const handleCheckout = () => {
    Alert.alert('הצלחה', 'העגלה נשלחה לתשלום!');
    setCartItems([]);
    handleGlobalClick('תשלום בוצע');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={item.quantity === '' ? '' : String(item.quantity)}
        onChangeText={(text) => {
          if (parseInt(text)<1){ Alert.alert('שגיאה', 'הכמות חייבת להיות מספר גדול מ-1.'); return;}
          if(parseInt(text)!==NaN){
          const newQuantity = text === '' ? '' : parseInt(text);
          setCartItems((prevItems) =>
            prevItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: newQuantity === '' ? '' : newQuantity }
                : cartItem
            )
          );
          if (text !== '') {
            handleGlobalClick(`שינוי כמות עבור פריט ${item.name}`);
          }
        }}}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Text style={styles.removeButtonText}>הסר</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>עגלת הקניות שלך</Text>

      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{ label: 'בחר מוצר...', value: '' }}
            onValueChange={(value) => {setSelectedProduct(value);handleGlobalClick();}}
            items={products}
            Icon={() => <Icon name="arrow-drop-down" size={24} color="gray" />}
          />
        </View>
        <TextInput
          style={[styles.input, styles.quantityInput]}
          keyboardType="numeric"
          placeholder="כמות"
          value={String(productQuantity)}
          onChangeText={(text) => setProductQuantity(parseInt(text) || '')}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>הוסף מוצר</Text>
      </TouchableOpacity>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyCart}>העגלה ריקה</Text>}
      />

      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>לתשלום</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemName: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
  },
  quantityInput: {
    width: 60,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default EditCart;
