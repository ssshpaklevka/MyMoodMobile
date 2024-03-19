import {
  firestore,
  auth,
  collection,
  addDoc,
  serverTimestamp,
} from "./FirebaseConfig"

export const saveDataToFirestore = async modalData => {
  const user = auth.currentUser

  if (user) {
    try {
      await addDoc(collection(firestore, `users/${user.uid}/posts`), {
        ...modalData,
        createdAt: serverTimestamp(),
      })
      console.log("Data saved successfully!")
    } catch (error) {
      console.error("Error saving data to Firestore:", error)
    }
  } else {
    console.log("No authenticated user found.")
  }
}
