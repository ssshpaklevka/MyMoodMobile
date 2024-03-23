import * as React from "react"
import { StyleSheet, Text, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function Stats() {
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={["#0F2027", "#203A43", "#2C5364"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0.5, y: 0 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Stats</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    marginLeft: 18,
    marginTop: 60,
    alignItems: "left",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "900",
    color: "white",
  },
})
