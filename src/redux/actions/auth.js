import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from "../constants/auth";
import { getPlaylists } from "../api/playlists";

export const signIn =
  () =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    try {
      const firebase = getFirebase();
      const firestore = getFirestore();
      const GoogleProvider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(GoogleProvider);
      const uid = getState().firebase.auth.uid;
      const user = await firestore
        .collection("profiles")
        .doc(uid)
        .get()
        .then((snapshot) => snapshot.data());
      if (!user.playlists) {
        const playlists = await getPlaylists();
        const userPlaylists = {};
        for (let i in playlists) {
          const pid = playlists[i].id;
          userPlaylists[pid] = {
            inProgress: [],
            done: [],
          };
        }
        await firestore.collection("profiles").doc(uid).update({
          playlists: userPlaylists,
        });
      }
      dispatch({
        type: SIGNIN_SUCCESS,
      });
    } catch (error) {
      console.log("SignIn Error: ", error);
    }
  };

export const signOut =
  () =>
  async (dispatch, getState, { getFirebase }) => {
    try {
      const firebase = getFirebase();
      await firebase.auth().signOut();
      dispatch({
        type: SIGNOUT_SUCCESS,
      });
    } catch (error) {
      console.log("SignOut Error: ", error);
    }
  };
