"use client"

import { useState, useEffect } from "react"
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
import { ReminderTag } from "../services/reminderService"

type ReminderFormModalProps = {
  visible: boolean
  onClose: () => void
  onSave: (reminder: {
    title: string
    timestamp: string // ISO string
    description?: string
    tags: ReminderTag[]
  }) => void
  editingReminder?: {
    id: string
    title: string
    timestamp: string
    description?: string
    tags: ReminderTag[]
  } | null
}

const ReminderFormModal = ({ visible, onClose, onSave, editingReminder }: ReminderFormModalProps) => {
  const [title, setTitle] = useState(editingReminder?.title || "")
  const [dateTime, setDateTime] = useState(editingReminder ? new Date(editingReminder.timestamp) : new Date())
  const [description, setDescription] = useState(editingReminder?.description || "")
  const [selectedTags, setSelectedTags] = useState<ReminderTag[]>(editingReminder?.tags || [ReminderTag.OTHER])
  const [showDateTimePicker, setShowDateTimePicker] = useState(false)

  // Update form fields when editingReminder changes
  useEffect(() => {
    if (editingReminder) {
      setTitle(editingReminder.title)
      setDateTime(new Date(editingReminder.timestamp))
      setDescription(editingReminder.description || "")
      setSelectedTags(editingReminder.tags)
    } else {
      // Reset form when not editing
      setTitle("")
      setDateTime(new Date())
      setDescription("")
      setSelectedTags([ReminderTag.OTHER])
    }
  }, [editingReminder])

  const handleSave = () => {
    if (title.trim()) {
      const timestamp = dateTime.toISOString()
      onSave({ 
        title: title.trim(), 
        timestamp, 
        description: description.trim() || undefined,
        tags: selectedTags
      })
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle("")
    setDateTime(new Date())
    setDescription("")
    setSelectedTags([ReminderTag.OTHER])
    setShowDateTimePicker(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleDateTimeChange = (_: any, selectedDateTime?: Date) => {
    if (selectedDateTime) setDateTime(selectedDateTime)
  }

  const toggleDateTimePicker = () => setShowDateTimePicker(prev => !prev)

  const reminderTags = Object.values(ReminderTag)
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

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
            <Text style={styles.headerTitle}>
              {editingReminder ? "Edit Reminder" : "Add New Reminder"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reminder title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date & Time *</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={toggleDateTimePicker}>
                <Text style={styles.dateTimeText}>{formatDateTime(dateTime)}</Text>
                <Ionicons name="calendar-outline" size={20} color="#5EBFB5" />
              </TouchableOpacity>
              {showDateTimePicker && (
                <DateTimePicker
                  value={dateTime}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  onChange={handleDateTimeChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeContainer}>
                {reminderTags.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeButton, selectedTags.includes(t) && styles.selectedTypeButton]}
                    onPress={() => {
                      if (selectedTags.includes(t)) {
                        setSelectedTags(selectedTags.filter(tag => tag !== t))
                      } else {
                        setSelectedTags([...selectedTags, t])
                      }
                    }}
                  >
                    <Text style={[styles.typeText, selectedTags.includes(t) && styles.selectedTypeText]}>{capitalize(t)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any additional details"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <Button 
              title={editingReminder ? "Update Reminder" : "Save Reminder"} 
              onPress={handleSave} 
              style={styles.saveButton} 
            />
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
