import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpg";
import image4 from "./assets/image4.jpg";
const testResults = [
  {
    title: "בדיקה כללית",
    images: Platform.OS === "web" 
      ? [image2, image3, image4] 
      : [require(image2), require(image3), require(image4)], 
  },
  {
    title: "בדיקת דם",
    images: Platform.OS === "web" 
      ? [image1] 
      : [require(image1)],
  },
];

const TestResultsScreen = ({ handleGlobalClick }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (images, title) => {
    setSelectedImages(images);
    setModalVisible(true);
    setCurrentIndex(0);
    handleGlobalClick(`Opening modal for: ${title}`);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImages([]);
    handleGlobalClick("Closing modal");
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < selectedImages.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Results</Text>

      {testResults.map((test, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => openModal(test.images, test.title)}
        >
          <Text style={styles.cardTitle}>{test.title}</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          <View style={styles.imageNavigation}>
            <TouchableOpacity onPress={prevImage} style={styles.navButton} disabled={currentIndex === 0}>
              <Text style={styles.navButtonText}>⬅️</Text>
            </TouchableOpacity>

            <Image
              source={Platform.OS === "web" ? { uri: selectedImages[currentIndex] } : selectedImages[currentIndex]}
              style={styles.image}
              resizeMode="contain"
            />

            <TouchableOpacity onPress={nextImage} style={styles.navButton} disabled={currentIndex === selectedImages.length - 1}>
              <Text style={styles.navButtonText}>➡️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  imageNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 30,
    color: "white",
  },
  image: {
    width: width * 0.9,
    height: 800,
    marginHorizontal: 10,
  },
});

export default TestResultsScreen;
