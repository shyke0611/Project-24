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
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/Button"

type AuthStackParamList = {
  Login: undefined
  CreateAccount: undefined
  RoleSelection: undefined
}

type CreateAccountScreenNavigationProp = StackNavigationProp<AuthStackParamList, "CreateAccount">

const CreateAccountScreen = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigation = useNavigation<CreateAccountScreenNavigationProp>()
  const { createAccount, loading, error } = useAuth()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  const handleCreateAccount = async () => {
    if (!username.trim() || !password.trim()) {
      return
    }

    if (password !== confirmPassword) {
      return
    }

    try {
      const success = await createAccount(username, password)
      if (success) {
        navigation.navigate("RoleSelection")
      }
    } catch (err) {
      console.log("Error during account creation:", err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={[styles.title, isTablet && styles.tabletTitle]}>Create Account</Text>

          <Text style={styles.subtitle}>Join PlaceHolder Today</Text>

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
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title="Create Account"
              onPress={handleCreateAccount}
              style={styles.createButton}
              loading={loading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Log in</Text>
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
  },
  tabletScrollContent: {
    paddingHorizontal: 64,
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
    alignSelf: "center",
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
  createButton: {
    marginTop: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#5EBFB5",
    fontWeight: "600",
    marginLeft: 4,
  },
})

export default CreateAccountScreen
