import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';

const TestResultsScreen = ({ handleGlobalClick }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const testResults = [
    {
      title: 'בדיקה כללית',
      images: [
        require('./assets/image2.jpg'),
        require('./assets/image3.jpg'),
        require('./assets/image4.jpg'),
      ],
    },
    {
      title: 'בדיקת דם',
      images: [
        require('./assets/image1.jpg'),
      ],
    },
  ];

  const openModal = (images, title) => {
    setSelectedImages(images);
    setModalVisible(true);
    handleGlobalClick(`פתיחת מודאל עבור: ${title}`);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImages([]);
    handleGlobalClick('סגירת מודאל');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>תשובות בדיקות</Text>

      {testResults.map((test, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => openModal(test.images, test.title)}
        >
          <Text style={styles.cardTitle}>{test.title}</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeModal}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>סגור</Text>
          </TouchableOpacity>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageWrapper: {
    width: 800,
    height: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 800,
    height: 900,
  },
});

export default TestResultsScreen;
