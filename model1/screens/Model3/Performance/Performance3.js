import React, { useState, useRef } from "react";
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
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../server/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";
import Toast from "react-native-toast-message";

const Performance3 = ({ globalTasks = [], setGlobalTasks, navigation }) => {
  const { user } = useUser();
  const [isResetting, setIsResetting] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const animatableRef = useRef(null);

  const calculateGraphData = () => {
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
      const pageRatio = pages / (taskOptimalModel3[index]?.pagesChanges || 1);
      const clickRatio = taskClicks / (taskOptimalModel3[index]?.clicks || 1);
      indicators.push((pageRatio + clickRatio) / 2);
    });

    return { taskLabels, pagesChanged, durations, clicks, indicators };
  };

  const { taskLabels, pagesChanged, durations, clicks, indicators } =
    calculateGraphData();

  const resetPerformance = async () => {
    if (!user?.id) {
      // Close modal first
      setConfirmModalVisible(false);
      
      // Show error toast
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "שגיאה",
        text2: "מזהה משתמש לא נמצא",
        visibilityTime: 4000,
        autoHide: true,
      });
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
      setConfirmModalVisible(false);

      // Show success toast
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "הצלחה",
        text2: `נתוני הביצועים נשמרו בהצלחה כ-${newUserId}`,
        visibilityTime: 4000,
        autoHide: true,
      });

    } catch (error) {
      console.error("❌ Error resetting performance data:", error);
      setConfirmModalVisible(false);
      
      // Show error toast
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "שגיאה",
        text2: "אירעה שגיאה באיפוס נתוני הביצועים",
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleReset = () => {
    setConfirmModalVisible(true);
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
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator>
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
            <TouchableOpacity style={styles.forwardButton} onPress={() => handleNavigate("Home13")}>
              <Text style={styles.forwardButtonText}>חזור</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        {/* Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>אזהרה</Text>
              <Text style={styles.modalText}>האם אתה בטוח שברצונך לאפס את נתוני הביצועים?</Text>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={styles.textStyle}>ביטול</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={resetPerformance}
                  disabled={isResetting}
                >
                  <Text style={styles.textStyle}>אפס</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        
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
    marginBottom: 2,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  graphContainer: {
    marginBottom: 2,
    alignItems: "center",
  },
  graphDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  graphStyle: {
    borderRadius: 16,
    marginVertical: 10,
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
    marginTop: 1,
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
    alignItems: "flex-start",
    marginTop: 20,
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