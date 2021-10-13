import { Card, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Draggable } from "react-beautiful-dnd";
const Video = ({ videoId, video, index }) => {
  return (
    <Draggable draggableId={videoId} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            userSelect: "none",
            padding: 16,
            margin: "0 0 8px 0",
            minHeight: "50px",
            backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
            color: "white",
            ...provided.draggableProps.style,
          }}
          className="text-center"
        >
          <img
            src={video["thumbnails"]["high"]["url"]}
            style={{ width: "200px", height: "150px" }}
          />
        </div>
      )}
    </Draggable>
  );
};

export default Video;
