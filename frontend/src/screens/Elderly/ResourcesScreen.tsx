import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import Card from "../../components/Card"

const ResourcesScreen = () => {
  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  const resources = [
    {
      id: "1",
      title: "Brain Games",
      description: "Keep your mind active with these fun games",
      icon: "bulb-outline", // Changed from brain-outline
      color: "#8A70D6",
    },
    {
      id: "2",
      title: "Health Articles",
      description: "Latest health tips and information",
      icon: "newspaper-outline",
      color: "#5B8DEF",
    },
    {
      id: "3",
      title: "Meditation",
      description: "Guided meditation sessions for relaxation",
      icon: "leaf-outline",
      color: "#5EBFB5",
    },
    {
      id: "4",
      title: "Exercise Videos",
      description: "Simple exercises you can do at home",
      icon: "fitness-outline",
      color: "#F9A826",
    },
    {
      id: "5",
      title: "Community Events",
      description: "Local events and activities",
      icon: "people-outline",
      color: "#E57373",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletScrollContent]}>
        <Text style={styles.sectionTitle}>Explore Resources</Text>

        {resources.map((resource) => (
          <Card
            key={resource.id}
            style={styles.resourceCard}
            onPress={() => console.log(`Resource ${resource.id} pressed`)}
          >
            <View style={styles.resourceContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${resource.color}20` }]}>
                <Ionicons name={resource.icon as any} size={24} color={resource.color} />
              </View>
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
          </Card>
        ))}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="call-outline" size={20} color="#5EBFB5" />
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  resourceCard: {
    marginBottom: 12,
  },
  resourceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  resourceDescription: {
    fontSize: 14,
    color: "#666",
  },
  helpSection: {
    marginTop: 32,
    alignItems: "center",
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#5EBFB5",
    marginLeft: 8,
  },
})

export default ResourcesScreen
