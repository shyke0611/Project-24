"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useUserRole } from "../../contexts/UserRoleContext"
import { useAuth } from "../../contexts/AuthContext"
import IconButton from "../../components/IconButton"
import Button from "../../components/Button"
import ReminderFormModal from "../../components/ReminderFormModal"
import { 
  reminderService, 
  Reminder, 
  ReminderStatus, 
  ReminderTag 
} from "../../services/reminderService"

const TABS = [
  { label: "Upcoming", icon: "calendar-outline", color: "#60A5FA", status: ReminderStatus.INCOMPLETE },
  { label: "Missed", icon: "alert-circle-outline", color: "#EF4444", status: ReminderStatus.MISSED },
  { label: "Completed", icon: "checkmark-done-outline", color: "#22C55E", status: ReminderStatus.COMPLETE },
]

const getTagIcon = (tag: ReminderTag) => {
  switch (tag) {
    case ReminderTag.MEDICATION:
      return <Ionicons name="medkit-outline" size={24} color="#5EBFB5" />;
    case ReminderTag.APPOINTMENT:
      return <Ionicons name="calendar-outline" size={24} color="#A78BFA" />;
    case ReminderTag.EVENT:
      return <Ionicons name="star-outline" size={24} color="#60A5FA" />;
    case ReminderTag.TASK:
      return <Ionicons name="checkmark-done-outline" size={24} color="#F9A826" />;
    case ReminderTag.HEALTH:
      return <Ionicons name="heart-outline" size={24} color="#34D399" />;
    case ReminderTag.WORK:
      return <Ionicons name="briefcase-outline" size={24} color="#F472B6" />;
    case ReminderTag.FINANCE:
      return <Ionicons name="cash-outline" size={24} color="#FBBF24" />;
    case ReminderTag.TRAVEL:
      return <Ionicons name="airplane-outline" size={24} color="#38BDF8" />;
    case ReminderTag.SOCIAL:
      return <Ionicons name="people-outline" size={24} color="#F472B6" />;
    case ReminderTag.EDUCATION:
      return <Ionicons name="school-outline" size={24} color="#818CF8" />;
    case ReminderTag.LEISURE:
      return <Ionicons name="game-controller-outline" size={24} color="#FCD34D" />;
    case ReminderTag.PERSONAL:
      return <Ionicons name="person-outline" size={24} color="#F59E42" />;
    default:
      return <Ionicons name="alert-circle-outline" size={24} color="#A1A1AA" />;
  }
};

const RemindersScreen = () => {
  const navigation = useNavigation()
  const { userRole } = useUserRole()
  const { user } = useAuth()
  const { width } = useWindowDimensions()
  const [reminderFormVisible, setReminderFormVisible] = useState(false)
  const [editingReminder, setEditingReminder] = useState<{
    id: string
    title: string
    timestamp: string
    description?: string
    tags: ReminderTag[]
  } | null>(null)
  const [activeTab, setActiveTab] = useState("Upcoming")
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const isTablet = width >= 768

  // Load reminders when component mounts
  useEffect(() => {
    if (user?.id) {
      reminderService.setUserId(user.id)
      loadReminders(true)
    }
  }, [user])

  // Refresh reminders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadReminders(true)
      }
    }, [user])
  )

  const loadReminders = async (reset: boolean = false) => {
    if (reset) {
      setCurrentPage(0)
      setHasMore(true)
    }
    
    if (!hasMore && !reset) return
    
    setLoading(true)
    try {
      const page = reset ? 0 : currentPage
      const response = await reminderService.getReminders(page)
      
      if (reset) {
        setReminders(response.reminders)
      } else {
        setReminders(prev => [...prev, ...response.reminders])
      }
      
      setHasMore(response.hasMore)
      setCurrentPage(response.currentPage)
    } catch (error) {
      console.error('Error loading reminders:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadReminders(true)
  }

  const handleAddReminderManually = () => {
    setEditingReminder(null)
    setReminderFormVisible(true)
  }

  const handleAddReminderWithClara = () => navigation.navigate("AI" as never)

  const handleSaveReminder = async (reminderData: any) => {
    try {
      if (editingReminder) {
        // Update existing reminder
        const updatedReminder = await reminderService.updateReminder(editingReminder.id!, reminderData)
        setReminders(prev => prev.map(r => r.id === editingReminder.id ? updatedReminder : r))
      } else {
        // Create new reminder
        const newReminder = await reminderService.createReminder({
          ...reminderData,
          userId: user?.id || '',
        })
        setReminders(prev => [newReminder, ...prev])
      }
      
      setReminderFormVisible(false)
      setEditingReminder(null)
    } catch (error) {
      console.error('Error saving reminder:', error)
      Alert.alert('Error', 'Failed to save reminder. Please try again.')
    }
  }

  const handleEditReminder = (reminder: Reminder) => {
    if (reminder.id) {
      setEditingReminder({
        id: reminder.id,
        title: reminder.title,
        timestamp: reminder.timestamp,
        description: reminder.description,
        tags: reminder.tags,
      })
      setReminderFormVisible(true)
    }
  }

  const handleDeleteReminder = (reminder: Reminder) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${reminder.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await reminderService.deleteReminder(reminder.id!)
              setReminders(prev => prev.filter(r => r.id !== reminder.id))
            } catch (error) {
              console.error('Error deleting reminder:', error)
              Alert.alert('Error', 'Failed to delete reminder. Please try again.')
            }
          }
        }
      ]
    )
  }

  const handleStatusChange = async (reminder: Reminder, newStatus: ReminderStatus) => {
    try {
      let updatedReminder: Reminder
      switch (newStatus) {
        case ReminderStatus.COMPLETE:
          updatedReminder = await reminderService.markAsCompleted(reminder.id!)
          break
        case ReminderStatus.MISSED:
          updatedReminder = await reminderService.markAsMissed(reminder.id!)
          break
        case ReminderStatus.INCOMPLETE:
          updatedReminder = await reminderService.markAsIncomplete(reminder.id!)
          break
        default:
          return
      }
      
      setReminders(prev => prev.map(r => r.id === reminder.id ? updatedReminder : r))
    } catch (error) {
      console.error('Error updating reminder status:', error)
      Alert.alert('Error', 'Failed to update reminder status. Please try again.')
    }
  }

  const filteredReminders = reminders.filter((r) => {
    const activeTabData = TABS.find(tab => tab.label === activeTab)
    return activeTabData ? r.status === activeTabData.status : true
  })

  const getTagColor = (tag: ReminderTag) => {
    switch (tag) {
      case ReminderTag.MEDICATION: return "#FFE0E0"
      case ReminderTag.APPOINTMENT: return "#E8E0FF"
      case ReminderTag.EVENT: return "#D0F0FF"
      case ReminderTag.TASK: return "#FFF4D6"
      case ReminderTag.HEALTH: return "#E0F0E0"
      case ReminderTag.WORK: return "#F0E0F0"
      case ReminderTag.FINANCE: return "#FFF0E0"
      case ReminderTag.TRAVEL: return "#E0F0FF"
      case ReminderTag.SOCIAL: return "#FFE0F0"
      case ReminderTag.EDUCATION: return "#F0FFE0"
      case ReminderTag.LEISURE: return "#E0FFF0"
      case ReminderTag.PERSONAL: return "#F0E0FF"
      default: return "#E0E0E0"
    }
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays === 1) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffDays > 1 && diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
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

        <ScrollView 
          contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
            const paddingToBottom = 20
            if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
              if (hasMore && !loading) {
                loadReminders()
              }
            }
          }}
          scrollEventThrottle={400}
        >
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

          {filteredReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} reminders</Text>
            </View>
          ) : (
            filteredReminders.map((reminder) => {
              const reminderTime = new Date(reminder.timestamp)
              const hour = reminderTime.getHours()
              
              return (
                <View key={reminder.id} style={styles.reminderCard}>
                  <View style={styles.reminderIconContainer}>
                    {reminder.tags && reminder.tags.length > 0 ? getTagIcon(reminder.tags[0]) : getTagIcon(ReminderTag.OTHER)}
                  </View>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderTime}>{formatDateTime(reminder.timestamp)}</Text>
                    {reminder.description && (
                      <Text style={styles.reminderDescription}>{reminder.description}</Text>
                    )}
                    {/* Tags row */}
                    <View style={styles.tagsContainer}>
                      {reminder.tags.map((tag, index) => (
                        <View
                          key={index}
                          style={[
                            styles.reminderTypeTag,
                            { backgroundColor: getTagColor(tag) }
                          ]}
                        >
                          <Text style={styles.reminderTypeText}>
                            {tag.charAt(0) + tag.slice(1).toLowerCase()}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {/* Actions row */}
                    <View style={styles.reminderActions}>
                      <View style={styles.actionButtons}>
                        {reminder.status === ReminderStatus.INCOMPLETE && (
                          <>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => handleStatusChange(reminder, ReminderStatus.COMPLETE)}
                            >
                              <Ionicons name="checkmark-circle-outline" size={20} color="#22C55E" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => handleStatusChange(reminder, ReminderStatus.MISSED)}
                            >
                              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                            </TouchableOpacity>
                          </>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleEditReminder(reminder)}
                        >
                          <Ionicons name="pencil-outline" size={20} color="#60A5FA" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteReminder(reminder)}
                        >
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          )}

          {loading && hasMore && (
            <View style={styles.loadingMore}>
              <Text style={styles.loadingText}>Loading more reminders...</Text>
            </View>
          )}
        </ScrollView>

        <ReminderFormModal
          visible={reminderFormVisible}
          onClose={() => {
            setReminderFormVisible(false)
            setEditingReminder(null)
          }}
          onSave={handleSaveReminder}
          editingReminder={editingReminder}
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
  },
  reminderCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
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
  reminderTime: { fontSize: 16, color: "#666", marginBottom: 4 },
  reminderDescription: { fontSize: 14, color: "#888", fontStyle: "italic" },
  reminderActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 4, // if supported, otherwise use marginRight/marginBottom on tag
  },
  reminderTypeTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginRight: 4,
    marginBottom: 4,
  },
  reminderTypeText: { fontSize: 12, fontWeight: "500", color: "#666" },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingMore: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
})

export default RemindersScreen

