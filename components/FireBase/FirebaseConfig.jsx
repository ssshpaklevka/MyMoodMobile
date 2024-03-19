import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore"

import { getStorage, ref, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBR9L7dsf8iZ1y9Tv7eXvZA2Sujjryrc-E",
  authDomain: "mymood-7ee08.firebaseapp.com",
  projectId: "mymood-7ee08",
  storageBucket: "mymood-7ee08.appspot.com",
  messagingSenderId: "129999086896",
  appId: "1:129999086896:web:8d06b16fdb19a5c0fb14f5",
  measurementId: "G-Q5W8FCYV6T",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)

const storage = getStorage()
const getImageUrl = async imagePath => {
  const imageRef = ref(storage, imagePath)
  try {
    const url = await getDownloadURL(imageRef)
    console.log(url) // Используйте этот URL в компоненте `Image`
    return url
  } catch (error) {
    console.error("Failed to get image URL", error)
    return null
  }
}

// Пример использования
// Предположим, imagePath = "emoji/angryface.png"
getImageUrl("emoji/angryface.png").then(url => {
  if (url) {
    // Теперь вы можете использовать URL для отображения изображения
    // Например, обновите состояние компонента, чтобы включить URL
  }
})

export {
  auth,
  firestore,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
}
