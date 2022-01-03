import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  addVideoToUserCollection,
  fetchVideosForPlaylist,
} from "../../../redux/actions/videos";
import { useLocation } from "react-router";
import Video from "./Video";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { addPlaylistToUserCollection } from "../../../redux/actions/playlists";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

const handleDragEnd = (
  result,
  columns,
  setColumns,
  addVideoToUserCollection
) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    let status;
    if (destination.droppableId.split("_").length === 3) {
      status = destination.droppableId.split("_")[2];
    } else {
      status = destination.droppableId.split("_")[1];
    }
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.videos];
    const destinationItems = [...destinationColumn.videos];
    const [removed] = sourceItems.splice(source.index, 1);
    addVideoToUserCollection(removed, status);
    destinationItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        videos: sourceItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        videos: destinationItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.videos];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        videos: copiedItems,
      },
    });
  }
};

const PlaylistContent = ({
  videos,
  fetchVideosForPlaylist,
  addPlaylistToUserCollection,
  addVideoToUserCollection,
  pid,
  profile,
}) => {
  const [columns, setColumns] = useState({
    [`${pid}_todo`]: {
      name: "Todo",
      videos: videos,
    },
    [`${pid}_inProgress`]: {
      name: "In Progress",
      videos: [],
    },
    [`${pid}_done`]: {
      name: "Done",
      videos: [],
    },
  });
  const location = useLocation();
  useEffect(() => {
    const playlistId = location.pathname.split("/")[2];
    fetchVideosForPlaylist(playlistId);
  }, [location]);
  useEffect(() => {
    const playlistId = location.pathname.split("/")[2];
    try {
      const videoIds = profile?.playlists
        ? profile?.playlists[playlistId]["done"]
            .map((video) => video.snippet.resourceId.videoId)
            .concat(
              profile?.playlists[playlistId]["inProgress"].map(
                (video) => video.snippet.resourceId.videoId
              )
            )
        : [];
      setColumns({
        [`${pid}_todo`]: {
          name: "Todo",
          videos: videos.filter(
            (video) => !videoIds.includes(video.snippet.resourceId.videoId)
          ),
        },
        [`${pid}_inProgress`]: {
          name: "In Progress",
          videos: profile?.playlists[pid]["inProgress"],
        },
        [`${pid}_done`]: {
          name: "Done",
          videos: profile?.playlists[pid]["done"],
        },
      });
    } catch (error) {
      setColumns({
        [`${pid}_todo`]: {
          name: "Todo",
          videos: videos,
        },
        [`${pid}_inProgress`]: {
          name: "In Progress",
          videos: [],
        },
        [`${pid}_done`]: {
          name: "Done",
          videos: [],
        },
      });
    }
  }, [videos, profile]);
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(result, columns, setColumns, addVideoToUserCollection)
        }
      >
        {Object.entries(columns).map(([columnId, column], index) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            key={columnId}
          >
            <div className="position-fixed lead font-weight-bold">
              {column.name}
            </div>
            <div style={{ margin: "35px 8px 8px 8px", overflowY: "scroll" }}>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: 250,
                      minHeight: "10000px",
                    }}
                  >
                    {column.videos?.map((video, index) => (
                      <Video
                        video={video["snippet"]}
                        videoId={video.snippet.resourceId.videoId}
                        index={index}
                        key={video.id}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  const profiles = state.firestore.data.profiles;
  const profile = profiles ? profiles[state.firebase.auth.uid] : null;

  return {
    videos: state.videos,
    pid: props.match.params.id,
    profile: profile,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchVideosForPlaylist: (playlistId) =>
      dispatch(fetchVideosForPlaylist(playlistId)),
    addPlaylistToUserCollection: (playlistId) =>
      dispatch(addPlaylistToUserCollection(playlistId)),
    addVideoToUserCollection: (videoId, status) =>
      dispatch(addVideoToUserCollection(videoId, status)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "profiles",
    },
  ])
)(PlaylistContent);
