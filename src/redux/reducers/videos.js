import {
  GET_PLAYLIST_CONTENT,
  ADD_VIDEO_TO_USER_COLLECTION,
} from "../constants/videos";

export default (videos = [], action) => {
  switch (action.type) {
    case GET_PLAYLIST_CONTENT:
      console.log("Playlist content fetched");
      return action.payload;
    case ADD_VIDEO_TO_USER_COLLECTION:
      console.log("Video Added");
      return videos;
    default:
      return videos;
  }
};
