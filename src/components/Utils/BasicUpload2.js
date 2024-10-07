import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { Typography, Space } from "antd";
import LargeFileUpload from "../LargeFileUpload";

const { Text } = Typography;

const baseStyle = {
  alignItems: "center",
  padding: "50px 20px",
  border: "2px dashed #bdbdbd",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  margin: "0 auto",
  textAlign: "center",
  transition: "border .24s ease-in-out",
};

const mobileSetting = {
  alignItems: "center",
  padding: "50px 20px",
  border: "2px dashed #bdbdbd",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  width: "auto",
  textAlign: "center",
  transition: "border .24s ease-in-out",
};

const BasicUpload = (props) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filess, setFiles] = useState([]);
  const [screenWidth, setScreenWidth] = useState();
  const [typeError, setTypeError] = useState(false);
  const [counter, setCounter] = useState();
  const [filesLength, setFilesLength] = useState(0);
  const { setConfigSession, getUUID, setShowIcons } = props;
  const uuid = getUUID();
  let history = useHistory();
  const [file, setFile] = useState(null);
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

  const handleError = (flag) => {
    setTypeError(flag);

    setTimeout(() => {
      setTypeError(false);
      setLoading(false);
    }, 2000);
  };
  const handleUpload = (FilesData) => {
    setLoading(true);
    setFilesLength(FilesData.length);
    setFile(FilesData);
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
          handleError(true);
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
        handleError(true);
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
  useEffect(() => {
    async function fetchdata() {}
    fetchdata();
  }, [status]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    // accept: "*",
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

  const style = useMemo(
    () => (screenWidth < 991 ? { ...mobileSetting } : { ...baseStyle }),
    [screenWidth]
  );

  return (
    <section className="container mx-auto">
      {typeError && (
        <p className="file-format-waring">The file format is not accepted</p>
      )}
      <div className="uploader-div" {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {loading ? (
          <>
            <img className="loader-gif" src="../images/loader.gif" />
            {counter < 100 ? (
              <p className="uploading-file">
                {counter.toFixed(0)}% Uploading...
              </p>
            ) : (
              <p className="uploading-file">
                Processing files please wait .....
              </p>
            )}
          </>
        ) : (
          <>
            <Space direction="vertical">
              <img className="cloud-image" src="../images/cloud.png" />
              <div>
                <Text className="drag-and-drop-to-upl">
                  Drag and drop to upload files{" "}
                </Text>
                <br />
                <Text className="drag-and-drop-to-upl">or</Text>
              </div>
              <Button size="large" type="primary" className="browse-button">
                BROWSE FILES
              </Button>
            </Space>
          </>
        )}
      </div>
      <p className="file-format-text">Accepted File Formats: TIFF, JPG</p>
    </section>
  );
};
export default BasicUpload;
