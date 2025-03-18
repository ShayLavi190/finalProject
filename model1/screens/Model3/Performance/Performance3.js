import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../server/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import Toast from 'react-native-toast-message';
import { useUser } from "../../Model2/userContext";

const Performance3 = ({ globalTasks = [], setGlobalTasks, navigation }) => {
  const { user, updateUser } = useUser();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width - 40);
  const [chartReady, setChartReady] = useState(false);
  
  // Ensure charts render with valid dimensions
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const calculateGraphData = () => {
    console.log("globaltasks: ", globalTasks);
    const taskLabels = [];
    const pagesChanged = [];
    const durations = [];
    const clicks = [];
    const indicators = [];
    const taskOptimalModel3 = [
      { clicks: 36, pagesChanges: 7 },
      { clicks: 10, pagesChanges: 9 },
      { clicks: 6, pagesChanges: 5 },
    ];

    globalTasks.forEach((task, index) => {
      const { pagesChanged: pages, duration, clicks: taskClicks } = task;
      taskLabels.push(`Task ${index + 1}`);
      pagesChanged.push(pages || 0);
      durations.push(duration || 0);
      clicks.push(taskClicks || 0);
      const pageRatio = pages / taskOptimalModel3[index]?.pagesChanges || 0;
      const clickRatio = taskClicks / taskOptimalModel3[index]?.clicks || 0;
      indicators.push((pageRatio + clickRatio) / 2);
    });

    // Ensure there's always data to render - prevent empty chart errors
    if (taskLabels.length === 0) {
      taskLabels.push("No Data");
      pagesChanged.push(0);
      durations.push(0);
      clicks.push(0);
      indicators.push(0);
    }

    return { taskLabels, pagesChanged, durations, clicks, indicators };
  };

  const { taskLabels, pagesChanged, durations, clicks, indicators } =
    calculateGraphData();

  const resetPerformance = async () => {
    try {
      const userId = user.id;
      if (!userId) throw new Error("User ID not found.");

      const performanceData = globalTasks.map((task, index) => ({
        ...task,
        name: `Task ${index + 1}`,
        timestamp: task.timestamp || new Date().toISOString(),
      }));

      const performanceRef = doc(collection(db, "performance"), userId);
      await setDoc(performanceRef, { tasks: performanceData });

      setGlobalTasks([]);
      setConfirmModalVisible(false);
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Performance data saved and tasks reset.',
        position: 'bottom',
        visibilityTime: 4000,
      });
    } catch (error) {
      console.error("Error resetting performance:", error);
      setConfirmModalVisible(false);
      
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save performance data.',
        position: 'bottom',
        visibilityTime: 4000,
      });
    }
  };

  const handleReset = () => {
    setConfirmModalVisible(true);
  };

  const handleNavigate = (route) => {
    if (!navigation) {
      console.error(
        "Navigation prop is missing. Ensure the component is wrapped in a navigator."
      );
      return;
    }

    if (animatableRef.current) {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => {
          navigation.navigate(route);
        })
        .catch((error) => {
          console.error("Animation error:", error);
          navigation.navigate(route); // Fallback navigation
        });
    } else {
      console.warn(
        "Animation reference is null. Navigating without animation."
      );
      navigation.navigate(route);
    }
  };

  const animatableRef = useRef(null);
  const containerRef = useRef(null);

  // Measure container width to ensure charts have valid width
  const onContainerLayout = () => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width) => {
        const newWidth = width - 40;
        if (newWidth > 0) {
          setChartWidth(newWidth);
        }
      });
    }
  };

  // Ensure we have valid fallback data for charts
  const fallbackData = {
    labels: ["No Data"],
    datasets: [{ data: [0] }]
  };

  // Render charts only when ready and with valid data
  const renderCharts = () => {
    if (!chartReady) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Preparing charts...</Text>
        </View>
      );
    }

    const chartData = {
      pagesChanged: {
        labels: taskLabels,
        datasets: [{ data: pagesChanged.length > 0 ? pagesChanged : [0] }]
      },
      clicks: {
        labels: taskLabels,
        datasets: [{ data: clicks.length > 0 ? clicks : [0] }]
      },
      durations: {
        labels: taskLabels,
        datasets: [{ data: durations.length > 0 ? durations : [0] }]
      },
      indicators: {
        labels: taskLabels,
        datasets: [{ data: indicators.length > 0 ? indicators : [0] }]
      }
    };

    return (
      <>
        <View style={styles.graphContainer}>
          <Text style={styles.graphDescription}>
            Number of Page Changes
          </Text>
          <BarChart
            data={chartData.pagesChanged}
            width={chartWidth}
            height={170}
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.graphStyle}
            withInnerLines={false}
          />
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.graphDescription}>Number of Clicks</Text>
          <BarChart
            data={chartData.clicks}
            width={chartWidth}
            height={170}
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.graphStyle}
            withInnerLines={false}
          />
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.graphDescription}>
            Task Duration (seconds)
          </Text>
          <LineChart
            data={chartData.durations}
            width={chartWidth}
            height={170}
            yAxisSuffix=""
            chartConfig={{
              ...chartConfig,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={styles.graphStyle}
            withInnerLines={false}
          />
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.graphDescription}>
            Performance Indicator
          </Text>
          <BarChart
            data={chartData.indicators}
            width={chartWidth}
            height={170}
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.graphStyle}
            withInnerLines={false}
          />
        </View>
      </>
    );
  };

  return (
    <Animatable.View
      ref={animatableRef}
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
        <View 
          ref={containerRef} 
          style={{ flex: 1 }} 
          onLayout={onContainerLayout}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Performance Metrics</Text>
            </View>

            {globalTasks.length > 0 ? (
              renderCharts()
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>
                  No performance data available.
                </Text>
              </View>
            )}

            <View style={styles.resetButtonContainer}>
              <Button title="Reset Data" onPress={handleReset} color="#f4511e" />
            </View>
            <TouchableOpacity
              style={styles.forwardButton}
              onPress={() => handleNavigate("Home13")}
            >
              <Text style={styles.forwardButtonText}>חזור</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
      
      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Reset Data</Text>
            <Text style={styles.modalText}>Are you sure you want to reset performance data?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={resetPerformance}
              >
                <Text style={styles.textStyle}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Toast component */}
      <Toast />
    </Animatable.View>
  );
};

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "5", strokeWidth: "2", stroke: "#ffa726" },
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#f2f2f2",
  },
  titleContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  graphContainer: {
    marginBottom: 20,
    alignItems: "center",
    height: 220,
  },
  graphDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  graphStyle: {
    borderRadius: 16,
    marginVertical: 10,
    paddingRight: 15,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 30,
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
    alignSelf: "center",
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
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonCancel: {
    backgroundColor: "#9e9e9e",
  },
  buttonConfirm: {
    backgroundColor: "#f4511e",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Performance3;