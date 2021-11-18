import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider } from "../lib/firebase";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);
  const SignInButton = () => {
    const signInWithGoogle = async () => {
      try {
        await auth.signInWithPopup(googleAuthProvider);
      } catch (error) {
        toast.error(error);
      }
    };
    return (
      <button className="btn-google" onClick={signInWithGoogle}>
        <img src={`/google.png`} alt="" /> Sign in with Google
      </button>
    );
  };
  const SignOutButton = () => {
    return <button onClick={() => auth.signOut()}>Sign out</button>;
  };
  const UsernameForm = () => <></>;
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}
