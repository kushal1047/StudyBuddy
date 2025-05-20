import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import DecksListScreen from "../screens/DecksListScreen";
import CreateDeckScreen from "../screens/CreateDeckScreen";
import DeckDetailsScreen from "../screens/DeckDetailsScreen";
import CreateFlashcardScreen from "../screens/CreateFlashcardScreen";
import EditFlashcardScreen from "../screens/EditFlashCardscreen";
import StudyModeScreen from "../screens/StudyModeScreen";
import EditDeckScreen from "../screens/EditDeckScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const DecksStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Decks Stack Navigator
function DecksNavigator() {
  return (
    <DecksStack.Navigator screenOptions={{ headerShown: false }}>
      <DecksStack.Screen name="DecksList" component={DecksListScreen} />
      <DecksStack.Screen name="CreateDeck" component={CreateDeckScreen} />
      <DecksStack.Screen name="DeckDetails" component={DeckDetailsScreen} />
      <DecksStack.Screen
        name="CreateFlashcard"
        component={CreateFlashcardScreen}
      />
      <DecksStack.Screen name="EditDeck" component={EditDeckScreen} />
      <DecksStack.Screen name="EditFlashcard" component={EditFlashcardScreen} />
      <DecksStack.Screen name="Study" component={StudyModeScreen} />
    </DecksStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// Main Tab Navigator
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="DecksTab"
        component={DecksNavigator}
        options={{
          tabBarLabel: "My Decks",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24 }}>📚</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
