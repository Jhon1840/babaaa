import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useOnboardingStatus = () => {
  const [hasShownOnboarding, setHasShownOnboarding] = useState<boolean>(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // const value = await AsyncStorage.getItem('hasShownOnboarding');
      // setHasShownOnboarding(value !== null);
    };

    checkOnboardingStatus();
  }, []);

  return {
    hasShownOnboarding,
    setHasShownOnboarding
  };
};

export default useOnboardingStatus;
