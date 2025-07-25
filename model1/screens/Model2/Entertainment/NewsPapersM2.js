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

const newspapers = [
  { id: '1', name: 'Haaretz', backgroundColor: '#00315c', link: 'https://www.haaretz.co.il/' },
  { id: '2', name: 'Yediot Ahronoth', backgroundColor: '#b2e1d6', link: 'https://www.yediot.co.il/' },
  { id: '3', name: 'Maariv', backgroundColor: '#5486b4', link: 'https://www.maariv.co.il/' },
  { id: '4', name: 'The Marker', backgroundColor: '#ded0ab', link: 'https://www.themarker.com/' },
  { id: '5', name: 'Globes', backgroundColor: '#ff8c00', link: 'https://www.globes.co.il/' },
];

const NewsPapersM2 = ({ handleGlobalClick, navigation }) => {
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
        <Text style={styles.title}>Newspapers</Text>
        <Text style={styles.subtitle}>To read newspapers, click on the newspaper to read. To move to the other screens, click on the Games button</Text>
          <View style={styles.buttonRowContainer}>
            {newspapers.map((paper) => (
              <TouchableOpacity
                key={paper.id}
                style={[styles.card, { backgroundColor: paper.backgroundColor }]}
                onPress={() => openBrowser(paper.link)}
              >
                <Text style={styles.cardTitle}>{paper.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardButton, { backgroundColor: 'orange' }]}
              onPress={() => handleNavigate("GamesM2", "forward")}
            >
              <Text style={styles.forwardButtonText}>Games</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.forwardButton, { backgroundColor: 'green' }]}
              onPress={() => handleNavigate("NewsChannelsM2", "back")}
            >
              <Text style={styles.forwardButtonText}>News Channels</Text>
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
    marginTop: 30,
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
    marginTop: 50,
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

export default NewsPapersM2;
