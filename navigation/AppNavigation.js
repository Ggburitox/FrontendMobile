import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../screens/Register';
import Login from '../screens/Login';
import HomeScreen from '../screens/HomeScreen';
import ActivityScreen from '../screens/Buses';
import Profile from '../screens/Profile';


const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Register}>
        <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
        <Stack.Screen name="News" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="Activity" options={{headerShown: false}} component={ActivityScreen} />
        <Stack.Screen name="Profile" options={{headerShown: false}} component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


export default AppNavigation;