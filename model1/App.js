import React, { useState,useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import BottomTaskTimer from './screens/Performance/PerformanceScript';
import SetupScreen from './screens/SetupScreen';
import PremissionScreen from './screens/PremissionsScreen';
import HomeScreen from './screens/HomeScreen';
import BankScreen from './screens/Bank/BankScreen';
import TransferScreen from './screens/Bank/TransferScreen';
import ContactBankerScreen from './screens/Bank/ContactBankerScreen';
import HealthFundScreen from './screens/HealthFund/HealthFundScreen';
import AppointmentScreen from './screens/HealthFund/ResevationScreen';
import TestResultsScreen from './screens/HealthFund/TestsResults';
import EmergencyPage from './screens/Emergency/EmergencyScreen';
import SuperMarketPage from './screens/SuperMarket/SuperMarketScreen';
import EditCart from './screens/SuperMarket/EditCart';
import EntertainmentPage from './screens/Entertainment/EntertainmentScreen';
import NewspapersPage from './screens/Entertainment/NewsPaperScreen';
import NewsChannelsPage from './screens/Entertainment/NewsChannelsScreen';
import GamesPage from './screens/Entertainment/GamesScreen';
import Intro from './screens/Intro';
import PerformanceScreen from './screens/Performance/PerformanceScreen';
import SetUp from './screens/Model2/SetupScreens/setUp';
import SetUp2 from './screens/Model2/SetupScreens/SetUp2';
import AsyncStorage from "@react-native-async-storage/async-storage";
import SetUp3 from './screens/Model2/SetupScreens/SetUp3';
import SetUp4 from './screens/Model2/SetupScreens/SetUp4';
import Premissions1 from './screens/Model2/PremissionsScreens/Premissions1';
import Premissions2 from './screens/Model2/PremissionsScreens/Premissions2';
import Premissions3 from './screens/Model2/PremissionsScreens/Premissions3';
import { UserProvider } from "./screens/Model2/userContext";
import Home1 from './screens/Model2/HomeScreens/Home1';
import Home2 from './screens/Model2/HomeScreens/Home2';
import Bankm2 from './screens/Model2/BankScreens/Bankm2';
import Transaction from './screens/Model2/BankScreens/Transaction';
import ContactBanker from './screens/Model2/BankScreens/ContactBanker';
import Health from './screens/Model2/HealthScreens/Health';
import Schedule from './screens/Model2/HealthScreens/Schedule';
import Results from './screens/Model2/HealthScreens/Results';
import Emergency from './screens/Model2/EmergencyScreens/Emergency';
import Supermarket from './screens/Model2/SupermarketScreens/Supermarket';
import EditCartM2 from './screens/Model2/SupermarketScreens/EditCartM2';
import PerformanceM2 from './screens/Model2/Performance/PerformanceM2';
import Entertainment from './screens/Model2/Entertainment/EntertainmentM2';
import NewsChannelsM2 from './screens/Model2/Entertainment/NewsChannelsM2';
import NewsPapersM2 from './screens/Model2/Entertainment/NewsPapersM2';
import GamesM2 from './screens/Model2/Entertainment/GamesM2';

const Stack = createStackNavigator();

export default function App() {
  const [globalTasks, setGlobalTasks] = useState([]);
  const [currentRoute, setCurrentRoute] = useState('');
  const [isTracking, setIsTracking] = useState(false); // Track whether tracking is active
  
  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared successfully");
      } catch (error) {
      }
    };

    clearStorage();
  }, []);
  const handleStateChange = (state) => {
    const route = state?.routes[state?.index];
    if (route?.name) {
      setCurrentRoute(route.name);
      updatePageCount(route.name);
    }
  };

  const handleGlobalClick = () => {
    if (!isTracking) return; 
    setGlobalTasks((prevTasks) => {
      if (prevTasks.length > 0) {
        const updatedTasks = [...prevTasks];
        const lastTask = updatedTasks[updatedTasks.length - 1];
        if (lastTask) {
          lastTask.clicks = (lastTask.clicks || 0) + 1;
        }
        return updatedTasks;
      }
      return prevTasks;
    });
  };
  
  const updatePageCount = (newRoute) => {
    setGlobalTasks((prevTasks) => {
      if (prevTasks.length > 0) {
        const updatedTasks = [...prevTasks];
        const lastTask = updatedTasks[updatedTasks.length - 1];
        if (lastTask) {
          lastTask.pagesChanged = (lastTask.pagesChanged || 0) + 1;
          console.log('Page changed to:', newRoute);
        }
        return updatedTasks;
      }
      return prevTasks;
    });
  };

  return (
    <UserProvider>
    <NavigationContainer onStateChange={handleStateChange}>
      <View
        style={styles.wrapper}
        onStartShouldSetResponder={() => true} 
        onResponderRelease={() => {
          handleGlobalClick(); 
        }}
        pointerEvents="box-none"
      >
      <Stack.Navigator initialRouteName="Intro" >
        <Stack.Screen name="Intro" options={{headerShown: false}}>
          {(props) => <Intro {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Setup">
          {(props) => <SetupScreen {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen
          name="Premission"
          options={{ headerLeft: null, gestureEnabled: false,headerShown: false }}
        >
          {(props) => (
            <PremissionScreen {...props} handleGlobalClick={handleGlobalClick} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Bank">
          {(props) => <BankScreen {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Performance">
          {() => (
            <PerformanceScreen
              globalTasks={globalTasks}
              setGlobalTasks={setGlobalTasks}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Transfer">
          {(props) => (
            <TransferScreen {...props} handleGlobalClick={handleGlobalClick} />
          )}
        </Stack.Screen>
        <Stack.Screen name="ContactBanker">
          {(props) => (
            <ContactBankerScreen {...props} handleGlobalClick={handleGlobalClick} />
          )}
        </Stack.Screen>
        <Stack.Screen name="HealthFund" >
          {(props) => <HealthFundScreen {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Reservation" >
          {(props) => <AppointmentScreen {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="TestResults" >
          {(props) => <TestResultsScreen {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Emergency" >
          {(props) => (
            <EmergencyPage {...props} handleGlobalClick={handleGlobalClick} />
          )}
        </Stack.Screen>
        <Stack.Screen name="SuperMarket" options={{headerShown: false}}>
          {(props) => <SuperMarketPage {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="EditCart" options={{headerShown: false}}>
          {(props) => <EditCart {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Entertainment" options={{headerShown: false}}>
          {(props) => (
            <EntertainmentPage {...props} handleGlobalClick={handleGlobalClick} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Newspaper" >
          {(props) => <NewspapersPage {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="NewsChannels" >
          {(props) => <NewsChannelsPage {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Games">
          {(props) => <GamesPage {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="SetUp" options={{headerShown: false}}>
          {(props) => <SetUp {...props} handleGlobalClick={handleGlobalClick}  />}
        </Stack.Screen>
        <Stack.Screen name="SetUp2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <SetUp2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="SetUp3" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <SetUp3 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="SetUp4" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <SetUp4 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Premissions1" options={{headerShown: false}}>
          {(props) => <Premissions1 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Premissions2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Premissions2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Premissions3" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Premissions3 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Home1" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Home1 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Home2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Home2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Bankm2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Bankm2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Transaction" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Transaction {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="ContactBankerM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <ContactBanker {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Health" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Health {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Schedule" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Schedule {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Results" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Results {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="EmergencyM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Emergency {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="Supermarket" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Supermarket {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="EditCartM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <EditCartM2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen
          name="PerformanceM2"
          options={{
            gestureEnabled: false,
            headerLeft: () => null,
            headerShown: false,
          }}
        >
          {(props) => (
            <PerformanceM2
              {...props} 
              globalTasks={globalTasks}
              setGlobalTasks={setGlobalTasks}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EntertainmentM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <Entertainment {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="NewsChannelsM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <NewsChannelsM2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="NewsPapersM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <NewsPapersM2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
        <Stack.Screen name="GamesM2" options={{gestureEnabled: false,headerLeft: () => null,headerShown: false}}>
          {(props) => <GamesM2 {...props} handleGlobalClick={handleGlobalClick} />}
        </Stack.Screen>
      </Stack.Navigator>
        <BottomTaskTimer
          globalTasks={globalTasks}
          setGlobalTasks={setGlobalTasks}
          currentRoute={currentRoute}
          setTrackingStatus={setIsTracking}
        />
      </View>
    </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
