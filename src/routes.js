import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
  // createSwitchNavitor doens't have configuration, simple. User cannot go back touching some button.
  createSwitchNavigator({
    // have to be with this order, Login => Main.
    Login,
    Main,
  })
);
