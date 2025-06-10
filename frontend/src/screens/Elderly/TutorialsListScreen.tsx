import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import IconButton from "../../components/IconButton"

const TutorialsListScreen = () => {
  const navigation = useNavigation()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  // Sample tutorials data
  const tutorials = [
    {
      id: "1",
      title: "How to Use the TV Remote",
      description: "Step-by-step guide for using the new TV remote control",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "3:45",
      date: "2 days ago",
    },
    {
      id: "2",
      title: "Setting Up Video Calls",
      description: "Instructions for making video calls to family members",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "5:20",
      date: "1 week ago",
    },
    {
      id: "3",
      title: "Using the Microwave",
      description: "How to safely use the microwave for heating food",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "2:15",
      date: "2 weeks ago",
    },
    {
      id: "4",
      title: "Medication Organization",
      description: "Tips for organizing your weekly medications",
      thumbnail: "https://via.placeholder.com/300x200",
      duration: "4:30",
      date: "3 weeks ago",
    },
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
        <Text style={styles.headerTitle}>Tutorials from John</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        {tutorials.map((tutorial) => (
          <TouchableOpacity key={tutorial.id} style={styles.tutorialCard}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: tutorial.thumbnail }} style={styles.thumbnail} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{tutorial.duration}</Text>
              </View>
              <View style={styles.playButton}>
                <Ionicons name="play" size={24} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.tutorialInfo}>
              <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
              <Text style={styles.tutorialDescription} numberOfLines={2}>
                {tutorial.description}
              </Text>
              <Text style={styles.tutorialDate}>{tutorial.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  tutorialCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 180,
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  durationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(94, 191, 181, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialInfo: {
    padding: 16,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  tutorialDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tutorialDate: {
    fontSize: 12,
    color: "#999",
  },
})

export default TutorialsListScreen
