import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle, ActivityIndicator } from "react-native"

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
}: ButtonProps) => {
  const buttonStyles = [
    styles.button,
    variant === "primary" && styles.primaryButton,
    variant === "secondary" && styles.secondaryButton,
    variant === "outline" && styles.outlineButton,
    disabled && styles.disabledButton,
    style,
  ]

  const textStyles = [
    styles.text,
    variant === "primary" && styles.primaryText,
    variant === "secondary" && styles.secondaryText,
    variant === "outline" && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ]

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#5EBFB5" : "white"} size="small" />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: "#5EBFB5",
  },
  secondaryButton: {
    backgroundColor: "#E8F5F3",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#5EBFB5",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
    borderColor: "#E0E0E0",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "#5EBFB5",
  },
  outlineText: {
    color: "#5EBFB5",
  },
  disabledText: {
    color: "#A0A0A0",
  },
})

export default Button
