import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import Card from "../../components/Card"
import IconButton from "../../components/IconButton"

const DailyCheckinScreen = () => {
  const navigation = useNavigation()
  const { width } = useWindowDimensions()

  const isTablet = width >= 768

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
        <Text style={styles.headerTitle}>Daily Check-in</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <View style={styles.profileSection}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
          <Text style={styles.greeting}>Hello, Margaret!</Text>
        </View>

        <Card style={styles.card}>
        <View style={styles.cardHeader}>
  <View style={[styles.iconContainer, styles.weatherIconContainer]}>
    <Ionicons name="partly-sunny-outline" size={28} color="#5EBFB5" />
  </View>
  <Text style={styles.cardTitle}>Today's Weather</Text>
</View>

          <Text style={styles.weatherInfo}>It's sunny and 72°F today in San Francisco.</Text>
          <Text style={styles.weatherTip}>Perfect for a short morning walk!</Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, styles.wellnessIconContainer]}>
              <Ionicons name="heart-outline" size={28} color="#5EBFB5" />
            </View>
            <Text style={styles.cardTitle}>Wellness Tip</Text>
          </View>
          <Text style={styles.tipText}>Staying hydrated helps maintain energy levels.</Text>
          <Text style={styles.tipAction}>Try drinking a glass of water every 2 hours.</Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, styles.factIconContainer]}>
              <Ionicons name="bulb-outline" size={28} color="#5EBFB5" />
            </View>
            <Text style={styles.cardTitle}>Did You Know?</Text>
          </View>
          <Text style={styles.factText}>Laughing is good for the heart and can increase blood flow by 20%.</Text>
          <Text style={styles.factQuestion}>Would you like to hear a joke?</Text>
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
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4A6D8C",
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  weatherIconContainer: {
    backgroundColor: "#E8F5F3",
  },
  wellnessIconContainer: {
    backgroundColor: "#E8F5F3",
  },
  factIconContainer: {
    backgroundColor: "#FFF9E6",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  weatherInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  weatherTip: {
    fontSize: 16,
    color: "#666",
  },
  tipText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  tipAction: {
    fontSize: 16,
    color: "#666",
  },
  factText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  factQuestion: {
    fontSize: 16,
    color: "#666",
  },
})

export default DailyCheckinScreen
