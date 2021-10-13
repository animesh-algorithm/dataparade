import {
  GET_PLAYLISTS,
  ADD_PLAYLIST_TO_USER_COLLECTION,
} from "../constants/playlists";

export default (state = [], action) => {
  switch (action.type) {
    case GET_PLAYLISTS:
      console.log("Playlists Fetched");
      return action.payload;
    case ADD_PLAYLIST_TO_USER_COLLECTION:
      return state;
    default:
      return state;
  }
};
