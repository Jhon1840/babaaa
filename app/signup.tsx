import React, { useState } from "react";
import {
  SafeAreaView,
  Box,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  ToastTitle,
  ToastDescription,
  Toast,
  useToast
} from "@gluestack-ui/themed";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

const signup = () => {
  const [trackerId, setTrackerId] = useState('')
  const toast = useToast();
  const router = useRouter();

  const findTracker = async () => {

    let { data: trackerData, error } = await supabase
    .from('room_device')
    .select('*')
    .eq('device_name', trackerId)

    if(trackerData?.length != 0){
      console.log(trackerData)
      router.replace('/account')
    }else{
      console.log(trackerData)
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id
          return (
            <Toast nativeID={toastId} action="error" variant="solid">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>
                  Codigo de Dispositivo no existe
                </ToastDescription>
              </VStack>
            </Toast>
          )
        },
      });
    }

  }

  return (
    <SafeAreaView>
      <Box>
        <VStack
            marginVertical="$10"
            width="$full"
            height={'$5/6'}
            justifyContent="space-between"
            alignItems="flex-start"
            paddingHorizontal={'$5'}
        >
            <VStack>
                <Text
                    fontSize='$2xl'
                    color="$black"
                    fontWeight="$bold"
                    textAlign="left"
                > Ingresa el ID del Dispositivo</Text>

                <Box height="$10" />
                <Input
                    width="$full"
                    variant="outline"
                    size="lg"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                >
                    <InputField placeholder="AU134TH" value={trackerId} onChangeText={setTrackerId} />
                </Input>
            </VStack>

          <Button
            width="$full"
            action={"primary"}
            size={"xl"}
            borderRadius={"$xl"}
            onPress={findTracker}
          >
            <ButtonText>Continuar</ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default signup;
