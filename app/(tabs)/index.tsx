import React, { useEffect, useState } from 'react';
import { Box, Text } from "@gluestack-ui/themed";
import { ScrollView, View, Dimensions, StyleSheet, Modal, Alert, Button } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LineChart from 'react-native-simple-line-chart';
import { MotiView } from 'moti';
import { supabase } from "@/utils/supabase";
import { Linking } from 'react-native';
import { TouchableOpacity} from 'react-native';

const ACCELERATION_THRESHOLD = 3.0;
const BUFFER_DURATION = 2000;

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [timePassed, setTimePassed] = useState(0);
  const [spo2, setSpo2] = useState(98);
  const [bpm, setBpm] = useState(56);
  const [accelerationData, setAccelerationData] = useState([]);
  const   handleEmergencyCall = () => {
    Linking.openURL(`tel:911`)
      .catch(err => console.error('An error occurred', err));
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const beatInterval = (bpm / 60) * 1000;
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
          formattedTime: new Date(now).toISOString().split("T")[1].split(".")[0],
        },
      };

      setData(currentData => [...currentData.slice(-50), point]);
      setTimePassed(timePassed + 50);
    }, 50);

    return () => clearInterval(interval);
  }, [bpm, timePassed]);

  useEffect(() => {
    const alertSubscription = supabase
      .channel('alerts')
      .on('broadcast', { event: 'movement-alert' }, (payload) => {
        if (payload.payload.alert) {
          console.log("Alerta de movimiento brusco detectada!");
          setModalVisible(true);
        }
      })
      .subscribe();

    const subscription = supabase
      .channel('room-1')
      .on('broadcast', { event: 'new-data' }, (payload) => {
        const { ax, ay, az } = payload.payload.accelerometerGyroscopeData;
        const newData = { ax, ay, az, time: new Date().getTime() };

        setSpo2(payload.payload.heartRateSpo2Data.spo2);
        setBpm(payload.payload.heartRateSpo2Data.bpm);
      })
      .subscribe();

    return () => {
      alertSubscription.unsubscribe();
      subscription.unsubscribe();
    };
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
      <TouchableOpacity style={styles.button} onPress={handleEmergencyCall}>
        <Text style={styles.buttonText}>Llamar Emergencias!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLightBlue} onPress={() => setModalVisible(false)}>
        <Text style={styles.buttonText}>Todo está Bien</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>


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
                {index === 0 ? "Normal" : index === 1 ? "36 C" : index === 2 ? spo2 : bpm}
              </Text>
              <Text paddingTop={"$4"} paddingHorizontal="$5" fontWeight="$light">
                {index === 0 ? "Estado de Salud" : index === 1 ? "Temperatura" : index === 2 ? "Nivel de Oxígeno en la Sangre" : "Frecuencia Cardíaca"}
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
  },
  button: {
    backgroundColor: "#2196F3", 
    borderRadius: 20,          
    padding: 10,                
    elevation: 2,              
    marginTop: 10,              
    width: 200                 
  },
  buttonText: {
    color: 'white',           
    fontWeight: 'bold',        
    textAlign: 'center',        
    fontSize: 16,              
  },
  buttonLightBlue: {
    backgroundColor: "#64B5F6", 
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: 200
  },

  
});
