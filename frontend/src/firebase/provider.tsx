import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { useMemo } from "react";
import { FirebaseContext } from "./context";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// App Analyitics
const analytics = getAnalytics(app);

// App Firestore Database
const DB = getFirestore(app);


interface FirebaseProviderProps {
    children: React.ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {

    // ----------------------------------------------------------------------
  
    // If we decide to authenticate the user with Firebase, we should
    // inside of this provider
    const memoizedValue = useMemo(
      () => ({}), [],
    );
  
    return <FirebaseContext.Provider value={memoizedValue}>{children}</FirebaseContext.Provider>;
}
