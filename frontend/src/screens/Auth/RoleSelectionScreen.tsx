import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useUserRole } from "../../contexts/UserRoleContext"

type AuthStackParamList = {
  Login: undefined
  CreateAccount: undefined
  RoleSelection: undefined
}

type RoleSelectionScreenNavigationProp = StackNavigationProp<AuthStackParamList, "RoleSelection">

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>()
  const { setUserRole } = useUserRole()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  const handleRoleSelection = (role: "elderly" | "caregiver") => {
    setUserRole(role)
    // Role change will trigger navigation automatically due to AppNavigator
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isTablet && styles.tabletContent]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={[styles.title, isTablet && styles.tabletTitle]}>Who are you?</Text>

        <Text style={styles.subtitle}>Please select your role</Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelection("elderly")} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={28} color="#5EBFB5" />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>I am the user</Text>
              <Text style={styles.roleDescription}>Access your personal dashboard</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleRoleSelection("caregiver")}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="heart-outline" size={28} color="#5EBFB5" />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>I am a caregiver</Text>
              <Text style={styles.roleDescription}>Monitor and assist your loved one</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backToLoginButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backToLoginText}>Go back to login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  tabletContent: {
    paddingHorizontal: 64,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4A6D8C",
    marginBottom: 8,
  },
  tabletTitle: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  cardsContainer: {
    width: "100%",
    maxWidth: 500,
  },
  roleCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  roleDescription: {
    fontSize: 14,
    color: "#666",
  },
  backToLoginButton: {
    marginTop: 24,
    alignSelf: "center",
  },
  backToLoginText: {
    color: "#5EBFB5",
    fontSize: 16,
  },
})

export default RoleSelectionScreen
