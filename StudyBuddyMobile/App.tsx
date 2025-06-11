import React from "react";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./src/contexts/AuthContext";
import { NetworkProvider } from "./src/contexts/NetworkContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <>
      <NetworkProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NetworkProvider>
      <Toast />
    </>
  );
}
