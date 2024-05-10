import React, { useEffect, useState } from "react";
import { router, Stack, useRouter, useSegments, Slot } from "expo-router";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SplashScreen from "expo-splash-screen";
import { LogBox, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { config } from "@/config/gluestack-ui.config";
import useOnboardingStatus from "@/hooks/useOnboardingStatus";
import OnboardingScreen from "@/views/OnboardingScreen";

LogBox.ignoreAllLogs();

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
  {
    unsavedChangesWarning: false,
  }
);

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const auth = false

  useEffect(() => {
    if(!auth){
      router.replace('/login')
    }
  })

  return (
    <Slot />
  );
};

export default function Rootlayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { hasShownOnboarding, setHasShownOnboarding } = useOnboardingStatus();

  useEffect(() => {
    async function prepareApp() {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
    prepareApp();
  }, []);
  if (!appIsReady) {
    return null;
  }

  const handleOnboardingFinish = async () => {
    // await AsyncStorage.setItem('hasShownOnboarding', 'true');
    // setHasShownOnboarding(true);
    setHasShownOnboarding(true);
  };

  return (
    <GluestackUIProvider config={config}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {hasShownOnboarding === false ? (
            <OnboardingScreen onFinish={handleOnboardingFinish} />
          ) : (
            <InitialLayout />
          )}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </GluestackUIProvider>
  );
}
