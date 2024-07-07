import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, Pressable} from "react-native";
import { Icon} from "react-native-paper";

const BottomBar = () => {

    const navigation = useNavigation();

    const handleBottomBar = (pressed) => {
      return () => {
        navigation.navigate(pressed);
      }
    }

    return (
    <View style={styles.bottomBar}>
            <Pressable style={styles.bottomBarComponent} onPress={handleBottomBar("News")}>
                <Icon source="home" size={30}/>
                <Text>Home</Text>
            </Pressable>
            <Pressable style={styles.bottomBarComponent} onPress={handleBottomBar("Activity")}>
                <Icon source="format-list-bulleted" size={30}/>
                <Text>Activity</Text>
            </Pressable>
            
            <Pressable style={styles.bottomBarComponent} onPress={handleBottomBar("Profile")}>
                <Icon source="account" size={30}/>
                <Text>Profile</Text>
            </Pressable>
            </View>
    )
}

const styles = StyleSheet.create({
    bottomBar: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 10
    },
  
    bottomBarComponent: {
      flex: 1,
      margin: 5,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default BottomBar;