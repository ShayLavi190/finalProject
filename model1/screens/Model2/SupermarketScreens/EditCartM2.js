import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import products from '../../SuperMarket/products';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditCartM2 = ({ navigation, handleGlobalClick }) => {
  const animatableRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(products);
  
  const DEFAULT_CART = [
    { id: '1', name: 'Milk', quantity: 1 },
    { id: '2', name: 'Bread', quantity: 2 },
    { id: '3', name: 'Eggs', quantity: 1 },
  ];

  const showToast = (type, title, message) => {
    // First, hide any currently showing Toast
    Toast.hide();
    
    // Use setTimeout to ensure the Toast appears after UI updates
    setTimeout(() => {
      Toast.show({
        type: type,
        position: 'bottom',
        text1: title,
        text2: message,
        visibilityTime: 4000,
        autoHide: true,
      });
    }, 100);
  };

  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
        showToast('success', 'Success', 'Cart loaded successfully!');
      } else {
        setCartItems(DEFAULT_CART);
        showToast('info', 'Information', 'No data saved, default loaded.');
      }
    } catch (error) {
      console.error('שגיאה בטעינת העגלה:', error);
      setCartItems(DEFAULT_CART); // fallback במקרה של שגיאה
      showToast('error', 'Error', 'Error loading cart.');
    }
  };

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      showToast('error', 'Error', 'Quantity must be at least 1.');
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
    showToast('success', 'Success', 'Product removed from cart');
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      showToast('error', 'Error', 'Please select a product.');
      return;
    }
    if (productQuantity < 1) {
      showToast('error', 'Error', 'Please select a quantity greater than 1.');
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
    showToast('success', 'success', 'product added to cart');
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      showToast('success', 'Success', 'Cart saved successfully!');
    } catch (error) {
      console.error('שגיאה בשמירת העגלה:', error);
      showToast('error', 'Error', 'Error saving cart.');
    }
  };

  const handleCheckout = async () => {
    await saveCartToStorage();
    navigation.navigate('Supermarket');
    handleGlobalClick('שמירה');
  };
  
  const handleNavigate = (route) => {
    animatableRef.current
      .animate('fadeOutRight', 500)
      .then(() => {
        navigation.navigate(route);
      })
      .catch((err) => {
        console.error("Animation error:", err);
        navigation.navigate(route);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={item.quantity === '' ? '' : String(item.quantity)}
        onChangeText={(text) => {
          const newQuantity = text === '' ? '' : parseInt(text);
          if (newQuantity >= 1) {
            handleQuantityChange(item.id, newQuantity);
          }
        }}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Text style={styles.removeButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animatable.View
      ref={animatableRef}
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Your Shopping Cart</Text>
        <Text style={styles.subtitle}>
          You can see the list of products in the cart. Adding a product is done by clicking on Product Selections, selecting Like and then clicking on Add Product. To remove a product, click on the Remove button. To save, click on the dedicated button
        </Text>
        </View>
        <View style={[styles.row, { zIndex: 3000 }]}>
          <View style={styles.quantityWrapper}>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              placeholder="1"
              value={String(productQuantity)}
              onChangeText={(text) => setProductQuantity(parseInt(text) || 1)}
            />
          </View>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={open}
              value={selectedProduct}
              items={items}
              setOpen={(value) => {setOpen(value); handleGlobalClick();}}
              setValue={setSelectedProduct}
              setItems={setItems}
              placeholder="Select product"
              textStyle={{ textAlign: 'center', fontSize: 16 }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { zIndex: open ? 1 : 10 }]} 
          onPress={handleAddItem}
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
        <View style={[{ flex: 1 }, { zIndex: open ? 1 : 10 }]}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyCart}>Cart is empty</Text>}
            contentContainerStyle={styles.listContainer}
          />

          {cartItems.length > 0 && (
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Save</Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate('Supermarket')}>
              <Text style={styles.forwardButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Toast component */}
        <Toast />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    position: "relative",
    paddingHorizontal: 5,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
  },
  dropdownWrapper: {
    width: '70%',
  },
  quantityLabel: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    width: '100%',
    borderColor: 'gray',
    borderRadius: 5,
  },
  dropdownContainer: {
    width: '100%',
    borderColor: 'gray',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  },
  quantityInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: 'white',
    width: '60%',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginLeft: 70,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    marginLeft: 15,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    position: 'relative',
    zIndex: 1,
  },
  listContainer: {
    paddingBottom: 200, 
  },
  checkoutButton: {
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 5,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 150,
  },
  forwardButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 200,
  },
  forwardButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});

export default EditCartM2;