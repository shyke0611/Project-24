"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import Button from "../../components/Button"
import TutorialFormModal from "../../components/TutorialFormModal"

const UploadTutorialScreen = () => {
  const [uploadedTutorials, setUploadedTutorials] = useState([
    {
      id: "1",
      title: "How to Use the TV Remote",
      description: "Step-by-step guide for using the new TV remote control",
      thumbnail: "https://via.placeholder.com/300x200",
      date: "2 days ago",
    },
    {
      id: "2",
      title: "Setting Up Video Calls",
      description: "Instructions for making video calls to family members",
      thumbnail: "https://via.placeholder.com/300x200",
      date: "1 week ago",
    },
  ])
  const [tutorialFormVisible, setTutorialFormVisible] = useState(false)
  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  const handleAddTutorial = () => setTutorialFormVisible(true)

  const handleSaveTutorial = (tutorial: { title: string; description: string; thumbnail: string }) => {
    const newTutorial = {
      id: Date.now().toString(),
      title: tutorial.title,
      description: tutorial.description,
      thumbnail: tutorial.thumbnail,
      date: "Just now",
    }
    setUploadedTutorials([newTutorial, ...uploadedTutorials])
  }

  const handleDeleteTutorial = (id: string) => {
    Alert.alert("Delete Tutorial", "Are you sure you want to delete this tutorial?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setUploadedTutorials(uploadedTutorials.filter((t) => t.id !== id))
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tutorial Videos</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.buttonContainer}>
          <Button
            title="Add New Tutorial"
            onPress={handleAddTutorial}
            icon={<Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />}
            style={styles.addButton}
          />
        </View>

        <View style={styles.tutorialsSection}>
          {uploadedTutorials.map((tut) => (
            <View key={tut.id} style={styles.tutorialCard}>
              <Image source={{ uri: tut.thumbnail }} style={styles.thumbnail} />
              <View style={styles.tutorialInfo}>
                <Text style={styles.tutorialTitle}>{tut.title}</Text>
                <Text style={styles.tutorialDescription}>{tut.description}</Text>
                <View style={styles.tutorialFooter}>
                  <Text style={styles.tutorialDate}>{tut.date}</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTutorial(tut.id)}>
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <TutorialFormModal
        visible={tutorialFormVisible}
        onClose={() => setTutorialFormVisible(false)}
        onSubmit={handleSaveTutorial}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  scrollContent: { padding: 24 },
  tabletScrollContent: {
    paddingHorizontal: 64,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  buttonContainer: { marginBottom: 24 },
  addButton: {},
  tutorialsSection: { marginBottom: 24 },
  tutorialCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: { width: "100%", height: 160 },
  tutorialInfo: { padding: 16 },
  tutorialTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#333" },
  tutorialDescription: { fontSize: 14, color: "#666", marginBottom: 8 },
  tutorialFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tutorialDate: { fontSize: 12, color: "#999" },
  deleteButton: { flexDirection: "row", alignItems: "center", padding: 6 },
  deleteText: { fontSize: 12, color: "#FF6B6B", marginLeft: 4 },
})

export default UploadTutorialScreen
