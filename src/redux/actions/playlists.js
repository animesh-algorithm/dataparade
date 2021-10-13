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
      const user = getState().firebase.auth.uid;
      const videos = await getPlaylistContent(playlistId);
      // for (let video of videos) {
      //   await firestore.collection(`todo_${playlistId}`).doc()
      // }
      await firestore.collection(`todo_${playlistId}`).doc(videos[0].id);
      dispatch({
        type: ADD_PLAYLIST_TO_USER_COLLECTION,
      });
    } catch (error) {
      console.log(error);
    }
  };
