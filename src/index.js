import React from 'react';
import { YellowBox } from 'react-native';
import Routes from './routes';

// Disable yellow box.
// This warning appears because socket-io was supposed to be used only in a browser.
YellowBox.ignoreWarnings(['Unrecognized WebSocket']);

export default function App() {
  return <Routes />;
}
