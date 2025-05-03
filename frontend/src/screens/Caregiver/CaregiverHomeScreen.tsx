import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import Card from "../../components/Card"

// Define the tab navigation param list
type CaregiverTabParamList = {
  Home: undefined
  Health: undefined
  Tutorials: undefined
  Profile: undefined
}

type CaregiverTabNavigationProp = BottomTabNavigationProp<CaregiverTabParamList>

const CaregiverHomeScreen = () => {
  // Use the correct navigation type
  const navigation = useNavigation<CaregiverTabNavigationProp>()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.header}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
          <Text style={styles.greeting}>Good afternoon, CareGiver!</Text>
        </View>

        <View style={styles.cardsContainer}>
          <Card onPress={() => navigation.navigate("Health")} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>View Health Summary</Text>
                <Text style={styles.cardDescription}>How is Magaret this week</Text>
              </View>
            </View>
          </Card>

          <Card onPress={() => navigation.navigate("Tutorials")} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="videocam-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Manage Tutorials</Text>
                <Text style={styles.cardDescription}>Create guides for Magaret</Text>
              </View>
            </View>
          </Card>

          <Card
            onPress={() => {
              // For Reminders, we'll navigate to the Reminders screen within the Home stack
              navigation.navigate("Reminders" as never)
            }}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={24} color="#5EBFB5" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>See Magaret's Reminders</Text>
                <Text style={styles.cardDescription}>Upcoming tasks and medications</Text>
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
})

export default CaregiverHomeScreen
