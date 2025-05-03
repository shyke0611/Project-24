import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { AppNavigator } from "./src/navigation/AppNavigator"
import { AuthProvider } from "./src/contexts/AuthContext"
import { UserRoleProvider } from "./src/contexts/UserRoleContext"

export default function App() {

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserRoleProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </UserRoleProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
