import { auth } from "@/lib/firebase";
import { signInAnonymously, type User } from "firebase/auth";

export async function ensureAnonymousAuth(): Promise<User | null> {
  try {
    // Check if user is already authenticated
    if (auth.currentUser) {
      console.log("User already authenticated:", auth.currentUser.uid);
      return auth.currentUser;
    }

    console.log("Creating anonymous user...");
    const result = await signInAnonymously(auth);
    console.log("Anonymous user created:", result.user.uid);

    // Wait a moment to ensure the auth state is updated
    await new Promise((resolve) => setTimeout(resolve, 500));

    return result.user;
  } catch (error) {
    console.error("Error creating anonymous user:", error);
    return null;
  }
}
