"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  Alert,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import Button from "../../components/Button"

const UploadTutorialScreen = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
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
  const [videoSourceModalVisible, setVideoSourceModalVisible] = useState(false)

  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  const handleSelectVideo = () => {
    setVideoSourceModalVisible(true)
  }

  const handleVideoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Media library access is required to select a video.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    })

    if (!result.canceled && result.assets.length > 0) {
      setSelectedVideo(result.assets[0].uri)
    }

    setVideoSourceModalVisible(false)
  }

  const handleVideoFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is required to record a video.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    })

    if (!result.canceled && result.assets.length > 0) {
      setSelectedVideo(result.assets[0].uri)
    }

    setVideoSourceModalVisible(false)
  }

  const handleUpload = () => {
    if (title && description && selectedVideo) {
      const newTutorial = {
        id: Date.now().toString(),
        title,
        description,
        thumbnail: selectedVideo,
        date: "Just now",
      }

      setUploadedTutorials([newTutorial, ...uploadedTutorials])
      setTitle("")
      setDescription("")
      setSelectedVideo(null)
    }
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
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Tutorial for Margaret</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter tutorial title" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter tutorial description"
              multiline
            />
          </View>

          {selectedVideo ? (
            <View style={styles.videoPreviewContainer}>
              <Image source={{ uri: selectedVideo }} style={styles.videoPreview} />
              <TouchableOpacity style={styles.removeButton} onPress={() => setSelectedVideo(null)}>
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.selectVideoButton} onPress={handleSelectVideo}>
              <Ionicons name="videocam-outline" size={32} color="#5EBFB5" />
              <Text style={styles.selectVideoText}>Select Video</Text>
            </TouchableOpacity>
          )}

          <Button
            title="Upload Tutorial"
            onPress={handleUpload}
            disabled={!title || !description || !selectedVideo}
            style={styles.uploadButton}
          />
        </View>

        <View style={styles.tutorialsSection}>
          <Text style={styles.sectionTitle}>Uploaded Tutorials</Text>
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

      {/* Modal for selecting video source */}
      <Modal
        visible={videoSourceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVideoSourceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Video Source</Text>

            <TouchableOpacity style={styles.modalOption} onPress={handleVideoFromGallery}>
              <Ionicons name="images-outline" size={24} color="#5EBFB5" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={handleVideoFromCamera}>
              <Ionicons name="camera-outline" size={24} color="#5EBFB5" />
              <Text style={styles.modalOptionText}>Record Video</Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              onPress={() => setVideoSourceModalVisible(false)}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  scrollContent: { padding: 24 },
  tabletScrollContent: {
    paddingHorizontal: 64,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  uploadSection: { 
    marginBottom: 32,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16, color: "#333" },
  formGroup: { marginBottom: 16 },
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
  selectVideoButton: {
    backgroundColor: "#E8F5F3",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#5EBFB5",
    borderStyle: "dashed",
    marginBottom: 16,
  },
  selectVideoText: { fontSize: 16, fontWeight: "500", color: "#5EBFB5", marginTop: 8 },
  videoPreviewContainer: { position: "relative", marginBottom: 16 },
  videoPreview: { width: "100%", height: 200, borderRadius: 12 },
  removeButton: { position: "absolute", top: 8, right: 8, backgroundColor: "white", borderRadius: 20 },
  uploadButton: { marginTop: 8 },
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalOptionText: { fontSize: 16, marginLeft: 16, color: "#333" },
  cancelButton: { marginTop: 16 },
})

export default UploadTutorialScreen
