import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';

const newspapers = [
  { id: '1', name: 'הארץ', link: 'https://www.haaretz.co.il/' },
  { id: '2', name: 'ידיעות אחרונות', link: 'https://www.yediot.co.il/' },
  { id: '3', name: 'מעריב', link: 'https://www.maariv.co.il/' },
  { id: '4', name: 'The Marker', link: 'https://www.themarker.com/' },
  { id: '5', name: 'גלובס', link: 'https://www.globes.co.il/' },
];

const NewspapersPage = ({ handleGlobalClick }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openWebView = (url) => {
    setCurrentUrl(url);
    setWebViewVisible(true);
    handleGlobalClick?.(`Opened WebView for: ${url}`);
  };

  const closeWebView = () => {
    setCurrentUrl('');
    setWebViewVisible(false);
    handleGlobalClick?.('Closed WebView');
  };

  return (
    <View style={styles.container}>
      {isWebViewVisible ? (
        <View style={styles.webviewContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
            <Text style={styles.closeButtonText}>סגור</Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          )}
          <WebView
            source={{ uri: currentUrl }}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>עיתונים</Text>
          <View style={styles.buttonRowContainer}>
            {newspapers.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => openWebView(item.link)}
                accessible={true}
                accessibilityLabel={`פתח ${item.name}`}
              >
                <Text style={styles.cardTitle}>{item.name}</Text>
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
  },
  buttonRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '48%', 
    backgroundColor: '#5d9592',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: '#D9D4D0',
    borderRadius: 5,
    elevation: 5,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  webview: {
    flex: 1,
    marginTop: 100, 
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default NewspapersPage;
