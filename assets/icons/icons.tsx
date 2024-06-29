import { Ionicons } from "@expo/vector-icons"
import { moderateScale } from "react-native-size-matters"
 
export const icons: { [key: string]: (props: {isFocused: boolean, color: string}) => JSX.Element } = {
    '(home)': (props: {isFocused: boolean, color: string}): JSX.Element => {
        return <Ionicons name={props.isFocused ? 'home' : 'home-outline'} size={moderateScale(24)} color={props.color} />
    },
    explore: (props: {isFocused: boolean, color: string}): JSX.Element => {
        return <Ionicons name={props.isFocused ? 'compass' : 'compass-outline'} size={moderateScale(24)} color={props.color} />
    },
}
