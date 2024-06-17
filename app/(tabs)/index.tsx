import { Box, Text } from "@gluestack-ui/themed";
import { ScrollView } from "moti";
import * as React from "react";
import { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet, Modal, Alert, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LineChart from "react-native-simple-line-chart";
import { MotiView } from 'moti';
import { supabase } from "@/utils/supabase";

const ACCELERATION_THRESHOLD = 3.0;
const BUFFER_DURATION = 2000; 

export default function App() {
  const [data, setData] = React.useState([]);
  const [timePassed, setTimePassed] = React.useState(0);
  const [spo2, setSpo2] = useState(98); 
  const [bpm, setBpm] = useState(56);
  const [modalVisible, setModalVisible] = useState(false);
  const [accelerationData, setAccelerationData] = useState([]);


  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const beatInterval = (bpm/60)*1000;
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

  useEffect(() => {
    const subscription = supabase.channel('room-1')
      .on('broadcast', { event: 'new-data' }, (payload) => {
        const { ax, ay, az } = payload.payload.accelerometerGyroscopeData;
        const newData = { ax, ay, az, time: new Date().getTime() };
  
        setAccelerationData(current => {
          // Filter to keep only recent data within the BUFFER_DURATION
          const filteredData = current.filter(d => newData.time - d.time <= BUFFER_DURATION);
  
          // Calculate accumulatedChange if there's enough data
          let accumulatedChange = 0;
          for (let i = 1; i < filteredData.length; i++) {
            const prev = filteredData[i - 1];
            const curr = filteredData[i];
            accumulatedChange += Math.sqrt(
              Math.pow(curr.ax - prev.ax, 2) +
              Math.pow(curr.ay - prev.ay, 2) +
              Math.pow(curr.az - prev.az, 2)
            );
          }
  
          // Trigger modal if accumulatedChange exceeds threshold
          if (accumulatedChange > ACCELERATION_THRESHOLD) {
            console.log("Threshold exceeded, showing modal.");
            setModalVisible(true);
          }
  
          // Add new data to the buffer
          return [...filteredData, newData];
        });
  
        setSpo2(payload.payload.heartRateSpo2Data.spo2);
        setBpm(payload.payload.heartRateSpo2Data.bpm);
      })
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);
  
  

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
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Movimiento Significativo Detectado!</Text>
                <Button title="Llamar Emergencias!" onPress={() => setModalVisible(false)} />
                <Button title="Todo esta Bien" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
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
                {index === 0 ? "Normal" : index === 1 ? "36 C" : index === 2 ? spo2 : bpm}
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
  containerModal: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataText: {
    marginBottom: 10,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  }
})
