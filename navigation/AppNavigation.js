import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../screens/Register';
import Login from '../screens/Login';


const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Register}>
        <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default AppNavigation;