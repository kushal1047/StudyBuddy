import React from "react";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/contexts/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <Toast />
    </>
  );
}
