import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import useTricera from "./hooks/useTricera";
import axios from "axios";
import { Button } from "antd";

import { useHistory } from "react-router-dom";
import { CloseCircleFilled } from "@ant-design/icons";
import Slider from "react-slick";
import ImageLoader from "./ImageLoader";
import LargeUpload from "./Utils/LargeUpload";

let updatefile;

const baseStyle = {
  padding: "1px",
  borderStyle: "none",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

function MultipleImageUpload(props) {
  const [counter, setCounter] = useState(0);
  const [typeError, setTypeError] = useState(false);
  const history = useHistory();
  //const [option, setOption] = useState(getLocalItem());
  const [loading, setLoading] = useState(false);
  const [filess, setFiles] = useState([]);
  const { configs, setConfigSession, getUUID } = useTricera();
  const getTUUID = localStorage.getItem("photoapp-uuid");

  const {
    setSelectedPaperType,
    setSelectedImage,
    setImageDetails,
    selectedImage,
    configData,
    setConfigData,
    id,
    setId,
    setStatus,
    setCroppedImage,
    setResetDimensions,
    activeIndex,
    setActiveIndex,
    setMoutingType,
    setFrameCode,
    setBorders,
    setFrameOptions,
    setMatting,
    setFramesize,
    setPly,
    setGlass,
    setMattings,
    radioToggle,
    setRadioToggle,
    blob,
    blobs,
    setShowIcons,
    open,
    open1,
    open2,
    open3,
    setOpen,
    setOpen1,
    setOpen2,
    setOpen3,
    setActiveKey,
    setChecked,
    setIncheschecked,
    sessionExist,
    setSessionExist,
    measurement,
    SetMeasurement,
    setPrintingFramingSubtotal,
    setPrice,
    setMouldingPrice,
    setcartQuantity,
    radiochecked,
    setRadiochecked,
    inchradiochecked,
    setInchRadiochecked,
  } = props;
  const [showCompressedImage, setShowCompressedImage] = useState(false);
  const [border, setBorder] = useState(false);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    setConfigData(configs.data || configs);
  }, [configs]);

  // const handleUpload = (FilesData) => {
  //   const formData = new FormData();
  //   FilesData.forEach((file) => {
  //     formData.append("photo", file);
  //   });
  //   formData.append("uuid", getUUID());

  //   var file = FilesData[0];
  //   var r = new FileReader();
  //   r.readAsBinaryString(file);
  //   r.onload = async function () {
  //     setLoading(true);
  //     await axios({
  //       url: `${process.env.REACT_APP_API_URL}/user/upload`,
  //       method: "post",
  //       processData: false,
  //       data: formData,
  //     }).then((res) => {
  //       if (res) {
  //         setShowCompressedImage(true);
  //         setConfigSession(res.data);
  //         setConfigData(configs);
  //         setLoading(false);
  //         setTimeout(() => {
  //           setShowCompressedImage(true);
  //         }, 6000);
  //         setTimeout(() => {
  //           setShowCompressedImage(false);
  //         }, 2000);
  //         setSessionExist(true);
  //       }
  //     });
  //   };
  // };
  const handleUpload = (FilesData) => {
    setLoading(true);
    const uuid = localStorage.getItem("photoapp-uuid");
    const formData = new FormData();
    let errorStatus = false;

    if (FilesData.length > 1) {
      FilesData.forEach((file) => {
        if (
          file.type.split("/")[1] === "jpeg" ||
          file.type.split("/")[1] === "jpg" ||
          file.type.split("/")[1] === "tif" ||
          file.type.split("/")[1] === "tiff"
        ) {
          formData.append("photo", file);
        } else {
          errorStatus = true;
        }
      });
    } else {
      if (
        FilesData[0].type.split("/")[1] === "jpeg" ||
        FilesData[0].type.split("/")[1] === "jpg" ||
        FilesData[0].type.split("/")[1] === "tif" ||
        FilesData[0].type.split("/")[1] === "tiff"
      ) {
        formData.append("photo", FilesData[0]);
      } else {
        errorStatus = true;
      }
    }
    if (!errorStatus) {
      formData.append("uuid", uuid);
      var j = 0;
      const loaderArray = [];
      var sum = 0;
      FilesData.forEach((files, index) => {
        setLoading(true);
        var file = FilesData[index];
        var r = new FileReader();
        r.readAsBinaryString(file);
        r.onload = async function () {
          const size = file.size.toString();
          const fileId = file.name + "-" + file.lastModified;
          const name = file.name;
          const headers = {
            size: size,
            "x-file-id": fileId,
            name: name,
          };

          await axios
            .get(process.env.REACT_APP_API_URL + "/user/status", { headers })
            .then(async (res) => {
              if (res) {
                const headers = {
                  size: file.size.toString(),
                  "x-file-id": file.name + "-" + file.size,
                  "x-start-byte": 0,
                  name: file.name,
                  uuid: uuid,
                  fileType: file.type.toString(),
                };
                const config = {
                  onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    let percent = Math.floor((loaded * 100) / total);

                    loaderArray[index] = percent;
                    setCounter(
                      (sum =
                        loaderArray.reduce(function (a, b) {
                          return a + b;
                        }) / FilesData.length)
                    );
                  },
                  headers: headers,
                };
                await axios
                  .post(
                    process.env.REACT_APP_API_URL + "/user/uploadLargeImage",
                    file,
                    config
                  )
                  .then((res) => {
                    if (res?.data?.data?.length) {
                      j++;
                      setConfigSession(res.data);
                      setConfigData(configs);
                      setConfigSession(res.data);
                      setShowIcons(true);
                      if (FilesData.length === j) {
                        setLoading(false);
                        history.push("/makeOrder");
                      }
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err, "err");
            });

          return;
          // await axios({
          //   url: `${process.env.REACT_APP_API_URL}/user/upload`,
          //   method: "post",
          //   processData: false,
          //   data: formData,
          // }).then((res) => {
          //   if (!errorStatus) {
          //     if (res?.data?.data?.length) {
          //       // console.log(res.data);
          //       setConfigSession(res.data);
          //       setShowIcons(true);
          //       setLoading(false);
          //       history.push("/makeOrder");
          //     }
          //   }
          // });
        };
      });
    }
  };
  const deleteData = (data, uuid, filename, i) => {
    let URL = `${process.env.REACT_APP_API_URL}/user/delete`;
    axios
      .post(URL, {
        id: data,
        uuid: uuid,
        filename: filename,
      })
      .then((res) => {
        // console.log(res)
        setConfigSession(res.data);

        if (
          filename === selectedImage?.filename &&
          res?.data?.data?.length !== 0
        ) {
          setActiveIndex(0);
          setSelectedImage(res?.data?.data?.[0]?.config);
        }
        if (res?.data?.data?.length === 0) {
          sessionStorage.removeItem("photoapp-configs");
          // localStorage.removeItem("photoapp-uuid");
          // localStorage.removeItem("checkoutdata");
          // localStorage.removeItem("checkoutButton");
          // setcartQuantity(0);

          setShowIcons(false);
          setSessionExist(false);
        } else {
          setSessionExist(true);
          setShowIcons(true);
        }

        if (i == 0) {
          setActiveIndex(0);
          setSelectedImage(res?.data?.data?.[0]?.config);
        } else if (activeIndex == i) {
          setActiveIndex(i - 1);
          setSelectedImage(res?.data?.data?.[i - 1]?.config);
        } else if (res?.data?.data?.length == activeIndex) {
          setActiveIndex(activeIndex - 1);
          setSelectedImage(res?.data?.data?.[activeIndex - 1]?.config);
        } else {
          setActiveIndex(0);
          setSelectedImage(res?.data?.data?.[0]?.config);
        }
      });
    return null;
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      handleUpload(acceptedFiles);
    },
  });
  const style = useMemo(() => ({
    ...baseStyle,
  }));

  let btn_class = "2px solid red";

  useEffect(() => {
    setTimeout(() => {
      if (typeError) {
        setTypeError(false);
      }
    }, 2000);
  }, [typeError]);
  const activeBorder = (selectedFile) => {
    if (selectedImage?.filename === selectedFile) {
      setBorder(true);
    } else {
      setBorder();
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    loop: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1365,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  let updatedConfigData;
  const queryParams = new URLSearchParams(window.location.search);
  const Imgid = queryParams.get("id");
  const [check, setCheck] = useState();
  useEffect(() => {
    async function getConfigData() {
      let configData = await sessionStorage.getItem("photoapp-configs");
      configData = JSON.parse(configData);
      configData = configData.data;
      updatedConfigData = configData.filter((i) => {
        return i._id === Imgid;
      });
      if (updatedConfigData.length > 0) {
        setConfigData(updatedConfigData);
        setCheck(true);
      } else {
        setConfigData(configData);
        setCheck(false);
      }
    }
    getConfigData();
  }, []);

  const handleMultiImgClick = (i, config) => {
    setSelectedPaperType("");
    setActiveIndex(i);
    setSelectedImage(config.config);
    setImageDetails(config.config);
    setId(config._id);
    activeBorder(config.config.filename);
    setCroppedImage();
    setResetDimensions(true);
    setStatus(true);
    setMoutingType("");
    setBorders({
      Top: 0,
      Bottom: 0,
      Left: 0,
      Right: 0,
    });
    setFrameCode(undefined);
    setFrameOptions("");
    setMatting("");
    setFramesize("");
    setPly("None");
    setGlass("none");
    setRadioToggle({
      printChecked: false,
      framingChecked: false,
      mountingChecked: false,
    });
    setMattings({ Left: 0, Right: 0, Top: 0, Bottom: 0 });
    setActiveKey("");
    setChecked(false);
    setIncheschecked(false);
    SetMeasurement();
    setPrintingFramingSubtotal(0);
    setPrice(0);
    setMouldingPrice(0);
    setRadiochecked(false);
    setInchRadiochecked(false);
  };

  const data = useCallback(() => {
    return (
      <Slider {...settings}>
        {configData
          ?.slice(0)
          .reverse()
          .map((config, i) => (
            <div
              key={i}
              style={{ display: "inline-block" }}
              className="thumbnail-area"
            >
              <div
                className={
                  (activeIndex === i ? " borderThumnailActive" : " ") +
                  " thumbnail lower-thumbnail thumbnail-div " +
                  i
                }
              >
                <CloseCircleFilled
                  className="iconPositionStyle"
                  style={{ float: "right" }}
                  onClick={() =>
                    deleteData(
                      config._id,
                      config.uuid,
                      config.config.filename,
                      i
                    )
                  }
                />
                {Imgid ? (
                  <ImageLoader
                    loaderImageWidth={
                      (82 / config.config.height) * config.config.width
                    }
                    style={{
                      border: activeIndex === i ? "" : null,
                      display: "inline-block",
                      //width: (82/config.config.height)*config.config.width,
                    }}
                    onLoad={(e) => {
                      // console.log(config.config.filename)
                      if (config.config.filename.includes("thumb_")) {
                        config.config.filename = config.config.filename;
                      } else if (config.config.filename.includes("crop_")) {
                        config.config.filename = config.config.filename;
                      } else {
                        config.config.filename =
                          "crop_" + config.config.filename;
                      }

                      handleMultiImgClick(i, config);
                    }}
                    className={border ? btn_class : ""}
                    src={
                      config._id === blob?.id
                        ? blob?.blob
                        : `${process.env.REACT_APP_API_URL}/public/` +
                          config.config.filename
                    }
                    alt=""
                  />
                ) : (
                  <ImageLoader
                    loaderImageWidth={
                      (82 / config.config.height) * config.config.width
                    }
                    style={{
                      border: activeIndex === i ? "" : null,
                      display: "inline-block",
                      //width: (82/config.config.height)*config.config.width,
                    }}
                    onClick={(e) => {
                      handleMultiImgClick(i, config);
                    }}
                    className={border ? btn_class : ""}
                    src={
                      config._id === blob?.id
                        ? blob?.blob
                        : `${process.env.REACT_APP_API_URL}/public/` +
                          config.config.filename
                    }
                    alt=""
                  />
                )}
              </div>
            </div>
          ))}
      </Slider>
    );
  }, [configData, selectedImage, showCompressedImage, blob, blobs]);

  return (
    <div className="slider-">
      <div className="sliderPart">
        <div
          className="flex-initial"
          id="dropzone-external"
          {...getRootProps({ style })}
        >
          <input {...getInputProps()} />

          {!loading ? (
            <Button size="large" className="addnewfile" loading={loading}>
              <p className="add-new-file">+ ADD NEW FILE</p>
            </Button>
          ) : (
            <Button size="large" className="addnewfile">
              <p className="add-new-file">UPLOADING ...</p>
            </Button>
          )}
        </div>
        {/* <LargeUpload
          setCounter={setCounter}
          setConfigSession={setConfigSession}
          setTypeError={setTypeError}
          setShowIcons={setShowIcons}
          setLoading={setLoading}
          getUUID={getUUID()}
        /> */}
        <div className="sliderWrapper">{data()}</div>
      </div>
      {typeError && (
        <p align="center" className="file-format-waring mt-2">
          The file format is not accepted
        </p>
      )}
    </div>
  );
}
// document.querySelector('div[class="thumbnail-area"]').click();
export default MultipleImageUpload;
