import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";

const games = [
  { id: "1", name: "Memory Game", link: "https://www.memozor.com/memory-games" },
  { id: "2", name: "Sudoku", link: "https://www.websudoku.com/" },
  { id: "3", name: "Trivia", link: "https://www.funtrivia.com/" },
  { id: "4", name: "Chess", link: "https://www.chess.com/play" },
  { id: "5", name: "Geography Quiz", link: "https://geoguessr.com/" },
];

const GamesPage = ({ handleGlobalClick }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isWebViewVisible, setWebViewVisible] = useState(false);

  const openGame = (url) => {
    handleGlobalClick(`Open game: ${url}`);

    if (Platform.OS === "web") {
      Linking.openURL(url);
    } else {
      setCurrentUrl(url);
      setWebViewVisible(true);
    }
  };

  const closeWebView = () => {
    setCurrentUrl("");
    setWebViewVisible(false);
    handleGlobalClick("Close game");
  };

  return (
    <View style={styles.container}>
      {isWebViewVisible ? (
        <View style={styles.webviewContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <WebView source={{ uri: currentUrl }} style={styles.webview} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Games</Text>
          <View style={styles.buttonRowContainer}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.card}
                onPress={() => openGame(game.link)}
              >
                <Text style={styles.cardTitle}>{game.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 20,
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
  webviewContainer: {
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
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
    marginTop: 80,
  },
});

export default GamesPage;
