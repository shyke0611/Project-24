"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { MaterialIcons } from "@expo/vector-icons"
import ChatHistoryModal from "../../components/ChatHistoryModal"

enum ChatState {
  IDLE = 0,
  LISTENING = 1,
  SPEAKING = 2,
  TYPING = 3,
}

type Message = {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

const sampleMessages: Message[] = [
  { id: "1", text: "Hello Clara, how are you today?", sender: "user", timestamp: new Date() },
  { id: "2", text: "I'm doing well, thank you for asking! How can I help you today?", sender: "assistant", timestamp: new Date() }
]

const AI_IMAGES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
]

type AIScreenProps = {
  avatarName?: string
}

const AIScreen = ({ avatarName = "Assistant" }: AIScreenProps) => {
  const navigation = useNavigation()
  const [chatState, setChatState] = useState<ChatState>(ChatState.IDLE)
  const [message, setMessage] = useState("")
  const [historyModalVisible, setHistoryModalVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [aiImage] = useState(AI_IMAGES[0])

  const pulseAnim = useRef(new Animated.Value(1)).current
  const recordingDot = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation
    let dotAnimation: Animated.CompositeAnimation

    if (chatState === ChatState.LISTENING || chatState === ChatState.SPEAKING) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      )
      pulseAnimation.start()
    }

    if (chatState === ChatState.LISTENING) {
      dotAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingDot, { toValue: 1, duration: 500, useNativeDriver: false }),
          Animated.timing(recordingDot, { toValue: 0.3, duration: 500, useNativeDriver: false }),
        ])
      )
      dotAnimation.start()
    }

    return () => {
      pulseAnimation?.stop()
      dotAnimation?.stop()
    }
  }, [chatState])

  const handleMicPress = () => {
    setChatState(ChatState.LISTENING)
    setTimeout(() => {
      setChatState(ChatState.SPEAKING)
      setTimeout(() => {
        setChatState(ChatState.IDLE)
      }, 3000)
    }, 3000)
  }

  const handleKeyboardPress = () => {
    setChatState(ChatState.TYPING)
  }

  const handleCloseTyping = () => {
    setMessage("")
    setChatState(ChatState.IDLE)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newUserMessage: Message = {
        id: `user-${Date.now()}`,
        text: message,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages([...messages, newUserMessage])
      setMessage("")
      setChatState(ChatState.LISTENING)

      setTimeout(() => {
        setChatState(ChatState.SPEAKING)
        setTimeout(() => {
          const newAssistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            text: "I understand. How else can I help you today?",
            sender: "assistant",
            timestamp: new Date(),
          }
          setMessages((prevMessages) => [...prevMessages, newAssistantMessage])
          setChatState(ChatState.IDLE)
        }, 2000)
      }, 1500)
    }
  }

  const renderStatusIndicator = () => {
    if (chatState === ChatState.LISTENING) {
      return (
        <View style={styles.statusContainer}>
          <View style={styles.listeningStatus}>
            <Text style={styles.statusText}>Listening...</Text>
            <Animated.View style={[styles.recordingDot, { opacity: recordingDot }]} />
          </View>
        </View>
      )
    } else if (chatState === ChatState.SPEAKING) {
      return (
        <View style={styles.statusContainer}>
          <View style={styles.speakingStatus}>
            <Text style={styles.statusText}>Speaking...</Text>
          </View>
        </View>
      )
    }
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>Chat with {avatarName}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: aiImage }} style={styles.avatar} />
          {renderStatusIndicator()}
        </View>

        <TouchableOpacity style={styles.historyButton} onPress={() => setHistoryModalVisible(true)}>
          <Ionicons name="time-outline" size={20} color="#fff" style={styles.historyIcon} />
          <Text style={styles.historyButtonText}>View Chat History</Text>
        </TouchableOpacity>

        <View style={styles.inputArea}>
          {chatState === ChatState.TYPING ? (
            <View style={styles.typingRow}>
              <View style={styles.typingContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your message..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={2}
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                  <Ionicons name="send" size={20} color="#5EBFB5" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleCloseTyping} style={styles.voiceButton}>
                <Ionicons name="mic" size={20} color="#fff" />
                <Text style={styles.voiceButtonText}>Voice</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.controlsContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.micButton,
                    chatState === ChatState.LISTENING && styles.listeningMicButton,
                    chatState === ChatState.SPEAKING && styles.speakingMicButton,
                  ]}
                  onPress={handleMicPress}
                >
                  <Ionicons name="mic-outline" size={30} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity style={styles.keyboardButton} onPress={handleKeyboardPress}>
                <MaterialIcons name="keyboard" size={45} color="#888" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ChatHistoryModal
        visible={historyModalVisible}
        onClose={() => setHistoryModalVisible(false)}
        messages={messages}
      />
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  placeholder: { width: 40 },
  content: { flex: 1, justifyContent: "space-between", alignItems: "center", paddingVertical: 20 },
  avatarWrapper: {
    alignItems: "center", marginTop: 40,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5,
  },
  avatar: {
    width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25,
    borderWidth: 4, borderColor: "#fff",
  },
  historyButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#5EBFB5",
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, marginTop: 20,
  },
  historyIcon: { marginRight: 8 },
  historyButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  statusContainer: { position: "absolute", bottom: -20, alignItems: "center" },
  listeningStatus: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#4285F4", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
  },
  speakingStatus: {
    backgroundColor: "#5EBFB5", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
  },
  statusText: { color: "#fff", fontWeight: "500" },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "red", marginLeft: 8 },
  inputArea: { width: "100%", alignItems: "center", marginBottom: 20 },
  controlsContainer: { alignItems: "center" },
  micButton: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#5EBFB5",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,
  },
  listeningMicButton: { backgroundColor: "#4285F4" },
  speakingMicButton: { backgroundColor: "#5EBFB5" },
  keyboardButton: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: "#f5f5f5",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0",
  },
  typingRow: { flexDirection: "row", alignItems: "flex-end", width: "90%" },
  voiceButton: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#5EBFB5",
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 30, marginLeft: 8,
  },
  voiceButtonText: { color: "#fff", fontWeight: "500", marginLeft: 6 },
  typingContainer: {
    flex: 1, flexDirection: "row", alignItems: "flex-end",
    borderWidth: 1, borderColor: "#5EBFB5", borderRadius: 30,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  textInput: { flex: 1, fontSize: 16, maxHeight: 100, paddingVertical: 8 },
  sendButton: { padding: 6, marginLeft: 6 },
})

export default AIScreen
