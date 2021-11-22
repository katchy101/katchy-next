import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import debounce from "lodash.debounce";

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

  const UsernameForm = () => {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkUsername = useCallback(
      debounce(async (username) => {
        if (username !== null && username !== undefined) {
          if (username.length >= 3) {
            const ref = firestore.doc(`usernames/${username}`);
            const { exists } = await ref.get();
            console.log(`enter - 34 Firestore Read Activated`);
            setIsValid(!exists);
            setIsLoading(false);
          }
        }
      }, 500),
      []
    );

    const UsernameMessage = ({ username, isValid, loading }) => {
      if (loading) {
        return <p>Checking...</p>;
      } else if (isValid) {
        return <p className={`text-success`}>{username} is availible!</p>;
      } else if (username && !isValid) {
        return <p className={`text-danger`}>{username} is taken!</p>;
      } else {
        return <p></p>;
      }
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const userDoc = firestore.doc(`users/${user.uid}`),
          usernameDoc = firestore.doc(`usernames/${formValue}`),
          batch = firestore.batch();
        batch.set(userDoc, {
          username: formValue,
          photoURL: user.photoURL,
          displayName: user.displayName,
        });
        batch.set(usernameDoc, {
          uid: user.uid,
        });
        await batch.commit();
      } catch (error) {
        alert(error);
      }
    };

    const onChange = (e) => {
      const value = e.target.value.toLowerCase(),
        re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
      if (value.length < 3) {
        setFormValue(value);
        setIsLoading(false);
        setIsValid(false);
      }
      if (re.test(value)) {
        setFormValue(value);
        setIsLoading(true);
        setIsValid(false);
      }
    };

    useEffect(() => {
      checkUsername(formValue);
    }, [formValue]);

    return (
      !username && (
        <section>
          <form onSubmit={onSubmit}>
            <input
              name="username"
              placeholder="username"
              type="text"
              value={formValue}
              onChange={onChange}
            />
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={isLoading}
            />
            <button type="submit" className={`btn-green`} disabled={!isValid}>
              Choose
            </button>
            <h3>Debug State</h3>
            <div>
              Username: {formValue}
              <br />
              Loading : {isLoading.toString()}
              <br />
              Username Valid : {isValid.toString()}
            </div>
          </form>
        </section>
      )
    );
  };

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
