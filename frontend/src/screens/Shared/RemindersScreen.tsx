"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useUserRole } from "../../contexts/UserRoleContext"
import { useAuth } from "../../contexts/AuthContext"
import IconButton from "../../components/IconButton"
import Button from "../../components/Button"
import ReminderFormModal from "../../components/ReminderFormModal"
import { reminderService, Reminder } from "../../services/reminderService"

const TABS = [
  { label: "Upcoming", icon: "calendar-outline", color: "#60A5FA" },
  { label: "Missed", icon: "alert-circle-outline", color: "#EF4444" },
  { label: "Completed", icon: "checkmark-done-outline", color: "#22C55E" },
]

const RemindersScreen = () => {
  const navigation = useNavigation()
  const { userRole } = useUserRole()
  const { user } = useAuth()
  const { width } = useWindowDimensions()
  const [reminderFormVisible, setReminderFormVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("Upcoming")
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)

  const isTablet = width >= 768

  // Load reminders when component mounts
  useEffect(() => {
    if (user?.id) {
      reminderService.setUserId(user.id)
      loadReminders()
    }
  }, [user])

  const loadReminders = async () => {
    setLoading(true)
    try {
      const fetchedReminders = await reminderService.getReminders()
      setReminders(fetchedReminders)
    } catch (error) {
      console.error('Error loading reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReminderManually = () => setReminderFormVisible(true)
  const handleAddReminderWithClara = () => navigation.navigate("AI" as never)

  const handleSaveReminder = async (reminderData: any) => {
    try {
      const timestamp = reminderData.time.toISOString()
      const newReminder = await reminderService.createReminder({
        message: reminderData.title,
        description: reminderData.description || '',
        timestamp,
        tag: reminderData.type,
        userId: user?.id || '',
      })
      
      setReminders([...reminders, newReminder])
      setReminderFormVisible(false)
    } catch (error) {
      console.error('Error saving reminder:', error)
    }
  }

  const filteredReminders = reminders.filter((r) => {
    switch (activeTab) {
      case "Upcoming":
        return r.status === "INCOMPLETE"
      case "Missed":
        return r.status === "MISSED"
      case "Completed":
        return r.status === "COMPLETE"
      default:
        return true
    }
  })

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
            <>
              <View style={styles.buttonContainer}>
                <Button
                  title="Add New Reminder Manually"
                  onPress={handleAddReminderManually}
                  icon={<Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />}
                  style={styles.addButton}
                />
                <Button
                  title="Add Reminder with AI"
                  onPress={handleAddReminderWithClara}
                  variant="secondary"
                  icon={<Ionicons name="chatbubble-outline" size={20} color="#5EBFB5" style={{ marginRight: 8 }} />}
                  style={styles.claraButton}
                />
              </View>
              <View style={styles.userSpacingFix} />
            </>
          ) : (
            <View style={styles.buttonContainer}>
              <Button
                title="Add New Reminder"
                onPress={handleAddReminderManually}
                icon={<Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />}
                style={styles.addButton}
              />
            </View>
          )}

          <View style={styles.tabs}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.label}
                style={[
                  styles.tab,
                  activeTab === tab.label && { backgroundColor: tab.color },
                ]}
                onPress={() => setActiveTab(tab.label)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={18}
                  color={activeTab === tab.label ? "#fff" : "#666"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.label && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredReminders.map((reminder) => {
            const reminderTime = new Date(reminder.timestamp)
            const hour = reminderTime.getHours()
            const icon = hour >= 6 && hour < 18 ? "sunny-outline" : "moon-outline"
            const formattedTime = reminderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            
            return (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderIconContainer}>
                  <Ionicons name={icon as any} size={24} color="#F9A826" />
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>{reminder.message}</Text>
                  <Text style={styles.reminderTime}>{formattedTime}</Text>
                </View>
                <View
                  style={[
                    styles.reminderTypeTag,
                    reminder.tag === "medication" && styles.medicationTag,
                    reminder.tag === "appointment" && styles.appointmentTag,
                    reminder.tag === "event" && styles.eventTag,
                    reminder.tag === "task" && styles.taskTag,
                    reminder.tag === "other" && styles.otherTag,
                  ]}
                >
                  <Text style={styles.reminderTypeText}>{reminder.tag}</Text>
                </View>
              </View>
            )
          })}
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
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backButton: { width: 40, height: 40 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  placeholder: { width: 40 },
  scrollContent: { padding: 24 },
  tabletScrollContent: { paddingHorizontal: 64, maxWidth: 600, alignSelf: "center", width: "100%" },
  buttonContainer: {},
  addButton: { marginBottom: 12 },
  claraButton: {},
  userSpacingFix: { marginBottom: 16 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    padding: 6,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  tabText: { fontSize: 14, color: "#666", fontWeight: "500" },
  activeTabText: { color: "#fff" },
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
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4, color: "#333" },
  reminderTime: { fontSize: 16, color: "#666" },
  reminderTypeTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: "#E0E0E0",
  },
  medicationTag: { backgroundColor: "#FFE0E0" },
  appointmentTag: { backgroundColor: "#E8E0FF" },
  eventTag: { backgroundColor: "#D0F0FF" },
  taskTag: { backgroundColor: "#FFF4D6" },
  otherTag: { backgroundColor: "#E0E0E0" },
  reminderTypeText: { fontSize: 12, fontWeight: "500", color: "#666" },
})

export default RemindersScreen
