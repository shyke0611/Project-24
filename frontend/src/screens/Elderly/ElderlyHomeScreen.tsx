import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import Card from "../../components/Card"

type ElderlyStackParamList = {
  ElderlyHome: undefined
  DailyCheckin: undefined
  Reminders: undefined
  AI: undefined
  TutorialsList: undefined
}

type ElderlyHomeScreenNavigationProp = StackNavigationProp<ElderlyStackParamList, "ElderlyHome">

const ElderlyHomeScreen = () => {
  const navigation = useNavigation<ElderlyHomeScreenNavigationProp>()
  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.header}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
          <Text style={styles.greeting}>Good afternoon, Margaret!</Text>
        </View>

        {/* AI Avatar Section */}
        <View style={styles.avatarSection}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            }}
            style={styles.avatarImage}
          />
          <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate("AI")}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
            <Text style={styles.chatButtonText}>Talk to Assistant</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          <Card onPress={() => navigation.navigate("DailyCheckin")} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Daily Check-in</Text>
                <Text style={styles.cardDescription}>How are you feeling today?</Text>
              </View>
            </View>
          </Card>

          <Card onPress={() => navigation.navigate("AI")} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="bulb-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Play Brain Game</Text>
                <Text style={styles.cardDescription}>Keep your mind active</Text>
              </View>
            </View>
          </Card>

          <Card onPress={() => navigation.navigate("Reminders")} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>See My Reminders</Text>
                <Text style={styles.cardDescription}>Upcoming tasks and medications</Text>
              </View>
            </View>
          </Card>

          <Card onPress={() => navigation.navigate("TutorialsList")} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="videocam-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Tutorials from John</Text>
                <Text style={styles.cardDescription}>Watch helpful video guides</Text>
              </View>
            </View>
          </Card>
        </View>


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
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A6D8C",
  },
  cardsContainer: {
    width: "100%",
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F5F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5EBFB5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default ElderlyHomeScreen
