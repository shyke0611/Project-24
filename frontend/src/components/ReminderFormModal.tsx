"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import Button from "./Button"

type ReminderFormModalProps = {
  visible: boolean
  onClose: () => void
  onSave: (reminder: {
    title: string
    date: Date
    time: Date
    notes: string
    type: string
  }) => void
}

const ReminderFormModal = ({ visible, onClose, onSave }: ReminderFormModalProps) => {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [notes, setNotes] = useState("")
  const [type, setType] = useState("other")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, date, time, notes, type })
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle("")
    setDate(new Date())
    setTime(new Date())
    setNotes("")
    setType("other")
    setShowDatePicker(false)
    setShowTimePicker(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const formatDate = (date: Date) => date.toLocaleDateString()
  const formatTime = (time: Date) => time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate)
  }

  const handleTimeChange = (_: any, selectedTime?: Date) => {
    if (selectedTime) setTime(selectedTime)
  }

  const toggleDatePicker = () => setShowDatePicker(prev => !prev)
  const toggleTimePicker = () => setShowTimePicker(prev => !prev)

  const reminderTypes = ["medication", "appointment", "event", "task", "other"]
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Reminder</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reminder title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={toggleDatePicker}>
                <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                <Ionicons name="calendar-outline" size={20} color="#5EBFB5" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={toggleTimePicker}>
                <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                <Ionicons name="time-outline" size={20} color="#5EBFB5" />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleTimeChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeContainer}>
                {reminderTypes.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, type === t && styles.selectedTypeButton]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeText, type === t && styles.selectedTypeText]}>{capitalize(t)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any additional notes"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>

            <Button title="Save Reminder" onPress={handleSave} style={styles.saveButton} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  keyboardAvoidingView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  placeholder: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#333" },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  dateTimeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateTimeText: { fontSize: 16, color: "#333" },
  typeContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: "#5EBFB5",
    borderColor: "#5EBFB5",
  },
  typeText: { fontSize: 14, color: "#666" },
  selectedTypeText: { color: "white", fontWeight: "500" },
  saveButton: { marginTop: 16 },
})

export default ReminderFormModal
