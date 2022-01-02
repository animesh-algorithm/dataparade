import { getPlaylistContent } from "../api/videos";
import {
  GET_PLAYLIST_CONTENT,
  ADD_VIDEO_TO_USER_COLLECTION,
} from "../constants/videos";

export const fetchVideosForPlaylist =
  (playlistId) =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    try {
      const videos = await getPlaylistContent(playlistId);
      dispatch({
        type: GET_PLAYLIST_CONTENT,
        payload: videos,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const addVideoToUserCollection =
  (video, status) =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    if (status == "todo") {
      dispatch({
        type: ADD_VIDEO_TO_USER_COLLECTION,
      });
      return;
    }
    const firestore = getFirestore();
    const uid = getState().firebase.auth.uid;
    const profile = await firestore
      .collection("profiles")
      .doc(uid)
      .get()
      .then((snapshot) => snapshot.data());
    let playlists = profile.playlists;
    playlists[video.snippet.playlistId][status].push(video);

    // Remove Common Videos
    if (status == "done") {
      playlists[video.snippet.playlistId]["inProgress"] = playlists[
        video.snippet.playlistId
      ]["inProgress"].filter((item) => item.id !== video.id);
    } else {
      playlists[video.snippet.playlistId]["done"] = playlists[
        video.snippet.playlistId
      ]["done"].filter((item) => item.id !== video.id);
    }

    // Remove Duplicates
    playlists[video.snippet.playlistId][status] = playlists[
      video.snippet.playlistId
    ][status].filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.snippet.resourceId.videoId === item.snippet.resourceId.videoId
        )
    );
    console.log(playlists[video.snippet.playlistId][status]);
    await firestore.collection("profiles").doc(uid).update({
      playlists: playlists,
    });
    try {
      dispatch({
        type: ADD_VIDEO_TO_USER_COLLECTION,
      });
    } catch (error) {
      console.log(error);
    }
  };
