"use client"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useWindowDimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../contexts/AuthContext"
import { useUserRole } from "../contexts/UserRoleContext"

// Auth Screens
import LoginScreen from "../screens/Auth/LoginScreen"
import CreateAccountScreen from "../screens/Auth/CreateAccountScreen"
import RoleSelectionScreen from "../screens/Auth/RoleSelectionScreen"

// Elderly Screens
import ElderlyHomeScreen from "../screens/Elderly/ElderlyHomeScreen"
import DailyCheckinScreen from "../screens/Elderly/DailyCheckinScreen"
import SettingsScreen from "../screens/Elderly/SettingsScreen"
import AIScreen from "../screens/Elderly/AIScreen"
import TutorialsListScreen from "../screens/Elderly/TutorialsListScreen"
import MapScreen from "../screens/Shared/MapScreen"

// Caregiver Screens
import CaregiverHomeScreen from "../screens/Caregiver/CaregiverHomeScreen"
import HealthSummaryScreen from "../screens/Caregiver/HealthSummaryScreen"
import UploadTutorialScreen from "../screens/Caregiver/UploadTutorialScreen"

// Shared Screens
import RemindersScreen from "../screens/Shared/RemindersScreen"
import ProfileScreen from "../screens/Shared/ProfileScreen"

// Stack navigators
const AuthStack = createStackNavigator()
const ElderlyStack = createStackNavigator()
const CaregiverStack = createStackNavigator()
const RemindersStack = createStackNavigator()
const ProfileStack = createStackNavigator()

// Tab navigator
const Tab = createBottomTabNavigator()

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
    <AuthStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
  </AuthStack.Navigator>
)

// Elderly Tab Navigator - Updated with Reminders tab and Map tab
const ElderlyTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "AI") {
          iconName = focused ? "person" : "person-outline"
        } else if (route.name === "Reminders") {
          iconName = focused ? "notifications" : "notifications-outline"
        } else if (route.name === "Map") {
          iconName = focused ? "map" : "map-outline"
        } else if (route.name === "Profile") {
          iconName = focused ? "person-circle" : "person-circle-outline"
        }

        return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />
      },
      tabBarActiveTintColor: "#5EBFB5",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={ElderlyHomeNavigator} />
    <Tab.Screen name="AI" component={AIScreen} />
    <Tab.Screen name="Reminders" component={RemindersScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Profile" component={ProfileNavigator} />
  </Tab.Navigator>
)

// Caregiver Tab Navigator
const CaregiverTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "Health") {
          iconName = focused ? "heart" : "heart-outline"
        } else if (route.name === "Tutorials") {
          iconName = focused ? "videocam" : "videocam-outline"
        } else if (route.name === "Profile") {
          iconName = focused ? "person-circle" : "person-circle-outline"
        }

        return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />

      },
      tabBarActiveTintColor: "#5EBFB5",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={CaregiverHomeNavigator} />
    <Tab.Screen name="Health" component={HealthSummaryScreen} />
    <Tab.Screen name="Tutorials" component={UploadTutorialScreen} />
    <Tab.Screen name="Profile" component={ProfileNavigator} />
  </Tab.Navigator>
)

// Elderly Stack Navigators
const ElderlyHomeNavigator = () => (
  <ElderlyStack.Navigator screenOptions={{ headerShown: false }}>
    <ElderlyStack.Screen name="ElderlyHome" component={ElderlyHomeScreen} />
    <ElderlyStack.Screen name="DailyCheckin" component={DailyCheckinScreen} />
    <ElderlyStack.Screen name="Reminders" component={RemindersScreen} />
    <ElderlyStack.Screen name="Settings" component={SettingsScreen} />
    <ElderlyStack.Screen name="TutorialsList" component={TutorialsListScreen} />
  </ElderlyStack.Navigator>
)

// Caregiver Stack Navigators
const CaregiverHomeNavigator = () => (
  <CaregiverStack.Navigator screenOptions={{ headerShown: false }}>
    <CaregiverStack.Screen name="CaregiverHome" component={CaregiverHomeScreen} />
    <CaregiverStack.Screen name="Reminders" component={RemindersScreen} />
  </CaregiverStack.Navigator>
)

// Shared Stack Navigators
const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
  </ProfileStack.Navigator>
)

// Main App Navigator
export const AppNavigator = () => {
  const { isAuthenticated } = useAuth()
  const { userRole } = useUserRole()
  const { width } = useWindowDimensions()
  const isTablet = width >= 768

  // Apply responsive styles based on device size
  const screenOptions = isTablet
    ? {
        headerTitleStyle: { fontSize: 24 },
        tabBarLabelStyle: { fontSize: 16 },
        tabBarIconStyle: { width: 30, height: 30 },
      }
    : {}

  if (!isAuthenticated) {
    return <AuthNavigator />
  }

  // If authenticated but no role selected, show role selection
  if (userRole === null) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      </AuthStack.Navigator>
    )
  }

  return userRole === "elderly" ? <ElderlyTabNavigator /> : <CaregiverTabNavigator />
}
