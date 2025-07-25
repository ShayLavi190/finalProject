import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";

const newspapers = [
  { id: "1", name: "Haaretz", link: "https://www.haaretz.co.il/" },
  { id: "2", name: "Yediot Ahronot", link: "https://www.yediot.co.il/" },
  { id: "3", name: "Maariv", link: "https://www.maariv.co.il/" },
  { id: "4", name: "The Marker", link: "https://www.themarker.com/" },
  { id: "5", name: "Globs", link: "https://www.globes.co.il/" },
];

const NewspapersPage = ({ handleGlobalClick }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openNewspaper = (url) => {
    handleGlobalClick(`Open NewsPapr: ${url}`);

    if (Platform.OS === "web") {
      Linking.openURL(url);
    } else {
      setCurrentUrl(url);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    handleGlobalClick("Close Newspaper");
    setModalVisible(false);
    setCurrentUrl("");

    Toast.show({
      type: "success",
      text1: "Closing Newspaper",
      text2: "The newspaper has been closed successfully.",
      visibilityTime: 2000,
      position: "top",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Newspapers</Text>
        <View style={styles.buttonRowContainer}>
          {newspapers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => openNewspaper(item.link)}
              accessible={true}
              accessibilityLabel={`Open ${item.name}`}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {Platform.OS !== "web" && (
        <Modal visible={isModalVisible} transparent={false} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            {loading && (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            )}
            <WebView
              source={{ uri: currentUrl }}
              style={styles.webview}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>
        </Modal>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: "48%",
    backgroundColor: "#5d9592",
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: "#D9D4D0",
    borderRadius: 5,
    elevation: 5,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  webview: {
    flex: 1,
    marginTop: 100,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default NewspapersPage;
