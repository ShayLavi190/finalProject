import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../server/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { useUser } from "../userContext";
import Toast from "react-native-toast-message";

const PerformanceM2 = ({ globalTasks = [], setGlobalTasks, navigation }) => {
  const { user } = useUser();
  const [isResetting, setIsResetting] = useState(false);
  const animatableRef = useRef(null);

  const calculateGraphData = () => {
    const taskLabels = [];
    const pagesChanged = [];
    const durations = [];
    const clicks = [];
    const indicators = [];

    const taskOptimalModel1 = [
      { clicks: 26, pagesChanges: 2 },
      { clicks: 4, pagesChanges: 2 },
      { clicks: 3, pagesChanges: 2 },
    ];

    globalTasks.forEach((task, index) => {
      const { pagesChanged: pages, duration, clicks: taskClicks } = task;
      taskLabels.push(`Task ${index + 1}`);
      pagesChanged.push(pages || 0);
      durations.push(duration || 0);
      clicks.push(taskClicks || 0);
      const pageRatio = pages / (taskOptimalModel1[index]?.pagesChanges || 1);
      const clickRatio = taskClicks / (taskOptimalModel1[index]?.clicks || 1);
      indicators.push((pageRatio + clickRatio) / 2);
    });

    return { taskLabels, pagesChanged, durations, clicks, indicators };
  };

  const { taskLabels, pagesChanged, durations, clicks, indicators } =
    calculateGraphData();

  const resetPerformance = async () => {
    if (!user?.id) {
      Toast.show({ type: "error", text1: "Error", text2: "User ID not found." });
      return;
    }

    if (isResetting) return;
    setIsResetting(true);

    try {
      console.log("🔹 Resetting performance data in Firebase...");

      const performanceCollection = collection(db, "performance");
      let newUserId = user.id;
      let counter = 1;

      while (true) {
        const existingDoc = await getDoc(doc(performanceCollection, newUserId));
        if (!existingDoc.exists()) {
          break;
        }
        counter++;
        newUserId = `${user.id}_${counter}`;
      }

      console.log("💾 Storing performance data under userId:", newUserId);

      const performanceRef = doc(performanceCollection, newUserId);
      await setDoc(performanceRef, {
        tasks: globalTasks,
        timestamp: new Date().toISOString(),
      });

      setGlobalTasks([]);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Performance data saved as ${newUserId}`,
      });

    } catch (error) {
      console.error("❌ Error resetting performance data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to reset performance data.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Warning",
      "Are you sure you want to reset performance data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: resetPerformance },
      ]
    );
  };

  const handleNavigate = (route) => {
    if (!navigation) {
      console.error("Navigation prop is missing.");
      return;
    }

    if (animatableRef.current) {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => navigation.navigate(route))
        .catch((error) => {
          console.error("Animation error:", error);
          navigation.navigate(route);
        });
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <Animatable.View ref={animatableRef} style={{ flex: 1 }} animation="fadeInDown" duration={2000}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Performance Metrics</Text>
          </View>

          {taskLabels.length > 0 ? (
            <>
              <Graph title="Number of Page Changes" labels={taskLabels} data={pagesChanged} />
              <Graph title="Number of Clicks" labels={taskLabels} data={clicks} />
              <Graph title="Task Duration (seconds)" labels={taskLabels} data={durations} type="line" />
              <Graph title="Performance Indicator" labels={taskLabels} data={indicators} />
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No performance data available.</Text>
            </View>
          )}

          <View style={styles.resetButtonContainer}>
            <Button title="Reset Data" onPress={handleReset} color="#f4511e" disabled={isResetting} />
          </View>
          <View style={styles.forwardButtonContainer}>
            <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home1")}>
              <Text style={styles.forwardButtonText}>חזור</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Toast />
      </SafeAreaView>
    </Animatable.View>
  );
};

const Graph = ({ title, labels, data, type = "bar" }) => (
  <View style={styles.graphContainer}>
    <Text style={styles.graphDescription}>{title}</Text>
    {type === "bar" ? (
      <BarChart
        data={{ labels, datasets: [{ data }] }}
        width={Dimensions.get("window").width - 40}
        height={170}
        chartConfig={chartConfig}
        style={styles.graphStyle}
      />
    ) : (
      <LineChart
        data={{ labels, datasets: [{ data }] }}
        width={Dimensions.get("window").width - 40}
        height={170}
        chartConfig={chartConfig}
        style={styles.graphStyle}
      />
    )}
  </View>
);

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  noDataContainer: {
    marginVertical: 50,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
  },
  resetButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  forwardButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    width: 200,
    marginTop: 20,
    alignItems: "center",
},

  forwardButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forwardButtonContainer: {
    alignItems:"flex-start",
    marginTop: 20,
  },
});

export default PerformanceM2;
