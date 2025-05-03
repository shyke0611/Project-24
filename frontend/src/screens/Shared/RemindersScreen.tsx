"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useUserRole } from "../../contexts/UserRoleContext"
import IconButton from "../../components/IconButton"
import Button from "../../components/Button"
import ReminderFormModal from "../../components/ReminderFormModal"

const RemindersScreen = () => {
  const navigation = useNavigation()
  const { userRole } = useUserRole()
  const { width } = useWindowDimensions()
  const [reminderFormVisible, setReminderFormVisible] = useState(false)

  const isTablet = width >= 768

  // Dummy data for reminders
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Take blood pressure medicine",
      time: "08:00",
      type: "medication",
      icon: "sunny-outline",
    },
    {
      id: 2,
      title: "Drink water",
      time: "10:00",
      type: "hydration",
      icon: "sunny-outline",
    },
    {
      id: 3,
      title: "Doctor appointment",
      time: "14:30",
      type: "appointment",
      icon: "sunny-outline",
    },
    {
      id: 4,
      title: "Evening walk",
      time: "18:00",
      type: "other",
      icon: "moon-outline",
    },
    {
      id: 5,
      title: "Take evening medication",
      time: "20:00",
      type: "medication",
      icon: "moon-outline",
    },
  ])

  const handleAddReminderManually = () => {
    setReminderFormVisible(true)
  }

  const handleAddReminderWithClara = () => {
    navigation.navigate("AI" as never)
  }

  const handleSaveReminder = (reminderData: any) => {
    // Format time for display
    const formattedTime = reminderData.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Determine icon based on time
    const hour = reminderData.time.getHours()
    const icon = hour >= 6 && hour < 18 ? "sunny-outline" : "moon-outline"

    // Create new reminder
    const newReminder = {
      id: Date.now(),
      title: reminderData.title,
      time: formattedTime,
      type: reminderData.type,
      icon: icon,
    }

    // Add to reminders list
    setReminders([...reminders, newReminder])

    // Close modal
    setReminderFormVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <IconButton
            name="arrow-back"
            onPress={() => navigation.goBack()}
            backgroundColor="transparent"
            color="#333"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>My Reminders</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
          {userRole === "elderly" ? (
            <View style={styles.buttonContainer}>
              <Button
                title="Add New Reminder Manually"
                onPress={handleAddReminderManually}
                icon={<Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />}
                style={styles.addButton}
              />

              <Button
                title="Add Reminder with Clara"
                onPress={handleAddReminderWithClara}
                variant="secondary"
                icon={<Ionicons name="chatbubble-outline" size={20} color="#5EBFB5" style={{ marginRight: 8 }} />}
                style={styles.claraButton}
              />
            </View>
          ) : (
            <Button
              title="Add New Reminder"
              onPress={handleAddReminderManually}
              icon={<Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />}
              style={styles.addButton}
            />
          )}

          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderIconContainer}>
                <Ionicons name={reminder.icon as any} size={24} color="#F9A826" />
              </View>

              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderTime}>{reminder.time}</Text>
              </View>

              <View
                style={[
                  styles.reminderTypeTag,
                  reminder.type === "medication" && styles.medicationTag,
                  reminder.type === "hydration" && styles.hydrationTag,
                  reminder.type === "appointment" && styles.appointmentTag,
                ]}
              >
                <Text style={styles.reminderTypeText}>{reminder.type}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <ReminderFormModal
          visible={reminderFormVisible}
          onClose={() => setReminderFormVisible(false)}
          onSave={handleSaveReminder}
        />
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
  buttonContainer: {
    marginBottom: 24,
  },
  addButton: {
    marginBottom: 12,
  },
  claraButton: {
    marginBottom: 24,
  },
  reminderCard: {
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
  reminderIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF9E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  reminderTime: {
    fontSize: 16,
    color: "#666",
  },
  reminderTypeTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: "#E0E0E0",
  },
  medicationTag: {
    backgroundColor: "#FFE0E0",
  },
  hydrationTag: {
    backgroundColor: "#E0E0FF",
  },
  appointmentTag: {
    backgroundColor: "#E8E0FF",
  },
  reminderTypeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
})

export default RemindersScreen
