import type { ReactNode } from "react"
import { View, StyleSheet, type ViewStyle, TouchableOpacity, type GestureResponderEvent } from "react-native"

type CardProps = {
  children: ReactNode
  style?: ViewStyle
  onPress?: (event: GestureResponderEvent) => void
}

const Card = ({ children, style, onPress }: CardProps) => {
  return onPress ? (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})

export default Card
