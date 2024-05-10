import React, {useState} from "react";
import {
    VStack,
    Box,
    Center,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    FormControlHelper,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelperText,
    AlertCircleIcon,
    Button,
    ButtonText,
    Image,
    Text,
    KeyboardAvoidingView
  } from "@gluestack-ui/themed";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

const login = () => {
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const onSignInPress = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: emailAddress,
      password: password
    })

    if(data){
      console.log(data)
      router.replace('/(tabs)')
    }
  }

  return (
    <KeyboardAvoidingView behavior="height">
      <Center h="100%" zIndex={999}>
        <Box
          width={"$full"}
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          <VStack $base-width={"$4/5"} $sm-width={"$3/4"} $md-width={"$1/2"}>
            <VStack marginBottom={'$10'} justifyContent="center" alignItems="center">
              <Box
                  width={'$40'}
                  height="$32"
                >
                  <Image
                    size="full"
                    resizeMode="contain"
                    source={require('@/assets/images/logo.png')}
                  />
                </Box>

                {/* <Text
                  fontWeight={'$bold'}
                  fontSize="$2xl"
                  color="$blue700"
                >
                  Babba
                </Text> */}
            </VStack>

            <Box h="auto" w="$full">
              <FormControl
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                isRequired={false}
              >
                <FormControlLabel mb="$1">
                  <FormControlLabelText>Email</FormControlLabelText>
                </FormControlLabel>
                <Input height={"$16"}>
                  <InputField
                    type="text"
                    placeholder="correo electronico"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText></FormControlHelperText>
                </FormControlHelper>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    At least 6 characters are required.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box height={"$5"} />
            <Box h="auto" w="$full">
              <FormControl
                size="md"
                isDisabled={false}
                isInvalid={false}
                isReadOnly={false}
                isRequired={false}
              >
                <FormControlLabel mb="$1">
                  <FormControlLabelText>Password</FormControlLabelText>
                </FormControlLabel>
                <Input height={"$16"}>
                  <InputField
                    type="password"
                    placeholder="****************"
                    value={password}
                    onChangeText={setPassword}
                  />
                </Input>
                <FormControlHelper>
                  <FormControlHelperText></FormControlHelperText>
                </FormControlHelper>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    At least 6 characters are required.
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Box height={"$5"} />
            <Box height={"$5"} />
            <Button
                  onPress={onSignInPress}
                  action={'primary'}
                  size={"xl"}
                  borderRadius={'$xl'}
                >
                  <ButtonText>Iniciar Session</ButtonText>
                </Button>
          </VStack>

          <Box height="$10" />
          <Text>No Tienes Cuenta?</Text>
          <Box height="$5" />

          <Link
            href='/signup'
          >Crear Cuenta</Link>
        </Box>
      </Center>
    </KeyboardAvoidingView>

  );
};

export default login;
