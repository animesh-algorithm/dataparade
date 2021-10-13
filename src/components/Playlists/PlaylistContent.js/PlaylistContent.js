import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchVideosForPlaylist } from "../../../redux/actions/videos";
import { useLocation } from "react-router";
import Video from "./Video";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { addPlaylistToUserCollection } from "../../../redux/actions/playlists";

const handleDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.videos];
    const destinationItems = [...destinationColumn.videos];
    const [removed] = sourceItems.splice(source.index, 1);
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
}) => {
  const [columns, setColumns] = useState({
    [uuid()]: {
      name: "Todo",
      videos: videos,
    },
    [uuid()]: {
      name: "In Progress",
      videos: [],
    },
    [uuid()]: {
      name: "Done",
      videos: [],
    },
  });
  const location = useLocation();
  useEffect(() => {
    const playlistId = location.pathname.split("/")[2];
    fetchVideosForPlaylist(playlistId);
    addPlaylistToUserCollection(playlistId);
  }, [location]);
  useEffect(() => {
    setColumns({
      [uuid()]: {
        name: "Todo",
        videos: videos,
      },
      [uuid()]: {
        name: "In Progress",
        videos: [],
      },
      [uuid()]: {
        name: "Done",
        videos: [],
      },
    });
  }, [videos]);
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}
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
                        videoId={video.id}
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

const mapStateToProps = (state) => {
  return {
    videos: state.videos,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVideosForPlaylist: (playlistId) =>
      dispatch(fetchVideosForPlaylist(playlistId)),
    addPlaylistToUserCollection: (playlistId) =>
      dispatch(addPlaylistToUserCollection(playlistId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistContent);
