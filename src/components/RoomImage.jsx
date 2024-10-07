import React from "react";

function RoomImage(props) {
  const {
    loadingBig,
    backGroundImage,
    frameOptions,
    frameCode,
    imageContainer,
    customDimensions,
    mattings,
    calVal,
    imgSrc,
    selectedImage,
    onImgLoad,
    borders,
    currentMatting,
    room,
  } = props;
  console.log("blob", imgSrc);
  console.log("room", room);
  let calc = 1;
  if (room !== undefined) {
    calc = room;
  }
  return (
    <div
      className="static-block 2"
      style={{ display: loadingBig ? "none" : "flex" }}
    >
      <div
        className={
          backGroundImage.style === ""
            ? "deafult image-background2"
            : ` ${
                frameOptions &&
                frameCode?.Colour === "Black" &&
                frameCode?.Size === "Small"
                  ? "frame-preview-black-small"
                  : imageContainer
              } image-background2`
        }
        style={
          room !== undefined && frameCode?.Size
            ? {
                margin: `${
                  Number(customDimensions?.height) >
                  Number(customDimensions?.width)
                    ? "0 auto"
                    : Number(customDimensions?.height) ===
                      Number(customDimensions?.width)
                    ? "0 auto"
                    : "0 auto"
                }`,
                boxShadow: "0 0.5rem 2rem rgb(0 0 0 / 25%)",
                borderWidth:
                  frameCode?.Size === "Small"
                    ? 2.5
                    : frameCode?.Size === "Medium" || "Standard"
                    ? 5
                    : 7.4,
              }
            : {
                margin: `${
                  Number(customDimensions?.height) >
                  Number(customDimensions?.width)
                    ? "0 auto"
                    : Number(customDimensions?.height) ===
                      Number(customDimensions?.width)
                    ? "0 auto"
                    : "0 auto"
                }`,
                boxShadow: "0 0.5rem 2rem rgb(0 0 0 / 25%)",

                // maxWidth: `${
                //   Number(customDimensions?.height) >
                //   Number(customDimensions?.width)
                //     ? 40
                //     : Number(customDimensions?.height) ===
                //       Number(customDimensions?.width)
                //     ? 40
                //     : 70
                // }%`,
              }
        }
      >
        <div
          style={{
            border: `${frameCode?.Size ? 1 : 0}px solid rgba(0, 0, 0, 0.4)`,
            boxShadow: "0 0.5rem 2rem rgb(0 0 0 / 25%)",
          }}
        >
          <div
            style={{
              borderTop: `${
                (Number(mattings?.Top) * calVal) / calc
              }px solid white`,
              borderRight: `${
                (Number(mattings?.Right) * calVal) / calc
              }px solid white`,
              borderBottom: `${
                (Number(mattings?.Bottom) * calVal) / calc
              }px solid white`,
              borderLeft: `${
                (Number(mattings?.Left) * calVal) / calc
              }px solid white`,
            }}
          >
            <img
              src={imgSrc}
              alt=""
              className="renderedImage"
              onLoad={onImgLoad}
              style={{
                borderTop: `${
                  (Number(borders?.Top) * calVal) / calc
                }px solid white`,
                borderRight: `${
                  (Number(borders?.Right) * calVal) / calc
                }px solid white`,
                borderBottom: `${
                  (Number(borders?.Bottom) * calVal) / calc
                }px solid white`,
                borderLeft: `${
                  (Number(borders?.Left) * calVal) / calc
                }px solid white`,
                maxHeight:
                  Number(mattings?.Left) > 0
                    ? 280
                    : frameCode?.Size
                    ? 380
                    : 413,
                outline: `${
                  frameOptions !== "" && currentMatting ? "1px solid" : ""
                }`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomImage;
