import { Alert } from 'react-native';
import useNetworkState from './useNetworkState';

const useNetworkCheck = () => {
  const { isConnected } = useNetworkState();

  const checkNetwork = () => {
    if (isConnected === false) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  return { checkNetwork };
};

export default useNetworkCheck;
