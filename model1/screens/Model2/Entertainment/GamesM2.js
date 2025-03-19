import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import * as Animatable from "react-native-animatable";

const games = [
    { id: '1', name: 'משחק זיכרון', backgroundColor:'#ffd358', link: 'https://www.memozor.com/memory-games' },
    { id: '2', name: 'סודוקו', backgroundColor:'#809682', link: 'https://www.websudoku.com/' },
    { id: '3', name: 'טריוויה', backgroundColor:'#193952', link: 'https://www.funtrivia.com/' },
    { id: '4', name: 'שחמט', backgroundColor:'#fbe9d5', link: 'https://www.chess.com/play' },
    { id: '5', name: 'חידון גיאוגרפיה', backgroundColor:'#b79d7f', link: 'https://geoguessr.com/' },
];

const GamesM2 = ({ handleGlobalClick, navigation }) => {
  const animatableRef = useRef(null);

  const openBrowser = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
    handleGlobalClick('Opened external browser for: ' + url);
  };

  const handleNavigate = (route, direction) => {
    if (direction === "forward") {
      animatableRef.current
        .animate("fadeOutLeft", 500)
        .then(() => navigation.navigate(route));
    } else if (direction === "back") {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => navigation.navigate(route));
    }
  };

  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>משחקים</Text>
          <Text style={styles.subtitle}>על מנת לשחק במשחקים לחץ על משחק שברצונך לשחק</Text>
          <View style={styles.buttonRowContainer}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={[styles.card, { backgroundColor: game.backgroundColor }]}
                onPress={() => openBrowser(game.link)}
              >
                <Text style={styles.cardTitle}>{game.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardButton, { backgroundColor: 'orange' }]}
              onPress={() => handleNavigate("NewsPapersM2", "forward")}
            >
              <Text style={styles.forwardButtonText}>עיתונים</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.forwardButton, { backgroundColor: 'green' }]}
              onPress={() => handleNavigate("Home1", "back")}
            >
              <Text style={styles.forwardButtonText}>מסך בית</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%',
    padding: 30,
    marginTop: 30,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 60,
  },
  forwardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 230,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default GamesM2;
