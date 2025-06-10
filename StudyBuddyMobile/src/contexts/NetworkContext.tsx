import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import { showErrorToast, showSuccessToast } from "../utils/toast.helper";

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInternetReachable: true,
});

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable;

      setIsConnected(connected);
      setIsInternetReachable(reachable);

      // Show toast when connection changes
      if (!connected && !wasOffline) {
        showErrorToast("No Internet", "You are currently offline");
        setWasOffline(true);
      } else if (connected && wasOffline) {
        showSuccessToast("Back Online", "Internet connection restored");
        setWasOffline(false);
      }
    });

    return () => unsubscribe();
  }, [wasOffline]);

  return (
    <NetworkContext.Provider value={{ isConnected, isInternetReachable }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
