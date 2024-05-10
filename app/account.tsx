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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const router = useRouter()

  const createAccount = async () => {

    
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if(data){
        router.replace('/(tabs)')

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
                > Email</Text>

                <Box height="$10" />
                <Input
                    width="$full"
                    variant="outline"
                    size="lg"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    value={email}
                    onChangeText={setEmail}
                >
                    <InputField placeholder="email@gmail.com" />
                </Input>
                <Box height="$10" />
                <Text
                    fontSize='$2xl'
                    color="$black"
                    fontWeight="$bold"
                    textAlign="left"
                > Password</Text>

                <Box height="$10" />
                <Input
                    width="$full"
                    variant="outline"
                    size="lg"
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                    value={password}
                    onChangeText={setPassword}
                >
                    <InputField placeholder="134th1tn" />
                </Input>
            </VStack>
          <Button
            width="$full"
            action={"primary"}
            size={"xl"}
            borderRadius={"$xl"}
            onPress={createAccount}
          >
            <ButtonText>Continuar</ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default signup;
