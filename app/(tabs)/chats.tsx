import React, { useEffect, useState } from "react";
import { Modal, TouchableOpacity, Share, View as RNView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Box, HStack, Text, VStack, Button, ButtonText } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, View } from "moti";
import { supabase } from "@/utils/supabase";

const Ubication = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showCardInfo, setShowCardInfo] = useState(false);
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const subscription = supabase.channel('room-1')
      .on('broadcast', { event: 'new-data' }, (payload) => {
        console.log(payload.payload.accelerometerGyroscopeData);
        setLatitud(payload.payload.accelerometerGyroscopeData.latitude);
        setLongitud(payload.payload.accelerometerGyroscopeData.longitude);
      })
      .subscribe();

    const timeout = setTimeout(() => {
      if (latitud === 0 && longitud === 0) {
        setModalVisible(true);
      }
    }, 5000); // Show modal if no location data is received within 5 seconds

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [latitud, longitud]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const shareLocation = () => {
    const lat = latitud;
    const lon = longitud;
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Share.share({
      message: `Esta es la ubicacion de Papa: ${googleMapsLink}`,
      url: googleMapsLink,
      title: 'Compartiendo Ubicacion'
    });
  };

  return (
    <View>
      <MapView
        style={{
          width: "100%",
          height: "100%",
        }}
        initialRegion={{
          latitude: -17.78629,
          longitude: -63.18117,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          coordinate={{
            latitude: latitud,
            longitude: longitud,
          }}
        >
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1.5 }}
            transition={{
              type: "timing",
              duration: 1000,
              loop: true,
              repeatReverse: true,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowCardInfo(!showCardInfo)}
            >
              <Box bgColor={"$blue300"} borderRadius="$full" padding={"$2"}>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={"#fff"}
                />
              </Box>
            </TouchableOpacity>
          </MotiView>
        </Marker>
      </MapView>

      {showCardInfo && (
        <Box
          position="absolute"
          height="$1/2"
          width={"$full"}
          bottom={0}
          justifyContent="flex-end"
          alignItems="center"
          padding={"$10"}
        >
          <MotiView
            from={{ translateY: 300 }} 
            animate={{ translateY: 0 }} 
            exit={{ translateY: 300 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <Box
              borderRadius={"$lg"}
              width={"$full"}
              bgColor="$white"
              margin={"$5"}
              paddingHorizontal="$5"
              paddingVertical="$5"
            >
              <HStack
                width={'$full'}
                justifyContent="space-between"
                alignItems="center"
              >
                <VStack>
                  <Text>Estado: Normal</Text>
                  <Text> Latitud: {latitud}</Text>
                  <Text> Longitud: {longitud}</Text>
                </VStack>
                <Button
                  onPress={shareLocation}
                  action={'primary'}
                  size={"sm"}
                  borderRadius={'$xl'}
                >
                  <ButtonText>Compartir</ButtonText>
                </Button>
              </HStack>
            </Box>
          </MotiView>
        </Box>
      )}

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <RNView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Box
            width={"80%"}
            padding={"$5"}
            borderRadius={"$lg"}
            bgColor="$white"
            alignItems="center"
          >
            <Text>Aún no se ha recibido la ubicación</Text>
            <Button
              onPress={() => setModalVisible(false)}
              action={'primary'}
              size={"sm"}
              borderRadius={'$xl'}
              marginTop={"$3"}
            >
              <ButtonText>Cerrar</ButtonText>
            </Button>
          </Box>
        </RNView>
      </Modal>
    </View>
  );
};

export default Ubication;
