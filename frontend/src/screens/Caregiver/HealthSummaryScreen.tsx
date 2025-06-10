import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import IconButton from "../../components/IconButton"
import Card from "../../components/Card"

const HealthSummaryScreen = () => {
  const navigation = useNavigation()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  // Dummy data for the chart
  const weeklyData = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 45 },
    { day: "Wed", value: 75 },
    { day: "Thu", value: 60 },
    { day: "Fri", value: 80 },
    { day: "Sat", value: 50 },
    { day: "Sun", value: 40 },
  ]

  // Dummy data for missed reminders
  const missedReminders = [
    { id: 1, title: "Evening medication", time: "20:00", date: "Yesterday" },
    { id: 2, title: "Drink water", time: "15:00", date: "Yesterday" },
    { id: 3, title: "Morning walk", time: "09:00", date: "2 days ago" },
  ]

  // Dummy data for activity log
  const activityLog = [
    { id: 1, title: "Completed brain game", time: "10:30 AM", completed: true },
    { id: 2, title: "Missed hydration reminder", time: "3:00 PM", completed: false },
    { id: 3, title: "Voice chat with caregiver", time: "4:15 PM", completed: true },
    { id: 4, title: "Added new journal entry", time: "5:30 PM", completed: true },
    { id: 5, title: "Missed evening medication", time: "8:00 PM", completed: false },
  ]

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
        <Text style={styles.headerTitle}>Health Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.reportHeader}>
          <View>
            <Text style={styles.reportTitle}>Margaret's Health Report</Text>
            <Text style={styles.reportDate}>Last updated: Today at 2:30 PM</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#5EBFB5" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Ionicons name="school-outline" size={28} color="#8A70D6" />
            <Text style={styles.metricLabel}>Cognitive Activity</Text>
            <Text style={styles.metricValue}>85%</Text>
            <View style={styles.trendContainer}>
              <Ionicons name="arrow-up-outline" size={16} color="#4CAF50" />
              <Text style={[styles.trendText, styles.positiveText]}>5% this week</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="people-outline" size={28} color="#5B8DEF" />
            <Text style={styles.metricLabel}>Social Engagement</Text>
            <Text style={styles.metricValue}>70%</Text>
            <View style={styles.trendContainer}>
              <Ionicons name="arrow-up-outline" size={16} color="#4CAF50" />
              <Text style={[styles.trendText, styles.positiveText]}>2% this week</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="heart-outline" size={28} color="#E57373" />
            <Text style={styles.metricLabel}>Wellness Score</Text>
            <Text style={styles.metricValue}>92%</Text>
            <View style={styles.trendContainer}>
              <Ionicons name="arrow-up-outline" size={16} color="#4CAF50" />
              <Text style={[styles.trendText, styles.positiveText]}>3% this week</Text>
            </View>
          </View>
        </View>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color="#5EBFB5" />
            <Text style={styles.cardTitle}>Weekly Engagement</Text>
          </View>

          <View style={styles.chartContainer}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={[styles.chartBar, { height: item.value * 1.5 }]} />
                <Text style={styles.chartLabel}>{item.day}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.chartSummary}>Average engagement: 68%</Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="alert-circle-outline" size={20} color="#E57373" />
            <Text style={styles.cardTitle}>Missed Reminders</Text>
          </View>

          {missedReminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderItem}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderDate}>{reminder.date}</Text>
              </View>
              <Text style={styles.reminderTime}>{reminder.time}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={20} color="#5EBFB5" />
            <Text style={styles.cardTitle}>Activity Log</Text>
          </View>

          {activityLog.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                {activity.completed ? (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                ) : (
                  <Ionicons name="close-circle" size={20} color="#E57373" />
                )}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </Card>
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
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  reportDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#5EBFB5",
    borderRadius: 100,
  },
  exportText: {
    color: "#5EBFB5",
    marginLeft: 4,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
  },
  positiveText: {
    color: "#4CAF50",
  },
  negativeText: {
    color: "#E57373",
  },
  card: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 16,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  chartBar: {
    width: 20,
    backgroundColor: "#5EBFB5",
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: "#666",
  },
  chartSummary: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  reminderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  reminderDate: {
    fontSize: 14,
    color: "#666",
  },
  reminderTime: {
    fontSize: 14,
    color: "#E57373",
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityIconContainer: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: "#666",
  },
})

export default HealthSummaryScreen
