"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/Button"

type AuthStackParamList = {
  Login: undefined
  CreateAccount: undefined
  RoleSelection: undefined
}

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Login">

const LoginScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigation = useNavigation<LoginScreenNavigationProp>()
  const { login, loading, error } = useAuth()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return
    }

    try {
      const success = await login(username, password)
      if (success) {
        // Navigation to role selection will happen automatically due to the AppNavigator
      }
    } catch (err) {
      console.log("Error during login:", err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>?</Text>
            </View>
          </View>

          <Text style={[styles.title, isTablet && styles.tabletTitle]}>Welcome to PlaceHolder</Text>

          <Text style={styles.subtitle}>Your friendly companion</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button title="Log In" onPress={handleLogin} style={styles.loginButton} loading={loading} />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
  },
  tabletScrollContent: {
    paddingHorizontal: 64,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5F3",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 48,
    color: "#5EBFB5",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4A6D8C",
    marginBottom: 8,
    textAlign: "center",
  },
  tabletTitle: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#666",
  },
  signupLink: {
    color: "#5EBFB5",
    fontWeight: "600",
    marginLeft: 4,
  },
})

export default LoginScreen
