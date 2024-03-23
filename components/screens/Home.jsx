import React, { useState, useEffect } from "react"
import { Text, View, StyleSheet, ScrollView, Image } from "react-native"
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
import { SafeAreaView } from "react-native-safe-area-context"

export default function Home() {
  const [username, setUsername] = useState("")

  //РАБОТА С ТЕКСТОМ И КНОПКОЙ "READ MORE"
  const [expandedPosts, setExpandedPosts] = useState({})
  const [showReadMore, setShowReadMore] = useState({})

  const togglePostExpansion = postId => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }))
  }

  //РАБОТА С ПОСТАМИ
  const [post, setPost] = useState([])

  useEffect(() => {
    if (auth.currentUser) {
      // ссылка на коллекцию
      const q = query(
        collection(firestore, `users/${auth.currentUser.uid}/posts`),
        orderBy("createdAt", "desc")
      )

      // добавление в реал времени
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
      <SafeAreaView style={{ marginLeft: 10, marginRight: 10, height: 110 }}>
        <View style={styles.header}>
          {/* Отображение логина пользователя */}
          <Text style={{ fontSize: 25, fontWeight: "400" }}>Hey, </Text>
          <Text style={{ fontSize: 25, fontWeight: "600" }}>{username}!</Text>
          <Image
            style={{ width: 24, height: 26 }}
            source={require("../../assets/hi.png")}
          />
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {post.map((post, index) => (
            <View key={index} style={styles.postContainer}>
              <View style={styles.emojiTime}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* ЗДЕСЬ ДОЛЖНА БУДЕТ ВЫВОДИТЬСЯ КАРТИНКА */}
                  <Image
                    style={{ width: 40, height: 40, marginRight: 10 }}
                    source={{ uri: post.selectedEmoji.url }}
                  />

                  <Text style={{ fontSize: 18, fontWeight: "600" }}>
                    {post.selectedEmoji.key}
                  </Text>
                </View>

                <Text style={styles.postDate}>
                  {post.createdAt
                    ? post.createdAt.toDate().toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown date"}
                </Text>
              </View>

              <View style={styles.emojisReasons}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: "300" }}>
                    You felt
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {" "}
                    {post.selectedEmojis.join(", ")}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "300" }}>
                    Because of
                  </Text>
                  <Text
                    style={{ fontSize: 16, fontWeight: "600", flexShrink: 1 }}
                  >
                    {" "}
                    {post.selectedTextBlocks.join(", ")}
                  </Text>
                </View>
              </View>

              <View
                style={styles.textNote}
                onLayout={event => {
                  const layout = event.nativeEvent.layout

                  if (layout.height >= 265) {
                    setShowReadMore(prev => ({ ...prev, [post.id]: true }))
                  } else {
                    setShowReadMore(prev => ({ ...prev, [post.id]: false }))
                  }
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    Note:{" "}
                  </Text>

                  {expandedPosts[post.id] ? (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "300",
                        flexShrink: 1,
                      }}
                    >
                      {post.customText}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "300",
                        lineHeight: 20,
                        flexShrink: 1,
                      }}
                      numberOfLines={2}
                    >
                      {post.customText}
                    </Text>
                  )}
                </View>
                <Text
                  onPress={() => togglePostExpansion(post.id)}
                  style={{
                    color: "#8B4CFC",
                    fontSize: 14,
                    marginTop: 5,
                    marginBottom: 10,
                  }}
                >
                  {expandedPosts[post.id] ? "- Read less" : "+ Read more"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginLeft: 20,
    alignItems: "left",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "900",
  },
  postContainer: {
    flex: 1,
    width: 350,
    minHeight: 280,
    backgroundColor: "white",
    borderRadius: 18,
    marginTop: 20,
  },
  emojiTime: {
    marginLeft: 10,
    marginTop: 15,
  },
  postDate: {
    fontSize: 12,
    fontWeight: "400",
  },
  emojisReasons: {
    marginLeft: 10,
    marginTop: 15,
  },
  textNote: {
    marginLeft: 10,
    marginTop: 15,
  },
})
