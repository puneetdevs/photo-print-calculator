import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import Papertype from "./Papertypes";
import Borders from "./Borders";
import Framingandmounting from "./Framingandmounting";
import useTricera from "../hooks/useTricera";
import Toast from "react-bootstrap/Toast";
import { get } from "lodash";
import {
  CalculateInch,
  CalculateCm,
  uploadedImageAreaInch,
  uploadedImageAreaCm,
  AspectRatioCalculate,
  TooLargePaperType,
} from "../Calculations/Calculation";

const Starthere = (props) => {
  const { configs } = useTricera();
  const {
    imageDetails,
    setImageDetails,
    customDimensions,
    setCustomDimensions,
    borders,
    setBorders,
    selectedPaperType,
    setSelectedPaperType,
    finalDimensions,
    setFinalDimension,
    selectedImage,
    radiochecked,
    setRadiochecked,
    inchradiochecked,
    setInchRadiochecked,
    setAspectRatio,
    frameOptions,
    framesize,
    matting,
    setFrameOptions,
    setFramesize,
    setMatting,
    frameCode,
    setFrameCode,
    ply,
    setPly,
    glass,
    setGlass,
    moutingType,
    setMoutingType,
    mattings,
    setMattings,
    measurement,
    SetMeasurement,
    setCrop,
    setZoom,
    status,
    setStatus,
    resetDimensions,
    setResetDimensions,
    activeKey,
    setActiveKey,
    disableButton,
    setDisableButton,
    getCropData,
    addToCart,
    checkoutUrl,
    toastermessage,
    setToastermessage,
    addingToCartToaster,
    setSaveoptions,
    saveOptions,
    id,
    activeIndex,
    incheschecked,
    setIncheschecked,
    finalConversion,
    setFinalConversion,
    checked,
    setChecked,
    yesButton,
    setYesButton,
    yesCheck,
    setYesCheck,
    borderNo,
    setBorderNo,
    radioToggle,
    setRadioToggle,
    setCroppedImage,
    acceptAction,
    setAcceptAction,
    dimensionBoxFinish,
    setDimensionBoxFinish,
    open,
    open1,
    open2,
    open3,
    setOpen,
    setOpen1,
    setOpen2,
    setOpen3,
    waitForCroppedImage,
    setWaitForCroppedImage,
    sessionExist,
    setSessionExist,
    validationForPaper,
    setValidationForPaper,
    backGroundImage,
    setBackGroundImage,
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

  let Inch = {};
  let Cm = {};
  let ratio = {};
  const [enableAccept, setEnableAccept] = useState(false);
  const [cropperInputValidH, setCropperInputValidH] = useState(false);
  const [cropperInputValidW, setCropperInputValidW] = useState(false);
  // /const [option, setOption] = useState(getLocalItem());
  const initialSrs = get(configs, "data", []);
  const imageData = get(initialSrs, "0.config", []);
  const [displayUploadedDimensions, setDisplayUploadedDimensions] = useState(
    {}
  );

  const [finalCheckouUrl, setFinalCheckoutUrl] = useState("");
  const [PreviewDimension, setPreviewDimension] = useState({});

  const [mountchecked, setMountchecked] = useState(false);
  const [active, setActive] = useState();
  const [checkedFrame, setCheckedFrame] = useState(false);
  const [printonlyCheck, setPrintonlyCheck] = useState();
  let papertypewarning;
  let resetDimensionsv = false;
  const [yesborder, setYesBorder] = useState(false);
  const [noBorder, setNoBorder] = useState(false);

  useEffect(() => {
    ratio = AspectRatioCalculate(displayUploadedDimensions);
    setAspectRatio(ratio);
  }, [displayUploadedDimensions]);

  useEffect(() => {
    setRadiochecked(false);
    setInchRadiochecked(false);
    setStatus(true);
  }, [selectedImage?.filename]);

  useEffect(() => {
    if (finalDimensions?.measurement === "inch") {
      if (PreviewDimension?.width > 75) {
        setPreviewDimension({ width: 75, height: PreviewDimension?.height });
      } else if (PreviewDimension?.height > 75) {
        setPreviewDimension({ width: PreviewDimension?.width, height: 75 });
      }
    } else {
      if (PreviewDimension?.width > 180) {
        setPreviewDimension({ width: 180, height: PreviewDimension?.height });
      } else if (PreviewDimension?.height > 180) {
        setPreviewDimension({ width: PreviewDimension?.width, height: 180 });
      }
    }
  }, [PreviewDimension]);

  useEffect(() => {
    papertypewarning = TooLargePaperType(customDimensions, selectedPaperType);
  }, [selectedImage, customDimensions, selectedPaperType]);

  useEffect(() => {
    Inch = CalculateInch(selectedImage?.height, selectedImage?.width);
    Cm = CalculateCm(selectedImage?.height, selectedImage?.width);
    setDisplayUploadedDimensions({ Inch, Cm });
    if (selectedImage?.length > 0) {
      setImageDetails(selectedImage);
    }
    if (checked) {
      setPreviewDimension(Cm);
      setCustomDimensions(Cm);
    } else {
      setPreviewDimension(Inch);
      setCustomDimensions(Inch);
    }
  }, [
    selectedImage?.filename,
    checked,
    incheschecked,
    resetDimensions,
    inchradiochecked,
    radiochecked,
  ]);

  useEffect(() => {
    Inch = CalculateInch(selectedImage?.height, selectedImage?.width);
    Cm = CalculateCm(selectedImage?.height, selectedImage?.width);
    setDisplayUploadedDimensions({ Inch, Cm });
    if (selectedImage?.length > 0) {
      setImageDetails(selectedImage);
    }
    if (checked) {
      setCustomDimensions(Cm);
    } else {
      setCustomDimensions(Inch);
    }
  }, [selectedImage?.filename, checked, incheschecked, resetDimensions]);

  useEffect(() => {
    Inch = CalculateInch(selectedImage?.height, selectedImage?.width);
    Cm = CalculateCm(selectedImage?.height, selectedImage?.width);
    if (finalConversion?.inchChecked) {
      setFinalDimension({
        height: Inch?.height,
        width: Inch?.width,
        measurement: "inch",
      });
    } else if (finalConversion?.cmChecked) {
      setFinalDimension({
        height: Cm?.height,
        width: Cm?.width,
        measurement: "cm",
      });
    } else if (finalConversion?.inchCustomChecked) {
      setFinalDimension({
        height: customDimensions?.height,
        width: customDimensions?.width,
        measurement: "inch",
      });
    } else if (finalConversion?.cmCustomChecked) {
      setFinalDimension({
        height: customDimensions?.height,
        width: customDimensions?.width,
        measurement: "cm",
      });
    }
  }, [customDimensions, radiochecked, checked]);

  useEffect(() => {
    setResetDimensions(false);
    resetDimensionsv = false;
  }, [customDimensions]);

  const dpiWarningCm =
    uploadedImageAreaCm(selectedImage?.height, selectedImage?.width).area <
    customDimensions?.width * customDimensions?.height ? (
      <div className="row">
        <div className="mt-3">
          <p className="file-error">
            * File size is too small for chosen dimensions, please enter a
            smaller size.{" "}
          </p>
        </div>
      </div>
    ) : null;

  const dpiWarningInch =
    uploadedImageAreaInch(selectedImage?.height, selectedImage?.width).area <
    customDimensions?.width * customDimensions?.height ? (
      <div className="row">
        <div className="mt-3">
          <p className="file-error">
            * File size is too small for chosen dimensions, please enter a
            smaller size.
          </p>
        </div>
      </div>
    ) : null;

  let data;

  //var ret = (measurement === "cm")?displayUploadedDimensions.Cm.width:displayUploadedDimensions.Inch.width
  var restrictVal = measurement === "cm" ? 5 : 2;
  var activePreview =
    PreviewDimension.width >= restrictVal &&
    PreviewDimension.height >= restrictVal
      ? true
      : false;
  //console.log('activePreview', activePreview)

  function CustomToggle({ _, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setActiveKey("1");
      setOpen(false);
      setOpen1(false);
      setOpen2(false);
      setOpen3(false);
      setYesButton(true);
      setInchRadiochecked(false);
      setRadiochecked(false);
      setCroppedImage(null);
      setDimensionBoxFinish(true);
    });

    return (dpiWarningInch && measurement === "inch") ||
      (dpiWarningCm && measurement === "cm") ? (
      <>
        {/* <label className="custom_radio"></label> */}
        <input type="radio" name="root" disabled={true}></input>
      </>
    ) : (
      <>
        {/* <label className="custom_radio"></label> */}
        <input
          type="radio"
          name="root"
          onChange={decoratedOnClick}
          checked={yesButton}
        ></input>
      </>
    );
  }

  function CustomToggleButton({ _, eventKey }) {
    // Start
    const validateAccept = () => {
      // if (activePreview == true) {
      //   setAcceptAction(acceptAction);
      //   getCropData()
      //   decoratedOnClick()
      //   setDimensionBoxFinish(true)
      // } else {
      //   if (acceptAction === undefined || acceptAction === "") {
      //     setAcceptAction("show")
      //     return;
      //   } else {
      //     setAcceptAction(acceptAction);
      //     getCropData()
      //     decoratedOnClick()
      //     setDimensionBoxFinish(true)
      //   }
      // }

      //setWaitForCroppedImage(true)
      setAcceptAction(acceptAction);
      getCropData();
      decoratedOnClick();
      setDimensionBoxFinish(true);
      // for disabling user to select papertype before
      const element = document.getElementsByClassName("card-header")[1];
      element.classList.remove("stopUserClicks");
    };

    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setActiveKey("1");
      setOpen(false);
      setOpen1(false);
      setOpen2(false);
      setOpen3(false);
      setCroppedImage(null);
    });

    return (dpiWarningInch && measurement === "inch") ||
      (dpiWarningCm && measurement === "cm") ||
      acceptAction ||
      cropperInputValidH ||
      cropperInputValidW ? (
      <div>
        <Button
          type="submit"
          variant="secondary"
          className="cropper-button"
          disabled={true}
        >
          ACCEPT
        </Button>
      </div>
    ) : enableAccept ? (
      <div>
        <Button type="submit" variant="secondary" className="cropper-button">
          ACCEPT ...
        </Button>
      </div>
    ) : (
      <div>
        <Button
          type="submit"
          variant="secondary"
          className="cropper-button"
          onClick={() => {
            setEnableAccept(true);
            validateAccept();
          }}
        >
          ACCEPT
        </Button>
      </div>
    );
  }

  if (incheschecked || checked) {
    data = null;
  } else {
    data = (
      <div className="test-area">
        <label className="custom-label">What do you prefer?</label>
        <div className="custom-radiobox ">
          <label className="custom_radio">
            <input
              type="radio"
              name="root"
              checked={incheschecked}
              onChange={() => {
                setIncheschecked(true);
                setImageDetails(imageData);
                setFinalConversion({
                  inchChecked: true,
                  inchCustomChecked: false,
                  cmChecked: false,
                  cmCustomChecked: false,
                });
                SetMeasurement("inch");
              }}
            />{" "}
            <span></span> Inches
          </label>
          <label className="custom_radio">
            <input
              type="radio"
              name="root"
              checked={checked}
              onChange={() => {
                setChecked(true);
                setImageDetails(imageData);
                setFinalConversion({
                  inchChecked: false,
                  inchCustomChecked: false,
                  cmChecked: true,
                  cmCustomChecked: false,
                });
                SetMeasurement("cm");
              }}
            />{" "}
            <span></span> Centimetres
          </label>
        </div>
      </div>
    );
  }

  const centimeter = checked ? (
    <div>
      <div className="custom-image-area" id="show-image">
        <div className="test-area test-custom">
          <label className="custom-label">Your file as uploaded is:</label>

          <div className="custom-width">
            {displayUploadedDimensions.Cm.width} cm X{" "}
            {displayUploadedDimensions.Cm.height} cm
          </div>
          <div className="custom-radiobox radio-inline">
            <label className="custom_radio">
              <CustomToggle />
              <span></span> Yes
            </label>
            <label className="custom_radio">
              <input
                type="radio"
                name="root"
                checked={radiochecked}
                onChange={() => {
                  setRadiochecked(true);
                  setFinalConversion({
                    inchChecked: false,
                    inchCustomChecked: false,
                    cmChecked: false,
                    cmCustomChecked: true,
                  });
                }}
                onClick={() => {
                  setStatus(false);
                  setYesButton(false);
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
              />{" "}
              <span></span> No, I want a different size
            </label>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const Inches = incheschecked ? (
    <div>
      <div className="custom-image-area" id="show-image">
        <div className="test-area test-custom">
          <label className="custom-label">Your file as uploaded is:</label>

          <div className="custom-width">
            {displayUploadedDimensions.Inch.width}" X
            {displayUploadedDimensions.Inch.height}"
          </div>

          <div className="custom-radiobox radio-inline">
            <label className="custom_radio">
              <CustomToggle /> <span></span> Yes
            </label>
            <label className="custom_radio">
              <input
                type="radio"
                name="root"
                checked={inchradiochecked}
                onChange={() => {
                  setInchRadiochecked(true);
                  setFinalConversion({
                    inchChecked: false,
                    inchCustomChecked: true,
                    cmChecked: false,
                    cmCustomChecked: false,
                  });
                }}
                onClick={() => {
                  setStatus(false);
                  setYesButton(false);
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
                  const element =
                    document.getElementsByClassName("card-header")[1];
                  element.classList.add("stopUserClicks");
                }}
              />{" "}
              <span></span> No, I want a different size
            </label>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const enterdimensions = radiochecked ? (
    <div>
      <div className="custom-dimention" id="custom-dimention">
        <div className="test-area">
          <label className="custom-label">
            Enter your desired dimensions and <br />
            then click PREVIEW
          </label>
          <div className="dimention-area">
            <div className="row">
              <div className="col-5">
                <input
                  type="number"
                  placeholder="W"
                  className="custom-no"
                  name="width"
                  value={PreviewDimension.width}
                  style={{ textAlign: "center" }}
                  onChange={(e) => {
                    setPreviewDimension({
                      width: e.target.value,
                      height: PreviewDimension.height,
                    });
                    setCropperInputValidW(false);
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidW(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    setCropperInputValidW(false);
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidW(true);
                    }
                  }}
                />
              </div>
              <div className="col-2 pl-0">
                <div className="text-center">
                  <img
                    className="arrow-image-center"
                    onClick={() => {
                      setCustomDimensions({
                        height: PreviewDimension.width,
                        width: PreviewDimension.height,
                      });
                    }}
                    src="../../../icon-arrow.png"
                  />
                </div>
              </div>
              <div className="col-5">
                <input
                  type="number"
                  placeholder="H"
                  className="custom-no"
                  name="height"
                  value={PreviewDimension.height}
                  style={{ textAlign: "center" }}
                  onChange={(e) => {
                    setPreviewDimension({
                      height: e.target.value,
                      width: PreviewDimension.width,
                    });
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidH(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidH(true);
                    }
                  }}
                />
              </div>
            </div>
            {dpiWarningCm}

            {cropperInputValidH || cropperInputValidW ? (
              <div className="row">
                <div className="mt-3">
                  <p className="file-error">This field is required.</p>
                </div>
              </div>
            ) : null}

            <div className="cropper-row">
              <Button
                type="submit"
                variant="secondary"
                className="cropper-button"
                disabled={cropperInputValidH || cropperInputValidW}
                onClick={
                  (e) =>
                    setCustomDimensions({
                      height: PreviewDimension.height,
                      width: PreviewDimension.width,
                    })
                  //(activePreview == false)?setAcceptAction("show"):setAcceptAction("")
                }
              >
                PREVIEW
              </Button>
              <Button
                type="submit"
                variant="secondary"
                className="cropper-button"
                onClick={(e) => {
                  setResetDimensions(true);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCropperInputValidW(false);
                  setCropperInputValidH(false);
                }}
              >
                RESET
              </Button>
              <CustomToggleButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const enterinchdimensions = inchradiochecked ? (
    <div>
      <div className="custom-dimention" id="custom-dimention">
        <div className="test-area">
          <label className="custom-label">
            {" "}
            Enter your desired dimensions and <br />
            then click PREVIEW
          </label>
          <div className="dimention-area">
            <div className="row">
              <div className="col-5">
                <input
                  type="number"
                  placeholder="W"
                  name="width"
                  className={dpiWarningInch ? "custom-no warning" : "custom-no"}
                  value={PreviewDimension.width}
                  style={{ textAlign: "center" }}
                  onChange={(e) => {
                    setPreviewDimension({
                      width: e.target.value,
                      height: customDimensions.height,
                    });
                    setCropperInputValidW(false);
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidW(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    setCropperInputValidW(false);
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidW(true);
                    }
                  }}
                />
              </div>
              <div className="col-2 pl-0">
                <div className="text-center">
                  <img
                    onClick={() => {
                      setPreviewDimension({
                        height: PreviewDimension.width,
                        width: PreviewDimension.height,
                      });
                    }}
                    className="arrow-image-center"
                    src="../../../icon-arrow.png"
                  />
                </div>
              </div>
              <div className="col-5">
                <input
                  type="number"
                  placeholder="H"
                  name="height"
                  className={dpiWarningInch ? "custom-no warning" : "custom-no"}
                  value={PreviewDimension.height}
                  style={{ textAlign: "center" }}
                  onChange={(e) => {
                    setPreviewDimension({
                      height: e.target.value,
                      width: PreviewDimension.width,
                    });
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidH(true);
                    }
                  }}
                  onKeyUp={(e) => {
                    setCropperInputValidH(false);
                    if (e.target.value == "" || e.target.value == 0) {
                      setCropperInputValidH(true);
                    }
                  }}
                />
              </div>
            </div>
            {dpiWarningInch}

            {cropperInputValidH || cropperInputValidW ? (
              <div className="row">
                <div className="mt-3">
                  <p className="file-error">This field is required.</p>
                </div>
              </div>
            ) : null}

            <div className="cropper-row">
              <Button
                type="submit"
                variant="secondary"
                className="cropper-button"
                disabled={cropperInputValidH || cropperInputValidW}
                onClick={(e) =>
                  setCustomDimensions({
                    height: PreviewDimension.height,
                    width: PreviewDimension.width,
                  })
                }
              >
                PREVIEW
              </Button>
              <Button
                type="submit"
                variant="secondary"
                className="cropper-button"
                onClick={(e) => {
                  setResetDimensions(true);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCropperInputValidW(false);
                  setCropperInputValidH(false);
                }}
              >
                RESET
              </Button>
              <CustomToggleButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="sidebar_tutorial">
      <div className="white-box left_white_box">
        <div className="container">
          <Accordion activeKey={activeKey}>
            <Card
              className={activeKey !== "0" ? "text-gray-400 bg-gray-400" : ""}
            >
              <Accordion.Toggle
                as={Card.Header}
                eventKey="0"
                onClick={() => (
                  activeKey === "0" ? setActiveKey("") : setActiveKey("0"),
                  setOpen1(!open1),
                  setOpen3(false),
                  setOpen2(false),
                  setOpen(false),
                  setEnableAccept(false)
                )}
              >
                {radiochecked || checked || incheschecked
                  ? "IMAGE SIZE"
                  : "START HERE"}
                <span className="text-right arrow_icons">
                  {open1 || activeKey === "0" ? (
                    <img className="arrow-image" src="../images/arrow-up.png" />
                  ) : (
                    <img
                      className="arrow-image"
                      src="../images/arrow-down.png"
                    />
                  )}
                </span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  {data}
                  {Inches}
                  {centimeter}
                  {enterdimensions}
                  {enterinchdimensions}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card
              className={activeKey !== "1" ? "text-gray-400 bg-gray-400" : ""}
            >
              {dpiWarningCm ||
              dpiWarningInch ||
              !measurement ||
              !dimensionBoxFinish ? (
                <>
                  {" "}
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    PAPER TYPE{" "}
                    <span className="text-right arrow_icons">
                      {open ? (
                        <img
                          className="arrow-image"
                          src="../images/arrow-up.png"
                        />
                      ) : (
                        <img
                          className="arrow-image"
                          src="../images/arrow-down.png"
                        />
                      )}
                    </span>
                  </Accordion.Toggle>
                </>
              ) : (
                <>
                  {" "}
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="1"
                    onClick={() => (
                      activeKey === "1" ? setActiveKey("") : setActiveKey("1"),
                      setOpen(!open),
                      setOpen1(false),
                      setOpen3(false),
                      setOpen2(false)
                    )}
                  >
                    PAPER TYPE{" "}
                    <span className="text-right arrow_icons">
                      {open ? (
                        <img
                          className="arrow-image"
                          src="../images/arrow-up.png"
                        />
                      ) : (
                        <img
                          className="arrow-image"
                          src="../images/arrow-down.png"
                        />
                      )}
                    </span>
                  </Accordion.Toggle>
                </>
              )}
              <Accordion.Collapse eventKey="1">
                <Papertype
                  selectedPaperType={selectedPaperType}
                  setSelectedPaperType={setSelectedPaperType}
                  setOpen3={setOpen3}
                  setOpen2={setOpen2}
                  setOpen1={setOpen1}
                  setOpen={setOpen}
                  setActiveKey={setActiveKey}
                  papertypewarning={papertypewarning}
                  measurement={measurement}
                  customDimensions={customDimensions}
                />
              </Accordion.Collapse>
            </Card>
            <Card
              className={activeKey !== "2" ? "text-gray-400 bg-gray-400" : ""}
            >
              {dpiWarningInch ||
              dpiWarningCm ||
              !measurement ||
              !selectedPaperType ||
              !dimensionBoxFinish ? (
                <>
                  {" "}
                  <Accordion.Toggle as={Card.Header} eventKey="2">
                    <b>BORDERS</b>
                    <span className="text-right arrow_icons">
                      {open2 ? (
                        <img
                          className="arrow-image"
                          src="../images/arrow-up.png"
                        />
                      ) : (
                        <img
                          className="arrow-image"
                          src="../images/arrow-down.png"
                        />
                      )}
                    </span>
                  </Accordion.Toggle>
                </>
              ) : (
                <>
                  {" "}
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="2"
                    onClick={() => (
                      activeKey === "2" ? setActiveKey("") : setActiveKey("2"),
                      setOpen2(!open2),
                      setOpen1(false),
                      setOpen3(false),
                      setOpen(false)
                    )}
                  >
                    <b>BORDERS</b>
                    <span className="text-right arrow_icons">
                      {open2 ? (
                        <img
                          className="arrow-image"
                          src="../images/arrow-up.png"
                        />
                      ) : (
                        <img
                          className="arrow-image"
                          src="../images/arrow-down.png"
                        />
                      )}
                    </span>
                  </Accordion.Toggle>
                </>
              )}
              <Accordion.Collapse eventKey="2">
                <Borders
                  setActiveKey={setActiveKey}
                  borders={borders}
                  setBorders={setBorders}
                  setOpen3={setOpen3}
                  setOpen2={setOpen2}
                  setOpen1={setOpen1}
                  setOpen={setOpen}
                  setSaveoptions={setSaveoptions}
                  saveOptions={saveOptions}
                  id={id}
                  yesCheck={yesCheck}
                  setYesCheck={setYesCheck}
                  borderNo={borderNo}
                  setBorderNo={setBorderNo}
                  setYesBorder={setYesBorder}
                  setNoBorder={setNoBorder}
                  validationForPaper={validationForPaper}
                  setValidationForPaper={setValidationForPaper}
                  setRadioToggle={setRadioToggle}
                  setFrameOptions={setFrameOptions}
                  setFrameCode={setFrameCode}
                />
              </Accordion.Collapse>
            </Card>
            <Card
              className={activeKey !== "3" ? "text-gray-400 bg-gray-400" : ""}
            >
              {dpiWarningCm ||
              dpiWarningInch ||
              !measurement ||
              !selectedPaperType ||
              !dimensionBoxFinish ||
              yesborder === noBorder ? (
                <>
                  {" "}
                  <Accordion.Toggle as={Card.Header} eventKey="3">
                    FRAMING/MOUNTING
                    <span className="text-right arrow_icons">
                      {open3 ? (
                        <img
                          className="arrow-image"
                          src="../images/arrow-up.png"
                        />
                      ) : (
                        <img
                          className="arrow-image"
                          src="../images/arrow-down.png"
                        />
                      )}
                    </span>
                  </Accordion.Toggle>
                </>
              ) : (
                <>
                  {" "}
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey="3"
                    onClick={() => (
                      activeKey === "3" ? setActiveKey("") : setActiveKey("3"),
                      setOpen3(!open3),
                      setOpen1(false),
                      setOpen2(false),
                      setOpen(false)
                    )}
                  >
                    FRAMING/MOUNTING
                    <span className="text-right arrow_icons">
                      {open3 ? (
                        <img
                          className="arrow-image"
                          src="../images/arrow-up.png"
                        />
                      ) : (
                        <img
                          className="arrow-image"
                          src="../images/arrow-down.png"
                        />
                      )}
                    </span>
                  </Accordion.Toggle>
                </>
              )}
              <Accordion.Collapse eventKey="3">
                <Framingandmounting
                  frameOptions={frameOptions}
                  framesize={framesize}
                  matting={matting}
                  setFrameOptions={setFrameOptions}
                  setFramesize={setFramesize}
                  setMatting={setMatting}
                  frameCode={frameCode}
                  setFrameCode={setFrameCode}
                  ply={ply}
                  setPly={setPly}
                  glass={glass}
                  setGlass={setGlass}
                  moutingType={moutingType}
                  setMoutingType={setMoutingType}
                  mattings={mattings}
                  setMattings={setMattings}
                  disableButton={disableButton}
                  setDisableButton={setDisableButton}
                  addToCart={addToCart}
                  checkoutUrl={checkoutUrl}
                  addingToCartToaster={addingToCartToaster}
                  finalCheckouUrl={finalCheckouUrl}
                  setFinalCheckoutUrl={setFinalCheckoutUrl}
                  selectedPaperType={selectedPaperType}
                  radioToggle={radioToggle}
                  setRadioToggle={setRadioToggle}
                  mountchecked={mountchecked}
                  setMountchecked={setMountchecked}
                  active={active}
                  setActive={setActive}
                  checkedFrame={checkedFrame}
                  setCheckedFrame={setCheckedFrame}
                  printonlyCheck={printonlyCheck}
                  setPrintonlyCheck={setPrintonlyCheck}
                  setSelectedPaperType={setSelectedPaperType}
                  validationForPaper={validationForPaper}
                  setValidationForPaper={setValidationForPaper}
                  borders={borders}
                  setBorders={setBorders}
                />
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
        {finalCheckouUrl === "show" ? (
          <div className="mt-3">
            <div className="mt-4 ml-2 mr-2 w-2/3 m-auto position-absolute empty-toaster">
              <Toast>
                <Toast.Body>
                  <div className="d-flex toaster-row ">
                    <div className="gif-img">
                      <img src="../images/waring.svg" />
                    </div>
                    <div className="toaster-h" style={{ paddingLeft: "16px" }}>
                      <span>Empty Cart</span>Add an item in order to checkout.
                    </div>
                    <div className="cdjcs">
                      <span onClick={() => setFinalCheckoutUrl("")}> +</span>
                    </div>
                  </div>
                </Toast.Body>
              </Toast>
            </div>
          </div>
        ) : null}
      </div>

      <div className="print-tutorial">
        <Button variant="primary" className="btn-primary-cart">
          {" "}
          <img src="../../../images/icon-print.svg" />
          <span className="print-tutorial-text">PRINT TUTORIAL</span>
        </Button>
      </div>
    </div>
  );
};

export default Starthere;
