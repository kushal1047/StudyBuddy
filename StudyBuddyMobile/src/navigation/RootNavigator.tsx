import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import AuthNavigator from "./AuthNavigator";
import DecksListScreen from "../screens/DecksListScreen";
import CreateDeckScreen from "../screens/CreateDeckScreen";
import DeckDetailsScreen from "../screens/DeckDetailsScreen";
import CreateFlashcardScreen from "../screens/CreateFlashcardScreen";
import { DecksStackParamList } from "../types/navigation.types";

const Stack = createStackNavigator<DecksStackParamList>();

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DecksList" component={DecksListScreen} />
      <Stack.Screen name="CreateDeck" component={CreateDeckScreen} />
      <Stack.Screen name="DeckDetails" component={DeckDetailsScreen} />
      <Stack.Screen name="CreateFlashcard" component={CreateFlashcardScreen} />
    </Stack.Navigator>
  );
}

const RootStack = createStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f9ff",
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
