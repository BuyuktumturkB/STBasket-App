import React, {useEffect} from 'react';
import {
  useColorScheme,
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {TokenProvider} from './src/context/TokenContext';
import {WsProvider} from './src/context/WsContext';
import {CurrencyProvider} from './src/context/CurrencyProvider';
import {AuthenticateProvider} from './src/context/AuthanticateContext';
import ThemeProvider from './src/context/ThemeContext';
import {KioskProvider, KioskContext} from './src/context/KioskContext';
import Navigation from './src/navigation';
import Orientation from 'react-native-orientation-locker';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from './src/Redux/store';
import * as encoding from 'text-encoding';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/context/i18n';
import {FilterProvider} from './src/context/FilterContext';

const MainApp = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {toggleKiosk} = React.useContext(KioskContext);

  useEffect(() => {
    Orientation.lockToLandscapeLeft();
    toggleKiosk(true);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <Provider store={store}>
          <TokenProvider>
            <WsProvider>
              <AuthenticateProvider>
                <CurrencyProvider>
                  <FilterProvider>
                    <KioskProvider>
                      <ThemeProvider>
                        <StatusBar hidden={true} />
                        <MainApp />
                      </ThemeProvider>
                    </KioskProvider>
                  </FilterProvider>
                </CurrencyProvider>
              </AuthenticateProvider>
            </WsProvider>
          </TokenProvider>
        </Provider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
});

export default App;