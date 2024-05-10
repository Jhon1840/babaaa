import React, { useState } from "react";
import {
  SafeAreaView,
  Box,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Text
} from "@gluestack-ui/themed";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";

const signup = () => {
  const [trackerId, setTrackerId] = useState('')

  const router = useRouter()

  const findTracker = async () => {

    let { data: trackerData, error } = await supabase
    .from('tracker')
    .select('*')
    .eq('tracker', trackerId)

    if(trackerData){
      console.log('Device Exist')
      router.replace('/account')
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
                    <InputField placeholder="AU134TH" />
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
