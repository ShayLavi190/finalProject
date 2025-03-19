import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ ייבוא AsyncStorage
import products from './products';

const EditCart = ({ handleGlobalClick,navigation }) => {
  const [cartItems, setCartItems] = useState([ ]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(products);
  const DEFAULT_CART = [
    { id: '1', name: 'חלב', quantity: 1 },
    { id: '2', name: 'לחם', quantity: 2 },
    { id: '3', name: 'ביצים', quantity: 1 },
  ];
  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
        console.log('🛒 עגלה נטענה בהצלחה!', JSON.parse(storedCart));
      } else {
        setCartItems(DEFAULT_CART);
        console.log('🔄 אין נתונים שמורים, נטען ברירת מחדל.');
      }
    } catch (error) {
      console.error('❌ שגיאה בטעינת העגלה:', error);
      setCartItems(DEFAULT_CART); // fallback במקרה של שגיאה
    }
  };

  useEffect(() => {
    loadCartFromStorage();
  }, []);
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
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
      return;
    }
    if (productQuantity < 1) {
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

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
    }
  };

  const handleCheckout = async () => {
    await saveCartToStorage(); 
    navigation.navigate('SuperMarket')
    handleGlobalClick('שמירה');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(item.quantity)}
        onChangeText={(text) => {
          const newQuantity = parseInt(text);
          if (isNaN(newQuantity) || newQuantity < 1) {
            return;
          }
          handleQuantityChange(item.id, newQuantity);
        }}
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
          <DropDownPicker
            open={open}
            value={selectedProduct}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              setSelectedProduct(callback);
              handleGlobalClick();
              handleGlobalClick();
            }}
            setItems={setItems}
            placeholder="בחר מוצר..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        <TextInput
          style={[styles.input, styles.quantityInput]}
          keyboardType="numeric"
          placeholder="כמות"
          value={String(productQuantity)}
          onChangeText={(text) => setProductQuantity(parseInt(text) || 1)}
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
          <Text style={styles.checkoutButtonText}>שמור</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

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
    zIndex: 1000,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
    zIndex: 1000, 
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
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    zIndex: 1000, 
  },
});

export default EditCart;
