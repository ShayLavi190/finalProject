import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import products from "../../SuperMarket/products";
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import LottieView from "lottie-react-native";
import { useUser } from "../../Model2/userContext";
import { Audio } from "expo-av"; // Added Audio import

const EditCart3 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const animatableRef = useRef(null);
  const [cartItems, setCartItems] = user.cart
    ? useState(user.cart)
    : useState([
        { id: "1", name: "חלב", quantity: 1 },
        { id: "2", name: "לחם", quantity: 2 },
        { id: "3", name: "ביצים", quantity: 1 },
      ]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  // Added audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to stop audio playback
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      Alert.alert("שגיאה", "הכמות חייבת להיות לפחות 1.");
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
    stopAudio(); // Stop audio when removing item

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    handleGlobalClick(`הסרת פריט ${id}`);
  };

  // Updated to handle audio playback
  const handleLottiePress = async () => {
    if (sound && isPlaying) {
      // If playing, pause the audio
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      // If paused, resume playing
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      // Load and play new sound
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../../../assets/Recordings/editCart.mp3"), // Make sure this file exists
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        Alert.alert("שגיאה בהפעלת ההקלטה", "לא ניתן להפעיל את ההקלטה כרגע.");
      }
    }
  };

  const handleAddItem = () => {
    stopAudio(); // Stop audio when adding item

    if (!selectedProduct) {
      Alert.alert("שגיאה", "אנא בחר מוצר.");
      return;
    }
    if (productQuantity < 1) {
      Alert.alert("שגיאה", "אנא בחר כמות גדולה מ-1.");
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
    setSelectedProduct("");
    setProductQuantity(1);
    handleGlobalClick(`הוספת פריט ${selectedProduct}`);
  };

  const handleCheckout = () => {
    stopAudio(); // Stop audio when checking out

    Alert.alert("הצלחה", "העגלה נשמרה בהצלחה !");
    updateUser({ ...user, cart: cartItems });
    handleGlobalClick("עריכה בוצעה");
  };

  const handleNavigate = (route) => {
    stopAudio(); // Stop audio when navigating

    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => {
        navigation.navigate(route);
      })
      .catch((err) => {
        console.error("Animation error:", err);
        navigation.navigate(route);
      });
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={item.quantity === "" ? "" : String(item.quantity)}
        onChangeText={(text) => {
          const newQuantity = text === "" ? "" : parseInt(text);
          if (newQuantity >= 1) {
            handleQuantityChange(item.id, newQuantity);
          }
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
    <Animatable.View
      ref={animatableRef}
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>עגלת הקניות שלך</Text>
          <Text style={styles.subtitle}>
            ניתן לראות את רשימת המוצרים בסל. הוספת מוצר היא דרך לחיצה על בחירות
            מוצר, בחירת כמו ואז לחיצה על הוספת מוצר. כדי להסידר מוצר יש ללחות על
            כפתור הסר. לתשלום לוחצים על הכפתור היעודי
          </Text>
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            placeholder="כמות"
            value={String(productQuantity)}
            onChangeText={(text) => setProductQuantity(parseInt(text) || "")}
          />
          <DropDownPicker
            open={open}
            value={selectedProduct}
            items={products}
            setOpen={(value) => {
              setOpen(value);
              handleGlobalClick();
            }}
            setValue={setSelectedProduct}
            placeholder="בחר מוצר"
            textStyle={{ textAlign: "center", fontSize: 16 }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>הוסף מוצר</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyCart}>העגלה ריקה</Text>
            }
            contentContainerStyle={styles.listContainer}
          />

          {cartItems.length > 0 && (
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>שמירה</Text>
            </TouchableOpacity>
          )}
          <View>
            <TouchableOpacity
              style={styles.lottieButton}
              onPress={handleLottiePress}
            >
              <LottieView
                source={require("../SetupScreens/robot.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.forwardButton}
              onPress={() => handleNavigate("Supermarket3")}
            >
              <Text style={styles.forwardButtonText}>שירותי סופרמרקט</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  pickerContainer: {
    marginRight: 10,
  },
  dropdown: {
    width: "85%",
    borderColor: "gray",
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  dropdownContainer: {
    width: "70%",
    borderColor: "gray",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  quantityInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: "white",
    width: "10%",
    marginRight: 30,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemName: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
    marginLeft: 70,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    marginLeft: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  listContainer: {
    paddingBottom: 200,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  checkoutButton: {
    backgroundColor: "#5cb85c",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 5,
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 180,
  },
  forwardButton: {
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 200,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyCart: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  lottieButton: {
    position: "absolute",
    top: 40,
    left: 0,
    width: 300,
    height: 300,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default EditCart3;
