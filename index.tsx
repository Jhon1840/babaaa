import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "@/views/OnboardingScreen";
import { useRouter } from "expo-router";

const Index = () => {
  const [hasShownOnboarding, setHasShownOnboarding] = useState<boolean>(false);
  const router = useRouter()
  
  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem("hasShownOnboarding");
      if (value !== null) {
        setHasShownOnboarding(true);
      }
    };
    checkOnboarding();
  }, []);

  const handleOnboardingFinish = async () => {
    // await AsyncStorage.setItem('hasShownOnboarding', 'true');
    setHasShownOnboarding(true);
    router.push('/(tabs)/')
  };

  return (
    <>
      {hasShownOnboarding === false && (
        <OnboardingScreen onFinish={handleOnboardingFinish} />
      )}
    </>
  );
};

export default Index;