import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { Typography, Space } from "antd";

import LargeUpload from "./LargeUpload";

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

const BasicUpload2 = (props) => {
  const [loading, setLoading] = useState(false);
  const [filess, setFiles] = useState([]);
  const [screenWidth, setScreenWidth] = useState();
  const [typeError, setTypeError] = useState(false);
  const [counter, setCounter] = useState(0);
  const { setConfigSession, getUUID, setShowIcons } = props;
  let history = useHistory();
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

  // useEffect(() => {
  //   // setTimeout(() => counter < 100 , 1000);

  //  console.log(counter,'Counter');
  // }, [counter]);

  const handleError = (flag) => {
    // setTypeError(flag);

    setTimeout(() => {
      setTypeError(false);
    }, 2000);
  };
  const handleUpload = (FilesData) => {
    const formData = new FormData();
    // console.log("uploaded---", FilesData);
    let errorStatus = false;

    if (FilesData.length > 1) {
      FilesData.forEach((file) => {
        if (
          file.type.split("/")[1] === "jpeg" ||
          file.type.split("/")[1] === "jpg" ||
          file.type.split("/")[1] === "png" ||
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
        FilesData[0].type.split("/")[1] === "png" ||
        FilesData[0].type.split("/")[1] === "tiff"
      ) {
        formData.append("photo", FilesData[0]);
      } else {
        errorStatus = true;
        handleError(true);
      }
    }
    if (!errorStatus) {
      formData.append("uuid", getUUID);

      var file = FilesData[0];
      setLoading(true);
      // setCounter(0);
      var r = new FileReader();
      r.readAsBinaryString(file);
      r.onload = async function () {
        await axios({
          url: `${process.env.REACT_APP_API_URL}/user/upload`,
          method: "post",
          processData: false,
          data: formData,
        }).then((res) => {
          if (!errorStatus) {
            if (res?.data?.data?.length) {
              // console.log(res.data);
              setConfigSession(res.data);
              setShowIcons(true);
              setLoading(false);
              history.push("/makeOrder");
            }
          }
        });
      };
    }
  };

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
      <div
        id="dropzone-external"
        className="uploader-div"
        {...getRootProps({ style })}
      >
        {loading ? (
          <>
            <img
              className="loader-gif"
              alt="loader"
              src="../images/loader.gif"
            />
            {counter < 100 ? (
              <p className="uploading-file">{counter}% Uploading...</p>
            ) : (
              <p className="uploading-file">
                Processing files please wait .....
              </p>
            )}
          </>
        ) : (
          <>
            <Space direction="vertical">
              <img
                className="cloud-image"
                alt="cloud"
                src="../images/cloud.png"
              />
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
      <LargeUpload
        setCounter={setCounter}
        setConfigSession={setConfigSession}
        setTypeError={setTypeError}
        setShowIcons={setShowIcons}
        setLoading={setLoading}
        getUUID={getUUID}
      />
      <p className="file-format-text">Accepted File Formats: TIFF, JPG</p>
    </section>
  );
};
export default BasicUpload2;
