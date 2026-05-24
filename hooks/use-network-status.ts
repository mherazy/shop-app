import { useNetworkState } from 'expo-network';

export function useNetworkStatus() {
  const state = useNetworkState();
  const isOnline =
    state.isConnected === true && state.isInternetReachable !== false;
  return { isOnline };
}
