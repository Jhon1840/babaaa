// import React, { useEffect, useState } from 'react';
// import { View, Text, Modal, StyleSheet, ScrollView, Button, Alert } from 'react-native';
// import { Accelerometer } from 'expo-sensors';

// const ACCELERATION_THRESHOLD = 10.5; // Threshold for significant acceleration change (tweak based on testing)
// const BUFFER_DURATION = 2000; // Duration to keep data in buffer (2 seconds)

// const Chats = () => {
//   const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
//   const [dataBuffer, setDataBuffer] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleAcceleration = (data) => {
//     const { x, y, z } = data;
//     const now = Date.now();
//     const newData = { x, y, z, time: now };
//     let buffer = [...dataBuffer, newData];
//     // Remove data older than 2 seconds
//     buffer = buffer.filter(d => now - d.time <= BUFFER_DURATION);
//     setDataBuffer(buffer);

//     if (buffer.length > 1) {
//       let accumulatedChange = 0;
//       for (let i = 1; i < buffer.length; i++) {
//         const prev = buffer[i - 1];
//         const curr = buffer[i];
//         const delta = Math.sqrt(
//           Math.pow(curr.x - prev.x, 2) +
//           Math.pow(curr.y - prev.y, 2) +
//           Math.pow(curr.z - prev.z, 2)
//         );
//         accumulatedChange += delta;
//       }

//       if (accumulatedChange > ACCELERATION_THRESHOLD) {
//         setModalVisible(true); // Trigger modal or any other action when threshold is exceeded
//       }
//     }
//     setAccelerometerData(data);
//   };

//   useEffect(() => {
//     Accelerometer.setUpdateInterval(50); // Set update interval to 50ms for finer granularity
//     const subscription = Accelerometer.addListener(handleAcceleration);

//     return () => subscription.remove();
//   }, [dataBuffer]);

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
//             setModalVisible(!modalVisible);
//           }}
//         >
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <Text style={styles.modalText}>Significant Movement Detected!</Text>
//               <Button title="I need help!" onPress={() => setModalVisible(false)} />
//               <Button title="I'm okay, dismiss." onPress={() => setModalVisible(false)} />
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </View>
//   );
// };

// export default Chats;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dataText: {
//     marginBottom: 10,
//     fontSize: 16,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//     fontSize: 18,
//   }
// });

import { Box, Text } from "@gluestack-ui/themed";
import { ScrollView } from "moti";
import * as React from "react";
import { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LineChart from "react-native-simple-line-chart";
import { MotiView } from 'moti';

export default function App() {
  const [data, setData] = React.useState([]);
  const [timePassed, setTimePassed] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const beatInterval = 900;
      const peak = 100;
      const baseline = 50;
      let y;

      const phase = timePassed % beatInterval;
      if (phase < 50) {
        y = 45;
      } else if (phase < 150) {
        y = peak;
      } else if (phase < 200) {
        y = 0;
      } else if (phase < 250) {
        y = 65;
      } else if (phase < 300) {
        y = 45;
      } else {
        y = baseline;
      }

      const point = {
        y,
        x: now,
        extraData: {
          formattedValue: `${y.toFixed(0)} bpm`,
          formattedTime: new Date(now)
            .toISOString()
            .split("T")[1]
            .split(".")[0],
        },
      };

      setData((currentData) => [...currentData.slice(-50), point]);
      setTimePassed(timePassed + 50);
    }, 50);

    return () => clearInterval(interval);
  }, [timePassed]);

  return (
    <ScrollView
      contentContainerStyle={{
        marginHorizontal: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 200,
      }}
    >
      {[0, 1, 2, 3].map((item, index) => (
        <React.Fragment key={index}>
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 400, type: 'spring', duration: 250 }}
            style={{ width: '100%' }}
          >
            <Box
              bgColor="$white"
              width={"$full"}
              borderRadius="$2xl"
              paddingVertical="$10"
            >
              <Text
                paddingTop={"$4"}
                paddingHorizontal="$5"
                fontWeight="$bold"
                fontSize="$2xl"
                color={index === 0 ? "$green400" : "black"}
              >
                {index === 0 ? "Normal" : index === 1 ? "36 C" : index === 2 ? "98 Spo2" : "60 BPM"}
              </Text>
              <Text paddingTop={"$4"} paddingHorizontal="$5" fontWeight="$light">
                {index === 0 ? "Estado de Salud" : index === 1 ? "Temperatura" : index === 2 ? "Nivel de Oxigeno en la Sangre" : "Frecuencia Cardiaca"}
              </Text>
              {index === 3 && (
                <>
                  <Box height="$10" />
                  <GestureHandlerRootView>
                    <View>
                      <LineChart
                        lines={[
                          {
                            data,
                            lineColor: "red",
                            curve: "cardinal",
                            endPointConfig: {
                              color: "red",
                              radius: 5,
                              animated: true,
                            },
                            activePointComponent: (point) => (
                              <View
                                style={{
                                  backgroundColor: "red",
                                  padding: 10,
                                  borderRadius: 10,
                                }}
                              >
                                <Text style={{ color: "white" }}>
                                  {point?.extraData?.formattedValue}
                                </Text>
                                <Text style={{ color: "white" }}>
                                  {point?.extraData?.formattedTime}
                                </Text>
                              </View>
                            ),
                          },
                        ]}
                        backgroundColor="white"
                        height={200}
                        width={Dimensions.get("screen").width}
                      />
                    </View>
                  </GestureHandlerRootView>
                </>
              )}
            </Box>
          </MotiView>
          {index !== 3 && <Box height="$5" />}
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
