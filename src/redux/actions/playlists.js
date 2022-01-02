import { getPlaylists } from "../api/playlists";
import { getPlaylistContent } from "../api/videos";

import {
  GET_PLAYLISTS,
  ADD_PLAYLIST_TO_USER_COLLECTION,
} from "../constants/playlists";

export const fetchPlaylists =
  () =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    try {
      const playlists = await getPlaylists();
      dispatch({
        type: GET_PLAYLISTS,
        payload: playlists,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const addPlaylistToUserCollection =
  (playlistId) =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    try {
      const firestore = getFirestore();
      const uid = getState().firebase.auth.uid;
      // const videos = await getPlaylistContent(playlistId);
      const profile = await firestore
        .collection("profiles")
        .doc(uid)
        .get()
        .then((snapshot) => snapshot.data());
      let playlists = profile.playlists ? profile.playlists : {};
      if (!playlists[playlistId]) {
        playlists[playlistId] = {
          inProgress: [],
          done: [],
        };
        await firestore.collection("profiles").doc(uid).update({
          playlists: playlists,
        });
      }
      dispatch({
        type: ADD_PLAYLIST_TO_USER_COLLECTION,
      });
    } catch (error) {
      console.log(error);
    }
  };
