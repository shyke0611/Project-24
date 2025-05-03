"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Switch } from "react-native"
import { Picker } from "@react-native-picker/picker"
import IconButton from "../../components/IconButton"
import Button from "../../components/Button"
import { useAuth } from "../../contexts/AuthContext"

const SettingsScreen = () => {
  const navigation = useNavigation()
  const { logout } = useAuth()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  const [fontSize, setFontSize] = useState("medium")
  const [highContrast, setHighContrast] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState("medium")
  const [voiceTone, setVoiceTone] = useState("friendly")
  const [language, setLanguage] = useState("english")

  const handleLogout = () => {
    logout()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          name="arrow-back"
          onPress={() => navigation.goBack()}
          backgroundColor="transparent"
          color="#333"
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Ionicons name="text-outline" size={24} color="#5EBFB5" />
            <Text style={styles.settingTitle}>Font Size</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, fontSize === "small" && styles.selectedButton]}
              onPress={() => setFontSize("small")}
            >
              <Text style={[styles.optionText, fontSize === "small" && styles.selectedOptionText]}>Small</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, fontSize === "medium" && styles.selectedButton]}
              onPress={() => setFontSize("medium")}
            >
              <Text style={[styles.optionText, fontSize === "medium" && styles.selectedOptionText]}>Medium</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, fontSize === "large" && styles.selectedButton]}
              onPress={() => setFontSize("large")}
            >
              <Text style={[styles.optionText, fontSize === "large" && styles.selectedOptionText]}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingHeader}>
              <Ionicons name="contrast-outline" size={24} color="#5EBFB5" />
              <Text style={styles.settingTitle}>High Contrast Mode</Text>
            </View>

            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: "#E0E0E0", true: "#5EBFB5" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Ionicons name="volume-medium-outline" size={24} color="#5EBFB5" />
            <Text style={styles.settingTitle}>Avatar Voice</Text>
          </View>

          <View style={styles.voiceSettings}>
            <Text style={styles.voiceSettingLabel}>Voice Speed</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.optionButton, voiceSpeed === "slow" && styles.selectedButton]}
                onPress={() => setVoiceSpeed("slow")}
              >
                <Text style={[styles.optionText, voiceSpeed === "slow" && styles.selectedOptionText]}>Slow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, voiceSpeed === "medium" && styles.selectedButton]}
                onPress={() => setVoiceSpeed("medium")}
              >
                <Text style={[styles.optionText, voiceSpeed === "medium" && styles.selectedOptionText]}>Medium</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, voiceSpeed === "fast" && styles.selectedButton]}
                onPress={() => setVoiceSpeed("fast")}
              >
                <Text style={[styles.optionText, voiceSpeed === "fast" && styles.selectedOptionText]}>Fast</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.voiceSettingLabel}>Voice Tone</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={voiceTone}
                onValueChange={(itemValue) => setVoiceTone(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Friendly" value="friendly" />
                <Picker.Item label="Professional" value="professional" />
                <Picker.Item label="Calm" value="calm" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <Ionicons name="globe-outline" size={24} color="#5EBFB5" />
            <Text style={styles.settingTitle}>Language</Text>
          </View>

          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[styles.languageButton, language === "english" && styles.selectedLanguageButton]}
              onPress={() => setLanguage("english")}
            >
              <Text style={[styles.languageText, language === "english" && styles.selectedLanguageText]}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageButton, language === "spanish" && styles.selectedLanguageButton]}
              onPress={() => setLanguage("spanish")}
            >
              <Text style={[styles.languageText, language === "spanish" && styles.selectedLanguageText]}>Spanish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageButton, language === "french" && styles.selectedLanguageButton]}
              onPress={() => setLanguage("french")}
            >
              <Text style={[styles.languageText, language === "french" && styles.selectedLanguageText]}>French</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageButton, language === "mandarin" && styles.selectedLanguageButton]}
              onPress={() => setLanguage("mandarin")}
            >
              <Text style={[styles.languageText, language === "mandarin" && styles.selectedLanguageText]}>
                Mandarin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Log Out" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 24,
  },
  tabletScrollContent: {
    paddingHorizontal: 64,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  settingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 100,
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: "#5EBFB5",
    borderColor: "#5EBFB5",
  },
  optionText: {
    color: "#666",
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "500",
  },
  voiceSettings: {
    marginTop: 8,
  },
  voiceSettingLabel: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 8,
  },
  picker: {
    height: 50,
  },
  languageButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 100,
    alignItems: "center",
    margin: 4,
  },
  selectedLanguageButton: {
    backgroundColor: "#5EBFB5",
    borderColor: "#5EBFB5",
  },
  languageText: {
    color: "#666",
  },
  selectedLanguageText: {
    color: "white",
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 24,
  },
})

export default SettingsScreen
