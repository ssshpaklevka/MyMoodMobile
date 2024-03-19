import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import {
  firestore,
  auth,
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "../FireBase/FirebaseConfig"

export default function Home() {
  const [username, setUsername] = useState("")

  const [post, setPost] = useState([])

  useEffect(() => {
    if (auth.currentUser) {
      // Создаем ссылку на коллекцию
      const q = query(
        collection(firestore, `users/${auth.currentUser.uid}/posts`),
        orderBy("createdAt", "desc")
      )

      // Подписываемся на обновления в реальном времени
      const unsubscribe = onSnapshot(q, querySnapshot => {
        const userPosts = []
        querySnapshot.forEach(doc => {
          userPosts.push({ id: doc.id, ...doc.data() })
        })
        setPost(userPosts)
      })

      // Отписываемся от прослушивания при размонтировании компонента
      return () => unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchUsername = async () => {
      const userDoc = await getDoc(
        doc(firestore, "users", auth.currentUser.uid)
      )
      if (userDoc.exists()) {
        setUsername(userDoc.data().username)
      } else {
        console.log("No such document!")
      }
    }

    if (auth.currentUser) {
      fetchUsername()
    }
  }, [auth, firestore])

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={["#EED3F2", "#FBDCBF"]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0.5, y: 0 }}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Home</Text>
        </View>
        <View>
          {/* Отображение логина пользователя */}
          <Text>Welcome, {username}</Text>
        </View>
        {post.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            {/* Предполагаем, что createdAt - это временная метка Firestore */}
            <Text style={styles.postText}>
              Date:{" "}
              {post.createdAt
                ? post.createdAt.toDate().toLocaleDateString("en-US")
                : "Unknown date"}
            </Text>
            <Text style={styles.postText}>Text: {post.customText}</Text>
            <Text style={styles.postText}>Emoji: {post.selectedEmoji}</Text>
            {/* Если selectedEmojis - это массив */}
            <Text style={styles.postText}>
              Emojis: {post.selectedEmojis.join(", ")}
            </Text>
            {/* Если selectedTextBlocks - это массив */}
            <Text style={styles.postText}>
              Text Blocks: {post.selectedTextBlocks.join(", ")}
            </Text>
          </View>
        ))}
      </ScrollView>
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
  },
})
