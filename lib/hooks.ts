import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

export function useUserData() {
  const [user] = useAuthState(auth),
    [username, setUserName] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;
    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUserName(doc.data()?.username);
      });
    } else {
      setUserName(null);
    }
    return unsubscribe;
  }, [user]);
  return { user, username };
}
