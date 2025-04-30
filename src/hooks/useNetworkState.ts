import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const useNetworkState = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const getNetInfo = async () => {
      const netStatus = await NetInfo.fetch();

      setIsConnected(netStatus.isInternetReachable);
    };
    const unSubscribe = NetInfo.addEventListener(getNetInfo);

    return () => {
      unSubscribe();
    };
  }, []);

  return { isConnected };
};

export default useNetworkState;
