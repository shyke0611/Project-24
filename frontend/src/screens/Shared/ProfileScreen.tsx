"use client"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../contexts/AuthContext"
import { useUserRole } from "../../contexts/UserRoleContext"
import Button from "../../components/Button"

const ProfileScreen = () => {
  const navigation = useNavigation()
  const { logout } = useAuth()
  const { userRole } = useUserRole()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  const handleLogout = () => {
    logout()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
          <Text style={styles.profileName}>{userRole === "elderly" ? "Margaret Johnson" : "John Smith"}</Text>
          <Text style={styles.profileRole}>{userRole === "elderly" ? "User" : "Caregiver"}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {userRole === "elderly" ? "margaret@example.com" : "john@example.com"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>(555) 123-4567</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{userRole === "elderly" ? "May 15, 1950" : "June 22, 1980"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>123 Main St, San Francisco, CA</Text>
            </View>
          </View>
        </View>

        {userRole === "elderly" && (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Medical Information</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Blood Type</Text>
                  <Text style={styles.infoValue}>A+</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Allergies</Text>
                  <Text style={styles.infoValue}>Penicillin, Peanuts</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Conditions</Text>
                  <Text style={styles.infoValue}>Hypertension, Arthritis</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Primary Doctor</Text>
                  <Text style={styles.infoValue}>Dr. Sarah Johnson</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>My Caregiver</Text>

              <TouchableOpacity style={styles.caregiverCard}>
                <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.caregiverImage} />
                <View style={styles.caregiverInfo}>
                  <Text style={styles.caregiverName}>John Smith</Text>
                  <Text style={styles.caregiverContact}>john@example.com</Text>
                  <Text style={styles.caregiverMessage}>"I'm here to help you with anything you need."</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}

        {userRole === "caregiver" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Patients</Text>

            <TouchableOpacity style={styles.patientCard}>
              <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.patientImage} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>Margaret Johnson</Text>
                <Text style={styles.patientAge}>73 years old</Text>
                <Text style={styles.patientContact}>Prefers phone calls in the morning</Text>
                <Text style={styles.patientActivity}>Last activity: Today at 10:30 AM</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {userRole === "elderly" ? (
            <>
              <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate("Settings" as never)}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="settings-outline" size={24} color="#5EBFB5" />
                </View>
                <Text style={styles.settingText}>App Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="notifications-outline" size={24} color="#5EBFB5" />
                </View>
                <Text style={styles.settingText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="notifications-outline" size={24} color="#5EBFB5" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-outline" size={24} color="#5EBFB5" />
            </View>
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={24} color="#5EBFB5" />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
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
  scrollContent: {
    padding: 24,
  },
  tabletScrollContent: {
    paddingHorizontal: 64,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: "#666",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  caregiverCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  caregiverImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  caregiverContact: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  caregiverMessage: {
    fontSize: 14,
    color: "#5EBFB5",
    fontStyle: "italic",
  },
  patientCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  patientContact: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  patientActivity: {
    fontSize: 14,
    color: "#5EBFB5",
    marginTop: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
  },
})

export default ProfileScreen
