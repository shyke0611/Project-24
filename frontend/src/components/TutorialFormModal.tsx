"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import Button from "./Button"

type TutorialFormModalProps = {
  visible: boolean
  onClose: () => void
  onSubmit: (tutorial: { title: string; description: string; thumbnail: string }) => void
}

const TutorialFormModal = ({ visible, onClose, onSubmit }: TutorialFormModalProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [videoSourceModalVisible, setVideoSourceModalVisible] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setThumbnail(null)
    setIsUploading(false)
  }

  useEffect(() => {
    if (visible) {
      resetForm()
    }
  }, [visible])

  const handleVideoFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Media library access is required to select a video.")
      return
    }

    setIsUploading(true)
    setVideoSourceModalVisible(false)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      })

      if (!result.canceled && result.assets.length > 0) {
        setThumbnail(result.assets[0].uri)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleVideoFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is required to record a video.")
      return
    }

    setIsUploading(true)
    setVideoSourceModalVisible(false)

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      })

      if (!result.canceled && result.assets.length > 0) {
        setThumbnail(result.assets[0].uri)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = () => {
    if (!title || !description || !thumbnail) return
    onSubmit({ title, description, thumbnail })
    resetForm()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upload Tutorial for Margaret</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter tutorial title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter tutorial description"
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              {isUploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color="#5EBFB5" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              ) : thumbnail ? (
                <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
              ) : (
                <TouchableOpacity style={styles.selectButton} onPress={() => setVideoSourceModalVisible(true)}>
                  <Ionicons name="videocam-outline" size={32} color="#5EBFB5" />
                  <Text style={styles.selectText}>Select Video</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              title="Upload Tutorial"
              onPress={handleSubmit}
              disabled={!title || !description || !thumbnail}
              style={StyleSheet.flatten([
                styles.uploadButton,
                (!title || !description || !thumbnail) && styles.disabledButton,
              ])}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          visible={videoSourceModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setVideoSourceModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setVideoSourceModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
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

                  <Button title="Cancel" onPress={() => setVideoSourceModalVisible(false)} variant="outline" />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
  headerTitle: { fontSize: 20, fontWeight: "600", textAlign: "center", flex: 1 },
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
  selectButton: {
    backgroundColor: "#E8F5F3",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#5EBFB5",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  selectText: {
    color: "#5EBFB5",
    fontWeight: "500",
    fontSize: 16,
    marginTop: 8,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadButton: { marginTop: 16 },
  disabledButton: { backgroundColor: "#ddd" },

  uploadingContainer: {
    backgroundColor: "#E8F5F3",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#5EBFB5",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  uploadingText: {
    color: "#5EBFB5",
    fontWeight: "500",
    fontSize: 16,
    marginTop: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
})

export default TutorialFormModal
