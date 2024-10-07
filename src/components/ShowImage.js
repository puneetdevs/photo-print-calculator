/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import MultipleImageUpload from "./MultiImageUpload";
import useTricera from "./hooks/useTricera";
import { get } from "lodash";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Toast from "react-bootstrap/Toast";
import ImageLoader from "./ImageLoader";
import axios from "axios";
import { CalculateInch } from "./Calculations/Calculation";
import RoomImage from "./RoomImage";

const ShowImage = (props) => {
  const {
    setImageDetails,
    customDimensions,
    imageDetails,
    selectedPaperType,
    selectedImage,
    setSelectedImage,
    radiochecked,
    setRadiochecked,
    inchradiochecked,
    setInchRadiochecked,
    borders,
    measurement,
    id,
    setId,
    frameCode,
    mattings,
    configData,
    setConfigData,
    status,
    setStatus,
    croppedImage,
    setCroppedImage,
    resetDimensions,
    setResetDimensions,
    activeKey,
    cropper,
    setCropper,
    activeIndex,
    setActiveIndex,
    waitForCroppedImage,
    incheschecked,
    setIncheschecked,
    setFinalConversion,
    SetMeasurement,
    setChecked,
    setYesButton,
    setSelectedPaperType,
    setBorders,
    setYesCheck,
    setBorderNo,
    radioToggle,
    setRadioToggle,
    setMattings,
    setMoutingType,
    setFrameCode,
    setFrameOptions,
    setMatting,
    setFramesize,
    setPly,
    setGlass,
    setCheckoutUrl,
    frameOptions,
    blobs,
    setBlobs,
    setCartId,
    setcartQuantity,
    acceptAction,
    setAcceptAction,
    dimensionBoxFinish,
    setDimensionBoxFinish,
    getCropData,
    setActiveKey,
    open,
    open1,
    open2,
    open3,
    setOpen,
    setOpen1,
    setOpen2,
    setOpen3,
    backGroundImage,
    setBackGroundImage,
    setShowIcons,
    sessionExist,
    setSessionExist,
    setPrintingFramingSubtotal,
    setPrice,
    setMouldingPrice,
    showFrameImage,
    setShowFrameImage,
    border,
    setBorder,
    border1,
    setBorder1,
    border2,
    setBorder2,
    border3,
    setBorder3,
    blob,
    setBlob,
  } = props;

  const { configs } = useTricera();
  const imageData = get(configs, "data", []);
  const imageGetter = get(imageData, "0.config", "");
  const { getUUID } = useTricera();

  const [showCompressedImage, setShowCompressedImage] = useState(true);
  const [waitForImageRendering, setWaitForImageRendering] = useState(true);
  const [waitForCropper, setWaitForCropper] = useState(true);
  // const [option, setOption] = useState(getLocalItem());
  const [screenWidth, setScreenWidth] = useState();
  const [dimensions, setDimensions] = useState({ dimensions: {} });

  if (window.addEventListener) {
    window.addEventListener(
      "resize",
      function () {
        setScreenWidth(window.screen.width);
      },
      true
    );
  }

  if (window.addEventListener) {
    window.addEventListener(
      "load",
      function () {
        setScreenWidth(window.screen.width);
      },
      true
    );
  }

  const checkoutlocalStorage = async () => {
    const dataCheckout = JSON.parse(localStorage.getItem("checkoutdata"));
    if (dataCheckout) {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/user/cartValid`,
        headers: {
          "Content-Type": "application/json",
        },
        processData: false,
        data: { id: dataCheckout?.cart_id },
      }).then((res2) => {
        if (res2) {
          if (res2?.data?.data?.cart == null) {
            // localStorage.removeItem("checkoutdata");
            // localStorage.removeItem("checkoutButton");
            setCheckoutUrl("");
            setCartId("");
            setcartQuantity("");
          }
        }
      });
    }
  };

  const [loadingBig, setLoadingBig] = useState(true);

  useEffect(() => {
    checkoutlocalStorage();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowCompressedImage(false);
    }, 3000);
  }, [selectedImage]);

  useEffect(() => {
    if (cropper) {
      cropper.setAspectRatio(
        //Number(customDimensions?.width) / Number(customDimensions?.height)
        customDimensions?.width / customDimensions?.height
      );
    }
  }, [customDimensions, cropper]);

  useEffect(() => {
    blobs.map((item) => {
      if (item?.id === id) {
        setBlob(item);
      } else {
        setBlob();
      }
    });
  }, [blobs, id]);

  useEffect(() => {
    setBackGroundImage({
      src: blob
        ? blob
        : `${process.env.REACT_APP_API_URL}/public/` + selectedImage?.filename,
      style: "background-deafult",
      toggle: false,
    });
  }, []);

  useEffect(() => {
    if (imageData?.length > 0) {
      setSelectedImage(imageGetter);
    }
  }, [imageGetter]);

  useEffect(() => {
    if (imageData) {
      setId(imageData[0]?._id);
    }
  }, [imageData]);

  useEffect(() => {
    if (activeKey === "2") {
      setBorder({ border: true });
      setBorder1({ border1: false });
      setBorder2({ border1: false });
      setShowFrameImage(false);
      setBackGroundImage({
        src: blob?.blob
          ? blob?.blob
          : `${process.env.REACT_APP_API_URL}/public` + selectedImage?.filename,
        style: "background-deafult",
        toggle: false,
      });
    }
  }, [activeKey]);

  useEffect(() => {
    setWaitForCropper(true);
    if (!status) {
      setTimeout(() => {
        setWaitForCropper(false);
      }, 4000);
    }
  }, [status, backGroundImage]);

  useEffect(() => {
    setTimeout(() => {
      setWaitForImageRendering(false);
    }, 3000);
  }, []);

  const onImgLoad = ({ target: img }) => {
    setDimensions({ dimensions: { width: img.clientWidth } });
    setLoadingBig(false);
  };

  let imgSrc = (blob?.blob) ? blob?.blob : `${process.env.REACT_APP_API_URL}/public/` + selectedImage?.filename

  var imageContainer =
    frameOptions &&
    frameCode?.Colour === "Black" &&
    frameCode?.Size === "Medium"
      ? "frame-preview-black-medium"
      : frameOptions &&
        frameCode?.Colour === "Black" &&
        frameCode?.Size === "Large"
      ? "frame-preview-black-large"
      : frameOptions &&
        frameCode?.Colour === "Black" &&
        frameCode?.Size === "Standard"
      ? "frame-preview-black-standard"
      : frameOptions &&
        frameCode?.Colour === "White" &&
        frameCode?.Size === "Small"
      ? "frame-preview-white-small"
      : frameOptions &&
        frameCode?.Colour === "White" &&
        frameCode?.Size === "Medium"
      ? "frame-preview-white-medium"
      : frameOptions &&
        frameCode?.Colour === "White" &&
        frameCode?.Size === "Large"
      ? "frame-preview-white-large"
      : frameOptions &&
        frameCode?.Colour === "White" &&
        frameCode?.Size === "Standard"
      ? "frame-preview-white-standard"
      : frameOptions &&
        frameCode?.Colour === "Maple" &&
        frameCode?.Size === "Small"
      ? "frame-preview-maple-small"
      : frameOptions &&
        frameCode?.Colour === "Maple" &&
        frameCode?.Size === "Medium"
      ? "frame-preview-maple-medium"
      : frameOptions &&
        frameCode?.Colour === "Maple" &&
        frameCode?.Size === "Large"
      ? "frame-preview-maple-large"
      : frameOptions &&
        frameCode?.Colour === "Maple" &&
        frameCode?.Size === "Standard"
      ? "frame-preview-maple-standard"
      : frameOptions &&
        frameCode?.Colour === "Grey" &&
        frameCode?.Size === "Small"
      ? "frame-preview-grey-small"
      : frameOptions &&
        frameCode?.Colour === "Grey" &&
        frameCode?.Size === "Medium"
      ? "frame-preview-grey-medium"
      : frameOptions &&
        frameCode?.Colour === "Grey" &&
        frameCode?.Size === "Large"
      ? "frame-preview-grey-large"
      : frameOptions &&
        frameCode?.Colour === "Grey" &&
        frameCode?.Size === "Standard"
      ? "frame-preview-grey-standard"
      : "";

  var paperWidth = Number(customDimensions?.width);
  var paperHeight = Number(customDimensions?.height);
  var calValMeasure = Math.floor(
    measurement === "cm"
      ? (Number(dimensions.dimensions.width) * 2.54) / paperWidth
      : Number(dimensions.dimensions.width) / paperWidth
  );
  var calVal =
    calValMeasure > 6 ? (calValMeasure > 10 ? 10 : calValMeasure) : 6;
  var byIn = 5;
  var byCm = 2;

  var InchforUpper = CalculateInch(selectedImage?.height, selectedImage?.width);

  var thumbUpperWidth = Math.floor(InchforUpper.width) > 3 ? 0.7 : 4;

  var customDimensionsWidth =
    measurement === "cm"
      ? Number(customDimensions?.width / 2.54)
      : Number(customDimensions?.width);

  var customDimensionsHeight =
    measurement === "cm"
      ? Number(customDimensions?.height / 2.54)
      : Number(customDimensions?.height);

  var bgWidth =
    customDimensionsWidth * byIn +
    Number(borders?.Left) +
    Number(borders?.Right) +
    Number(mattings?.Left) +
    Number(mattings?.Right);

  var bgHeight =
    customDimensionsHeight * byIn +
    Number(borders?.Top) +
    Number(borders?.Bottom) +
    Number(mattings?.Top) +
    Number(mattings?.Bottom);

  var bgMaxWidth = 100;
  var bgMinWidth = 20;

  const upperCalculation = (value) => {
    return value > 36 ? 36 : value;
  };

  var upperDivision = {
    height: `${upperCalculation(
      Math.floor(InchforUpper.height * thumbUpperWidth)
    )}px`,
    // width: `${upperCalculation(Math.floor(InchforUpper.width * thumbUpperWidth))}px`,
    maxWidth: 36,
    minWidth: 16,
  };

  var currentMatting = false;
  if (
    Number(mattings?.Left) !== 0 ||
    Number(mattings?.Top) !== 0 ||
    Number(mattings?.Right) !== 0 ||
    Number(mattings?.Bottom) !== 0
  ) {
    currentMatting = true;
  }

  var currentBorder = false;
  if (
    Number(borders?.Left) !== 0 ||
    Number(borders?.Top) !== 0 ||
    Number(borders?.Right) !== 0 ||
    Number(borders?.Bottom) !== 0
  ) {
    currentBorder = true;
  }

  return (
    <div className="center_white_box">
      <div className="container">
        <div className="image-transformation">
          <div className="thumbnail-area thumbnail-area-mobile">
            <div
              className={
                (border?.border ? "borderThumnail" : "thumbnail") +
                " thumbnail-div "
              }
              style={{ width: "auto" }}
            >
              <ImageLoader
                src={
                  blob?.blob
                    ? blob?.blob
                    : `${process.env.REACT_APP_API_URL}/public/` +
                      selectedImage?.filename
                }
                onClick={(event) => {
                  setBorder3({ border3: false });
                  setBorder({ border: true });
                  setBorder1({ border1: false });
                  setBorder2({ border1: false });
                  setShowFrameImage(false);
                  setBackGroundImage({
                    src: blob?.blob
                      ? blob?.blob
                      : `${process.env.REACT_APP_API_URL}/public` +
                        selectedImage?.filename,
                    style: "background-deafult",
                    toggle: false,
                  });
                }}
                style={{
                  width: "auto",
                }}
                alt=""
              />
            </div>
            <div
              className={
                (border1.border1 === true ? "borderThumnail1" : "thumbnail1") +
                " thumbnail-div"
              }
            >
              <div className="upper-division">
                
                <div className="upper" style={upperDivision}>
                  <div
                    className={`upper-frame-box ${
                      frameOptions &&
                      frameCode?.Colour === "Black" &&
                      frameCode?.Size === "Small"
                        ? "frame-preview-black-small"
                        : imageContainer
                    }`}
                    style={
                      frameOptions
                        ? {
                            borderWidth: `${borders?.Top / byIn}px`,
                            boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                          }
                        : {}
                    }
                  >
                    <div
                      className="upper-matting-box"
                      style={
                        mattings?.Top
                          ? {
                              borderTop: `${mattings?.Top / byIn}px solid #fff`,
                              borderRight: `${
                                mattings?.Right / byIn
                              }px solid #fff`,
                              borderBottom: `${
                                mattings?.Bottom / byIn
                              }px solid #fff`,
                              borderLeft: `${
                                mattings?.Left / byIn
                              }px solid #fff`,
                              boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                            }
                          : {}
                      }
                    >
                      <div
                        className="upper-border-box"
                        style={
                          borders?.Top
                            ? {
                                borderTop: `${
                                  borders?.Top / byIn
                                }px solid #fff`,
                                borderRight: `${
                                  borders?.Right / byIn
                                }px solid #fff`,
                                borderBottom: `${
                                  borders?.Bottom / byIn
                                }px solid #fff`,
                                borderLeft: `${
                                  borders?.Left / byIn
                                }px solid #fff`,
                                boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                              }
                            : {}
                        }
                      >
                        <ImageLoader
                          src={
                            blob?.blob
                              ? blob?.blob
                              : `${process.env.REACT_APP_API_URL}/public/` +
                                selectedImage?.filename
                          }
                          // style={{
                          //   paddingTop: `${borders?.Top / byIn}px`,
                          //   paddingRight: `${borders?.Right / byIn}px`,
                          //   paddingBottom: `${borders?.Bottom / byIn}px`,
                          //   paddingLeft: `${borders?.Left / byIn}px`,
                          //   height: "100%",
                          //   width: "100%",
                          // }}
                          alt=""
                          onClick={(e) => {
                            setBorder1({ border1: true });
                            setBorder({ border: false });
                            setBorder2({ border2: false });
                            setBorder3({ border3: false });
                            setShowFrameImage(false);
                            setBackGroundImage({
                              src: "../images/horizontal-frame.jpg",
                              style: "background-first",
                              toggle: true,
                            });
                            setRadiochecked(false);
                            setInchRadiochecked(false);
                            setCroppedImage(null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img
                className="background-changer"
                src="../images/horizontal-frame.jpg"
                onClick={(event) => {
                  setBorder1({ border1: true });
                  setBorder({ border: false });
                  setBorder2({ border2: false });
                  setBorder3({ border3: false });
                  setShowFrameImage(false);
                  setBackGroundImage({
                    src: event.target.src,
                    style: "background-first",
                    toggle: true,
                  });
                  setRadiochecked(false);
                  setInchRadiochecked(false);
                  setCroppedImage(null);
                }}
              />
            </div>

            <div
              className={
                (border2.border2 === true ? "borderThumnail2" : "thumbnail2") +
                " thumbnail-div"
              }
            >
              <div className="upper-division">
                <div className="upper1" style={upperDivision}>
                  <div
                    className={`upper-frame-box ${
                      frameOptions &&
                      frameCode?.Colour === "Black" &&
                      frameCode?.Size === "Small"
                        ? "frame-preview-black-small"
                        : imageContainer
                    }`}
                    style={
                      frameOptions
                        ? {
                            borderWidth: `${borders?.Top / byIn}px`,
                            boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                          }
                        : {}
                    }
                  >
                    <div
                      className="upper-matting-box"
                      style={
                        mattings?.Top
                          ? {
                              borderTop: `${mattings?.Top / byIn}px solid #fff`,
                              borderRight: `${
                                mattings?.Right / byIn
                              }px solid #fff`,
                              borderBottom: `${
                                mattings?.Bottom / byIn
                              }px solid #fff`,
                              borderLeft: `${
                                mattings?.Left / byIn
                              }px solid #fff`,
                              boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                            }
                          : {}
                      }
                    >
                      <div
                        className="upper-border-box"
                        style={
                          borders?.Top
                            ? {
                                borderTop: `${
                                  borders?.Top / byIn
                                }px solid #fff`,
                                borderRight: `${
                                  borders?.Right / byIn
                                }px solid #fff`,
                                borderBottom: `${
                                  borders?.Bottom / byIn
                                }px solid #fff`,
                                borderLeft: `${
                                  borders?.Left / byIn
                                }px solid #fff`,
                                boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                              }
                            : {}
                        }
                      >
                        <ImageLoader
                          src={
                            blob?.blob
                              ? blob?.blob
                              : `${process.env.REACT_APP_API_URL}/public/` +
                                selectedImage?.filename
                          }
                          // style={{
                          //   paddingTop: `${borders?.Top / byIn}px`,
                          //   paddingRight: `${borders?.Right / byIn}px`,
                          //   paddingBottom: `${borders?.Bottom / byIn}px`,
                          //   paddingLeft: `${borders?.Left / byIn}px`,
                          //   height: "100%",
                          //   width: "100%",
                          // }}
                          alt=""
                          onClick={(e) => {
                            setBorder3({ border3: false });
                            setBorder2({ border2: true });
                            setBorder({ border: false });
                            setBorder1({ border1: false });
                            setShowFrameImage(false);
                            setBackGroundImage({
                              src: "../images/vertical-frame.jpg",
                              style: "background-second",
                              toggle: true,
                            });
                            setRadiochecked(false);
                            setInchRadiochecked(false);
                            setCroppedImage(null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img
                src="../images/vertical-frame.jpg"
                onClick={(event) => {
                  setBorder3({ border3: false });
                  setBorder2({ border2: true });
                  setBorder({ border: false });
                  setBorder1({ border1: false });
                  setShowFrameImage(false);
                  setBackGroundImage({
                    src: event.target.src,
                    style: "background-second",
                    toggle: true,
                  });
                  setRadiochecked(false);
                  setInchRadiochecked(false);
                  setCroppedImage(null);
                }}
                alt=""
              />
            </div>
            {selectedPaperType ? (
              <div
                className={
                  (border3.border3 === true
                    ? "borderThumnail3"
                    : "thumbnail3") + " thumbnail-div"
                }
              >
                <img
                  src={
                    `${process.env.REACT_APP_API_URL}/frames/` +
                    selectedPaperType?.image
                  }
                  onClick={(event) => {
                    setBorder3({ border3: true });
                    setBorder2({ border2: false });
                    setBorder({ border: false });
                    setBorder1({ border1: false });
                    setShowFrameImage(true);
                    setBackGroundImage({
                      src: event.target.src,
                      style: "background-deafult",
                      toggle: false,
                    });
                    setRadiochecked(false);
                    setInchRadiochecked(false);
                    setCroppedImage(null);
                  }}
                  alt=""
                />
              </div>
            ) : null}
          </div>

          <div className="main-inner-section">
            <div className="preview-area">
              {showFrameImage ? (
                <div className="frameBlock">
                  <div
                    className="box-area-sh"
                    style={{
                      boxShadow: "rgb(0 0 0 / 25%) 0px 0.5rem 2rem",
                    }}
                  >
                    <img
                      src={
                        `${process.env.REACT_APP_API_URL}/frames/` +
                        selectedPaperType?.image
                      }
                      className={
                        backGroundImage?.style === ""
                          ? "deafult"
                          : backGroundImage?.style
                      }
                      style={{
                        boxShadow: "rgb(0 0 0 / 25%) 0px 0.5rem 2rem",
                      }}
                      alt=""
                    />
                  </div>
                  <p className="papertype-discription">
                    {selectedPaperType?.discription}
                  </p>
                </div>
              ) : backGroundImage?.toggle ? (
                <div
                  className={
                    backGroundImage.style === ""
                      ? "deafult"
                      : `${backGroundImage?.style}` 
                      // ${
                      //     frameOptions &&
                      //     frameCode?.Colour === "Black" &&
                      //     frameCode?.Size === "Small"
                      //       ? "frame-preview-black-small"
                      //       : imageContainer
                      //   }`
                  }
                  style={{
                    maxWidth: bgMaxWidth,
                    // minWidth: bgMinWidth,
                    // minHeight: bgMinWidth,
                    // height: "auto",
                    // width: "auto",
                    width: `${bgWidth > bgMaxWidth ? bgMaxWidth : bgWidth}px`,
                    // height: `${
                    //   bgHeight > bgMaxWidth ? bgMaxWidth : bgHeight
                    // }px`,
                    // outlineWidth: `${frameCode?.Size === "Small"
                    //   ? 2.5 / byCm
                    //   : frameCode?.Size === "Standard" ||
                    //     frameCode?.Size === "Medium"
                    //     ? 5 / byCm
                    //     : 7.5 / byCm
                    //   }px`,
                    // borderWidth: `${
                    //   frameCode?.Size === "Small"
                    //     ? 5 / calVal + 1
                    //     : frameCode?.Size === "Large"
                    //     ? 15 / calVal + 1
                    //     : frameCode?.Size === "Standard" ||
                    //       frameCode?.Size === "Medium"
                    //     ? 10 / calVal + 1
                    //     : 0
                    // }px`,
                  }}
                >
                  {/* hello */}
                  <RoomImage
                    loadingBig={loadingBig}
                    backGroundImage={backGroundImage}
                    frameOptions={frameOptions}
                    frameCode={frameCode}
                    imageContainer={imageContainer}
                    customDimensions={customDimensions}
                    mattings={mattings}
                    imgSrc={imgSrc}
                    calVal={calVal}
                    selectedImage={selectedImage}
                    onImgLoad={onImgLoad}
                    borders={borders}
                    currentMatting={currentMatting}
                    room={byIn}
                  />
                  {/* <div
                    className="custom-bd"
                    style={{
                      borderTop: `${
                        Number(mattings?.Top) / byCm
                      }px solid white`,
                      borderRight: `${
                        Number(mattings?.Right) / byCm
                      }px solid white`,
                      borderBottom: `${
                        Number(mattings?.Bottom) / byCm
                      }px solid white`,
                      borderLeft: `${
                        Number(mattings?.Left) / byCm
                      }px solid white`,
                      boxShadow: "rgb(0 0 0 / 50%) 0 0 5px",
                    }}
                  >
                    <img
                      src={
                        blob?.blob
                          ? blob?.blob
                          : `${process.env.REACT_APP_API_URL}/public/` +
                            selectedImage?.filename
                      }
                      className="bg-inner"
                      style={{
                        borderTop: `${
                          Number(borders?.Top) / byCm
                        }px solid white`,
                        borderRight: `${
                          Number(borders?.Right) / byCm
                        }px solid white`,
                        borderBottom: `${
                          Number(borders?.Bottom) / byCm
                        }px solid white`,
                        borderLeft: `${
                          Number(borders?.Left) / byCm
                        }px solid white`,

                        // height: `${
                        //   measurement === "cm"
                        //     ? Number(customDimensions?.height) * byCm +
                        //       Number(borders?.Top) +
                        //       Number(borders?.Bottom) +
                        //       Number(mattings?.Top) +
                        //       Number(mattings?.Bottom)
                        //     : Number(customDimensions?.height) * byIn +
                        //       Number(borders?.Top) +
                        //       Number(borders?.Bottom) +
                        //       Number(mattings?.Top) +
                        //       Number(mattings?.Bottom)
                        // }px`,
                        // width: "100%",
                        outline: `${
                          frameOptions &&
                          (Number(mattings?.Left) !== 0 ||
                            Number(mattings?.Top) !== 0 ||
                            Number(mattings?.Right) !== 0 ||
                            Number(mattings?.Bottom) !== 0)
                            ? "0.7px solid"
                            : null
                        }`,
                      }}
                      alt=""
                    />
                  </div> */}
                </div>
              ) : radiochecked || inchradiochecked ? (
                croppedImage || status ? (
                  <>
                    {waitForCroppedImage ? (
                      <div
                        style={{
                          height: 413,
                          backgroundColor: "transparent",
                          margin: "0 auto",
                        }}
                        className="waitloader"
                      >
                        <div className="waitloaderouter">
                          <img
                            style={{
                              height: "150px",
                              margin: "auto",
                              display: "flex",
                              marginTop: "0px",
                              flexWrap: "wrap",
                            }}
                            src="../images/loader.gif"
                            alt=""
                          />{" "}
                          <div>Please wait. Image is loading ...</div>
                        </div>
                      </div>
                    ) : (
                      <div className="static-block 1">
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
                          style={{
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
                          }}
                        >
                          <div
                            style={{
                              borderTop: `${
                                Number(mattings?.Top) * calVal
                              }px solid white`,
                              borderRight: `${
                                Number(mattings?.Right) * calVal
                              }px solid white`,
                              borderBottom: `${
                                Number(mattings?.Bottom) * calVal
                              }px solid white`,
                              borderLeft: `${
                                Number(mattings?.Left) * calVal
                              }px solid white`,
                              boxShadow: "0 0.5rem 2rem rgb(0 0 0 / 25%)",
                            }}
                          >
                            <img
                              src={
                                blob?.blob
                                  ? blob?.blob
                                  : `${process.env.REACT_APP_API_URL}/public/` +
                                    selectedImage?.filename
                              }
                              alt=""
                              className="renderedImage crp"
                              onLoad={onImgLoad}
                              style={{
                                borderTop: `${
                                  Number(borders?.Top) * calVal
                                }px solid white`,
                                borderRight: `${
                                  Number(borders?.Right) * calVal
                                }px solid white`,
                                borderBottom: `${
                                  Number(borders?.Bottom) * calVal
                                }px solid white`,
                                borderLeft: `${
                                  Number(borders?.Left) * calVal
                                }px solid white`,
                                maxHeight:
                                  Number(mattings?.Left) > 0
                                    ? 280
                                    : frameCode?.Size
                                    ? 380
                                    : 413,
                                outline: `${
                                  frameOptions !== "" && currentMatting
                                    ? "1px solid"
                                    : ""
                                }`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {waitForCropper ? (
                      <div className="w-2/3 m-auto position-absolute cropper-toaster Cropper">
                        <Toast style={{ width: "320px" }}>
                          <Toast.Body>
                            <div className="custom_toaster text-left">
                              <img
                                className="gif-img"
                                src="../images/circle.svg"
                              />

                              <img />
                              <h6>Please wait</h6>
                              <span>Image is loading ...</span>

                              <div className="close_icon">
                                <span onClick={() => setWaitForCropper(false)}>
                                  {" "}
                                  <svg
                                    width="8"
                                    height="8"
                                    viewBox="0 0 8 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.5875 4L7.2125 1.37917C7.29096 1.30071 7.33503 1.19429 7.33503 1.08333C7.33503 0.972375 7.29096 0.865961 7.2125 0.787501C7.13404 0.709041 7.02762 0.664963 6.91666 0.664963C6.8057 0.664963 6.69929 0.709041 6.62083 0.787501L4 3.4125L1.37916 0.787501C1.3007 0.709041 1.19429 0.664963 1.08333 0.664963C0.972369 0.664963 0.865955 0.709041 0.787495 0.787501C0.709035 0.865961 0.664957 0.972375 0.664957 1.08333C0.664957 1.19429 0.709035 1.30071 0.787495 1.37917L3.4125 4L0.787495 6.62083C0.748441 6.65957 0.717444 6.70565 0.69629 6.75643C0.675137 6.8072 0.664246 6.86166 0.664246 6.91667C0.664246 6.97167 0.675137 7.02613 0.69629 7.07691C0.717444 7.12768 0.748441 7.17377 0.787495 7.2125C0.826229 7.25155 0.872313 7.28255 0.923088 7.30371C0.973863 7.32486 1.02832 7.33575 1.08333 7.33575C1.13833 7.33575 1.19279 7.32486 1.24357 7.30371C1.29434 7.28255 1.34043 7.25155 1.37916 7.2125L4 4.5875L6.62083 7.2125C6.65956 7.25155 6.70565 7.28255 6.75642 7.30371C6.8072 7.32486 6.86166 7.33575 6.91666 7.33575C6.97167 7.33575 7.02613 7.32486 7.0769 7.30371C7.12768 7.28255 7.17376 7.25155 7.2125 7.2125C7.25155 7.17377 7.28255 7.12768 7.3037 7.07691C7.32485 7.02613 7.33574 6.97167 7.33574 6.91667C7.33574 6.86166 7.32485 6.8072 7.3037 6.75643C7.28255 6.70565 7.25155 6.65957 7.2125 6.62083L4.5875 4Z"
                                      fill="#939393"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </Toast.Body>
                        </Toast>
                      </div>
                    ) : null}

                    <div className="imageback1 static-block">
                      <div
                        className="image-background2"
                        style={{ margin: "0 auto" }}
                      >
                        <Cropper
                          initialAspectRatio={
                            //Number(customDimensions?.width) / Number(customDimensions?.height)
                            customDimensions?.width / customDimensions?.height
                          }
                          src={
                            `${process.env.REACT_APP_API_URL}/public/` +
                            selectedImage?.filename
                          }
                          style={{ height: 413, width: "100%" }}
                          viewMode={2}
                          minCropBoxHeight={1}
                          minCropBoxWidth={11}
                          background={false}
                          responsive={true}
                          autoCropArea={1}
                          onInitialized={(instance) => {
                            setCropper(instance);
                          }}
                          guides={false}
                        />
                      </div>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div
                    style={{
                      height: 413,
                      backgroundColor: "transparent",
                      margin: "0 auto",
                      display: loadingBig ? "flex" : "none",
                    }}
                    className="waitloader"
                  >
                    <div className="waitloaderouter">
                      <img
                        style={{
                          height: "150px",
                          margin: "auto",
                          display: "flex",
                          marginTop: "0px",
                          flexWrap: "wrap",
                        }}
                        src="../images/loader.gif"
                        alt=""
                      />{" "}
                      <div>Please wait. Image is loading ...</div>
                    </div>
                  </div>
                  {/* room  */}
                  <RoomImage
                    loadingBig={loadingBig}
                    backGroundImage={backGroundImage}
                    frameOptions={frameOptions}
                    frameCode={frameCode}
                    imageContainer={imageContainer}
                    customDimensions={customDimensions}
                    mattings={mattings}                    
                    imgSrc={imgSrc}
                    calVal={calVal}
                    selectedImage={selectedImage}
                    onImgLoad={onImgLoad}
                    borders={borders}
                    currentMatting={currentMatting}
                  />
                  {/* <div
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
                      style={{
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
                      }}
                    >
                      <div
                        style={{
                          border: `${
                            frameCode?.Size ? 1 : 0
                          }px solid rgba(0, 0, 0, 0.4)`,
                          boxShadow: "0 0.5rem 2rem rgb(0 0 0 / 25%)",
                        }}
                      >
                        <div
                          style={{
                            borderTop: `${
                              Number(mattings?.Top) * calVal
                            }px solid white`,
                            borderRight: `${
                              Number(mattings?.Right) * calVal
                            }px solid white`,
                            borderBottom: `${
                              Number(mattings?.Bottom) * calVal
                            }px solid white`,
                            borderLeft: `${
                              Number(mattings?.Left) * calVal
                            }px solid white`,
                          }}
                        >
                          <img
                            src={
                              blob?.blob
                                ? blob?.blob
                                : `${process.env.REACT_APP_API_URL}/public/` +
                                  selectedImage?.filename
                            }
                            alt=""
                            className="renderedImage"
                            onLoad={onImgLoad}
                            style={{
                              borderTop: `${
                                Number(borders?.Top) * calVal
                              }px solid white`,
                              borderRight: `${
                                Number(borders?.Right) * calVal
                              }px solid white`,
                              borderBottom: `${
                                Number(borders?.Bottom) * calVal
                              }px solid white`,
                              borderLeft: `${
                                Number(borders?.Left) * calVal
                              }px solid white`,
                              maxHeight:
                                Number(mattings?.Left) > 0
                                  ? 280
                                  : frameCode?.Size
                                  ? 380
                                  : 413,
                              outline: `${
                                frameOptions !== "" && currentMatting
                                  ? "1px solid"
                                  : ""
                              }`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}
                </>
              )}
            </div>

            {backGroundImage.toggle ? (
              <div className="image-backgrounds-div">
                <img
                  src={backGroundImage.src}
                  className="image-background1"
                  style={{
                    boxShadow: "0 0.5rem 2rem rgb(0 0 0 / 25%)",
                  }}
                  alt=""
                />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="upload-area">
            <div className="browse-img">
              <MultipleImageUpload
                setSelectedPaperType={setSelectedPaperType}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setImageDetails={setImageDetails}
                getUUID={getUUID}
                configData={configData}
                setConfigData={setConfigData}
                id={id}
                setId={setId}
                status={status}
                setStatus={setStatus}
                setCroppedImage={setCroppedImage}
                resetDimensions={resetDimensions}
                setResetDimensions={setResetDimensions}
                activeKey={activeKey}
                customDimensions={customDimensions}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setMoutingType={setMoutingType}
                setFrameCode={setFrameCode}
                setBorders={setBorders}
                setFrameOptions={setFrameOptions}
                setMatting={setMatting}
                setFramesize={setFramesize}
                setPly={setPly}
                setGlass={setGlass}
                setMattings={setMattings}
                radioToggle={radioToggle}
                setRadioToggle={setRadioToggle}
                blob={blob}
                blobs={blobs}
                setShowIcons={setShowIcons}
                open={open}
                open1={open1}
                open2={open2}
                open3={open3}
                setOpen={setOpen}
                setOpen1={setOpen1}
                setOpen2={setOpen2}
                setOpen3={setOpen3}
                setActiveKey={setActiveKey}
                setChecked={setChecked}
                incheschecked={incheschecked}
                setIncheschecked={setIncheschecked}
                sessionExist={sessionExist}
                setSessionExist={setSessionExist}
                measurement={measurement}
                SetMeasurement={SetMeasurement}
                setPrintingFramingSubtotal={setPrintingFramingSubtotal}
                setPrice={setPrice}
                setMouldingPrice={setMouldingPrice}
                radiochecked={radiochecked}
                setRadiochecked={setRadiochecked}
                inchradiochecked={inchradiochecked}
                setInchRadiochecked={setInchRadiochecked}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShowImage;
