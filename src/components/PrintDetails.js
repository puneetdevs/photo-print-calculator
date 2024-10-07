import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Col, Button } from "react-bootstrap";
import * as NumericInput from "react-numeric-input";
import {
  SquareInch,
  PrintOnlyPrice,
  FinalPrintOnlyPrice,
  TooLargePaperType,
  borderPrice,
  FinalBorderPrice,
  Ui,
  matFinalUI,
  FrameUiRoundUp,
  handmadeFrameRetail,
  matFinalDimensionsCalulator,
  roundUpUi,
  GlassRoundUp,
  BackingMaterialCalculator,
  spacerSizeFeeCalculator,
  MouldingTypePrice,
  validationForPaperError,
  getKooltak,
  mountingPrintPrice,
  printOnlyPrice,
  printWithBorderPrice,
} from "./Calculations/Calculation";
import { HorizontalArrow, VerticalArrow } from "./Icons/AppIcons";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const PrintDetails = (props) => {
  let TooLargeWarning;
  let matUi;
  let printPrice;

  const [frameCost, setFrameCost] = useState(0);
  const {
    selectedPaperType,
    customDimensions,
    finalDimensions,
    borders,
    frameCode,
    setFrameCode,
    ply,
    glass,
    moutingType,
    mattings,
    measurement,
    disableButton,
    setDisableButton,
    price,
    setPrice,
    framingPrintingSubtotal,
    setPrintingFramingSubtotal,
    MouldingPrice,
    setMouldingPrice,
    quantity,
    setQuantity,
    checkoutUrl,
    frameOptions,
    toastermessage,
    setToastermessage,
    validationForPaper,
    setValidationForPaper,
    radioToggle,
    setRadioToggle,
    setPly,
    setMatting,
    setMattings,
  } = props;
  const [finalDisplayDimensions, setFinalDisplayDimensions] =
    useState(finalDimensions);
  const [uiRoundUpVar, setUiRoundUpVar] = useState(0);
  const [frameMatrixs, setFrameMatixs] = useState();
  const [footageMatrix, setFootageMatrix] = useState();
  const [footage, setFootage] = useState();
  const [frameCostTable, setFrameCostTable] = useState();
  const [matMatrix, setMatrixMatrix] = useState();
  const [pricePerFoot, setPricePerFoot] = useState(0);
  const [markUp, setMarkUp] = useState(0);
  const [mattePrice, setMattePrice] = useState(0);
  const [glasType, setGlassType] = useState();
  const [glassPrice, setGlassPrice] = useState(0);
  const [frameRetail, setFrameRetail] = useState(0);
  const [retainerType, setReatainerType] = useState();
  const [retainerPrice, setRetainerPrice] = useState();
  const [framingSubtotal, setFramingSubtotal] = useState();
  const [handmadeFrameRetailPrice, setHandmadeFrameRetailPrice] = useState(0);
  const [ply4Kooltak, setPly4Kooltak] = useState(0);
  const [hanger, setHanger] = useState(7.75);
  const [labour, setLabour] = useState(60);
  const [backing, setBacking] = useState();
  const [SpacerSizeFee, setSpacerSizeFee] = useState();
  const [shadowBoxAdditionFee, setShadowBoxAdditionFee] = useState(0);
  const [borederlessPrice, setBorderlessPrice] = useState();
  const [borderlessPriceWithDiscount, setBorderlessPriceWithDiscount] =
    useState(0);
  const [BorderPrice, setBorderPrice] = useState();
  const [borderPriceWithDiscount, setBorderPriceWithDiscount] = useState();
  const [squareInch, setSquareInch] = useState();
  const [displayPrice, setDisplayPrice] = useState();
  const [RoundUpAfterPly, setRoundUpAfterPly] = useState();
  const [GlassRoundUpUI, setGlassRoundUpUI] = useState();
  const [alupanelPrice, setAlupanelPrice] = useState();

  useEffect(() => {
    setSquareInch(SquareInch(finalDimensions));
    setFinalDisplayDimensions({
      height: Number(finalDimensions?.height),
      width: Number(finalDimensions?.width),
      measurement: finalDimensions?.measurement,
    });
    TooLargeWarning = TooLargePaperType(
      finalDisplayDimensions,
      selectedPaperType
    );
  }, [finalDimensions, selectedPaperType]);

  useEffect(() => {
    if (selectedPaperType) {
      let height = borderPrice(
        finalDisplayDimensions,
        borders,
        selectedPaperType
      ).heightAfterBorder;

      let width = borderPrice(
        finalDisplayDimensions,
        borders,
        selectedPaperType
      ).widthAfterBorder;

      // console.log("bp", height, width);

      let price = borderPrice(
        finalDisplayDimensions,
        borders,
        selectedPaperType
      ).prize;

      printPrice = PrintOnlyPrice(finalDisplayDimensions, selectedPaperType);
      setBorderlessPriceWithDiscount(
        FinalPrintOnlyPrice(squareInch, printPrice)
      );

      setBorderlessPrice(
        PrintOnlyPrice(finalDisplayDimensions, selectedPaperType)
      );

      setBorderPrice(
        borderPrice(finalDisplayDimensions, borders, selectedPaperType).prize
      );

      let priceBW = FinalBorderPrice(squareInch, price, printPrice);

      setValidationForPaper(
        validationForPaperError(
          finalDisplayDimensions,
          borders,
          selectedPaperType
        )
      );

      setBorderPriceWithDiscount(priceBW);

      setMouldingPrice(MouldingTypePrice(height, width, moutingType));
      setAlupanelPrice(MouldingTypePrice(height, width, moutingType));

      let heightk = getKooltak(
        finalDisplayDimensions,
        borders,
        selectedPaperType
      )?.heightAfterBorder;
      let widthk = getKooltak(
        finalDisplayDimensions,
        borders,
        selectedPaperType
      )?.widthAfterBorder;

      let ui = Ui(heightk, widthk);

      let matfinalUi = matFinalUI(mattings, frameCode, ply, ui);
      setBacking(BackingMaterialCalculator(matfinalUi));
      const uiRoundValue = FrameUiRoundUp(matfinalUi);

      setUiRoundUpVar(uiRoundValue);

      const GlassRoundUpUIValue = GlassRoundUp(matfinalUi);
      setGlassRoundUpUI(GlassRoundUpUIValue);

      setSpacerSizeFee(spacerSizeFeeCalculator(matfinalUi));

      if (frameCode) {
        if (frameOptions === "Handmade/Seamless") {
          setHandmadeFrameRetailPrice(
            handmadeFrameRetail(frameCode, matfinalUi, ply)
          );
          setFrameRetail(0);
        } else {
          setHandmadeFrameRetailPrice(0);
        }
      }
      matUi = matFinalDimensionsCalulator(mattings, ply, ui);
      const RoundUpAfterPlyValue = roundUpUi(ply, matUi);
      setRoundUpAfterPly(RoundUpAfterPlyValue);

      if (frameCode) {
        if (frameOptions === "Shadow Box") {
          setMattePrice(0);
          setShadowBoxAdditionFee(60);
        } else {
          setShadowBoxAdditionFee(0);
        }
      }
    }
  }, [
    finalDisplayDimensions,
    selectedPaperType,
    squareInch,
    borders,
    mattings,
    frameCode,
    ply,
    moutingType,
  ]);

  const framematrix = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/frameUI`)
      .then((res) => {
        setFrameMatixs(res.data);
      })
      .catch((err) => {});
  };

  const footagematrixf = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/footage`)
      .then((res) => {
        setFootageMatrix(res.data);
      })
      .catch((err) => {});
  };

  const framecost = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/framecost`)
      .then((res) => {
        setFrameCostTable(res.data);
      })
      .catch((err) => {});
  };

  const matmatrix = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/mat`)
      .then((res) => {
        setMatrixMatrix(res.data);
      })
      .catch((err) => {});
  };

  const glasstypes = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/glass`)
      .then((res) => {
        setGlassType(res.data);
      })
      .catch((err) => {});
  };

  const retainers = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/retainer`)
      .then((res) => {
        setReatainerType(res.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    framematrix();
    footagematrixf();
    framecost();
    matmatrix();
    glasstypes();
    retainers();
  }, []);

  useEffect(() => {
    if (frameMatrixs && frameCode) {
      let frame = frameMatrixs.filter((data) => data.UI === uiRoundUpVar)[0];
      if (frame) {
        let Index;
        Object.keys(frame).map((val, index) => {
          if (val === frameCode.Code) {
            Index = index;
          }
        });
        let val = Object.values(frame)[Index];
        setFrameCost(val);
      } else {
        setFrameCost(0);
      }
    }
  }, [frameMatrixs, frameCode, uiRoundUpVar]);

  useEffect(() => {
    // console.log('uiRoundUpVar',uiRoundUpVar)
    if (footageMatrix && uiRoundUpVar) {
      let Footage = footageMatrix.filter((data) => data.UI === uiRoundUpVar)[0];
      if (Footage) {
        setFootage(Footage.Footage);
      } else {
        setFootage(0);
      }
    }
  }, [footageMatrix, uiRoundUpVar]);

  useEffect(() => {
    if (frameCostTable && frameCode) {
      let FrameCost = frameCostTable?.filter(
        (data) => data.Code === frameCode?.Code
      )[0];
      setPricePerFoot(FrameCost?.PricePerFoot);
      setMarkUp(FrameCost?.MarkUp);
    }
  }, [frameCode, frameCostTable]);

  useEffect(() => {
    let Mat;

    let height = getKooltak(
      finalDisplayDimensions,
      borders,
      selectedPaperType
    )?.heightAfterBorder;
    let width = getKooltak(
      finalDisplayDimensions,
      borders,
      selectedPaperType
    )?.widthAfterBorder;

    // console.log("kool", height, width);

    // let height = borderPrice(
    //   finalDisplayDimensions,
    //   borders,
    //   selectedPaperType
    // ).heightAfterBorder;

    // let width = borderPrice(
    //   finalDisplayDimensions,
    //   borders,
    //   selectedPaperType
    // ).widthAfterBorder;

    let finalKooltak =
      width +
      height +
      Number(mattings.Left) +
      Number(mattings.Right) +
      Number(mattings.Top) +
      Number(mattings.Bottom);

    if (frameCode && frameCode.FrameOption === "Shadow Box") {
      finalKooltak = width + height + 4;
    }

    let roundUpUiKooltak = roundUpUi(ply, finalKooltak);

    if (matMatrix && ply) {
      Mat = matMatrix.filter((data) => data.UI === roundUpUiKooltak)[0];
    }

    if (Mat) {
      if (ply === "4 PLY white") {
        setPly4Kooltak(Mat.Ply4);
        if (frameCode) {
          if (frameCode.FrameOption !== "Shadow Box") {
            setMattePrice(Mat.Ply4);
          }
        }
      } else if (ply === "8 PLY white") {
        setPly4Kooltak(Mat.Ply4);
        if (frameCode) {
          if (frameCode.FrameOption !== "Shadow Box") {
            setMattePrice(Mat.ply8);
          }
        }
      } else if (ply === "None") {
        setPly4Kooltak(Mat.Ply4);
        if (frameCode) {
          setMattePrice(0);
        }
      }
      if (frameCode && frameCode.FrameOption === "Shadow Box") {
        // console.log(Mat.Ply4);
        setPly4Kooltak(Mat.Ply4);
        setPly("None");
        // setMatting("");
        // setMattings({ Left: 0, Right: 0, Top: 0, Bottom: 0 });
      }
    }
  }, [ply, frameCode, mattings]);

  useEffect(() => {
    let Glass;
    if (glasType && glass && GlassRoundUpUI) {
      Glass = glasType.filter((data) => data.UI === GlassRoundUpUI)[0];
    }
    if (Glass) {
      if (glass === "Reflective") {
        setGlassPrice(Glass.Reflective);
      } else if (glass === "Non-Reflective") {
        setGlassPrice(Glass.NonReflective);
      }
    }
  }, [GlassRoundUpUI, glass]);

  useEffect(() => {
    if (footage && pricePerFoot && markUp) {
      // console.log(footage, pricePerFoot, markUp);
      setFrameRetail(
        Number(footage) * Number(pricePerFoot) * Number(markUp) + 5
      );
      setHandmadeFrameRetailPrice(0);
      if (Number(footage) * Number(pricePerFoot) * Number(markUp) == 0) {
        setFrameRetail(0);
      }
    }
  }, [footage, pricePerFoot, markUp]);

  useEffect(() => {
    let Retainer;
    if (uiRoundUpVar) {
      Retainer = retainerType?.filter((data) => data.UI === uiRoundUpVar)[0];
    }
    if (Retainer) {
      setRetainerPrice(Retainer.Retainer);
    } else {
      setRetainerPrice(0);
    }
  }, [uiRoundUpVar]);

  useEffect(() => {
    // console.log(selectedPaperType);
    // console.log(finalDimensions);
    if (
      borders?.Top === 0 &&
      borders?.Bottom === 0 &&
      borders?.Right === 0 &&
      borders?.Left === 0 &&
      MouldingPrice
    ) {
      // console.log("inside if");
      const PRINT_ONLY_PRICE = printOnlyPrice(
        {
          width: Number(finalDimensions?.width),
          height: Number(finalDimensions?.height),
          measurement: finalDimensions?.measurement,
        },
        {
          price: selectedPaperType?.info?.filpaperTypePricename,
          paperBasePrice: selectedPaperType?.info?.paperBasePrice,
        }
      );
      const PRINT_WITH_DEFAULT_BORDER = printWithBorderPrice(
        {
          width: Number(finalDimensions?.width),
          height: Number(finalDimensions?.height),
          measurement: finalDimensions?.measurement,
        },
        { Top: 0.5, Bottom: 0.5, Left: 0.5, Right: 0.5 },
        {
          price: selectedPaperType?.info?.filpaperTypePricename,
          paperBasePrice: selectedPaperType?.info?.paperBasePrice,
        }
      );
      // console.log(PRINT_ONLY_PRICE, PRINT_WITH_DEFAULT_BORDER);
      if (PRINT_ONLY_PRICE >= PRINT_WITH_DEFAULT_BORDER) {
        setPrice(PRINT_ONLY_PRICE);
      } else {
        setPrice(PRINT_WITH_DEFAULT_BORDER);
      }
    } else if (
      borders?.Top === 0 &&
      borders?.Bottom === 0 &&
      borders?.Right === 0 &&
      borders?.Left === 0 &&
      frameCode
    ) {
      // console.log("inside else if");
      const PRINT_ONLY_PRICE = printOnlyPrice(
        {
          width: Number(finalDimensions?.width),
          height: Number(finalDimensions?.height),
          measurement: finalDimensions?.measurement,
        },
        {
          price: selectedPaperType?.info?.filpaperTypePricename,
          paperBasePrice: selectedPaperType?.info?.paperBasePrice,
        }
      );
      const PRINT_WITH_DEFAULT_BORDER = printWithBorderPrice(
        {
          width: Number(finalDimensions?.width),
          height: Number(finalDimensions?.height),
          measurement: finalDimensions?.measurement,
        },
        { Top: 0.5, Bottom: 0.5, Left: 0.5, Right: 0.5 },
        {
          price: selectedPaperType?.info?.filpaperTypePricename,
          paperBasePrice: selectedPaperType?.info?.paperBasePrice,
        }
      );
      // console.log(PRINT_ONLY_PRICE, PRINT_WITH_DEFAULT_BORDER);
      if (PRINT_ONLY_PRICE >= PRINT_WITH_DEFAULT_BORDER) {
        setPrice(PRINT_ONLY_PRICE);
      } else {
        setPrice(PRINT_WITH_DEFAULT_BORDER);
      }
    } else {
      setPrice(borderPriceWithDiscount);
    }
    // if (borderPriceWithDiscount) {
    //   setPrice(borderPriceWithDiscount);
    //   // console.log("borderPriceWithDiscount");
    // } else {
    //   setPrice(borderlessPriceWithDiscount);
    //   // console.log("borderlessPriceWithDiscount");
    // }
  }, [
    borderPriceWithDiscount,
    borderlessPriceWithDiscount,
    frameCode,
    MouldingPrice,
  ]);

  useEffect(() => {
    if (
      !(
        frameRetail &&
        handmadeFrameRetailPrice &&
        mattePrice &&
        ply4Kooltak &&
        glassPrice &&
        hanger &&
        backing &&
        labour &&
        retainerPrice &&
        SpacerSizeFee &&
        shadowBoxAdditionFee
      )
    ) {
      let cost = (
        Number(frameRetail) +
        handmadeFrameRetailPrice +
        mattePrice +
        ply4Kooltak +
        glassPrice +
        hanger +
        backing +
        labour +
        retainerPrice +
        SpacerSizeFee +
        shadowBoxAdditionFee
      ).toFixed(2);

      // console.log(
      //   "frameRetail ",
      //   Number(frameRetail),
      //   ",handmadeFrameRetailPrice ",
      //   handmadeFrameRetailPrice,
      //   ",mattePrice ",
      //   mattePrice,
      //   ",ply4Kooltak ",
      //   ply4Kooltak,
      //   ",glassPrice ",
      //   glassPrice,
      //   ",hanger ",
      //   hanger,
      //   ",backing ",
      //   backing,
      //   ",labour",
      //   labour,
      //   ",retainerPrice ",
      //   retainerPrice,
      //   ",SpacerSizeFee ",
      //   SpacerSizeFee,
      //   ",shadowBoxAdditionFee ",
      //   shadowBoxAdditionFee
      // );

      // console.log("-------------");
      setFramingSubtotal(cost);
    }
    if (
      !(
        frameRetail &&
        handmadeFrameRetailPrice &&
        mattePrice &&
        ply4Kooltak &&
        glassPrice &&
        hanger &&
        backing &&
        labour &&
        retainerPrice &&
        SpacerSizeFee &&
        shadowBoxAdditionFee
      ) &&
      frameRetail != NaN
    ) {
      let cost = (
        Number(frameRetail) +
        handmadeFrameRetailPrice +
        mattePrice +
        ply4Kooltak +
        glassPrice +
        hanger +
        backing +
        labour +
        retainerPrice +
        SpacerSizeFee +
        shadowBoxAdditionFee +
        Number(price)
      ).toFixed(2);

      if (radioToggle?.framingChecked) {
        setPrintingFramingSubtotal(cost);
      } else if (radioToggle?.mountingChecked || radioToggle?.printChecked) {
        setPrintingFramingSubtotal(0);
      } else {
        setPrintingFramingSubtotal(Number(price));
      }
    }
  }, [
    frameRetail,
    handmadeFrameRetailPrice,
    mattePrice,
    ply4Kooltak,
    glassPrice,
    hanger,
    backing,
    labour,
    retainerPrice,
    SpacerSizeFee,
    price,
    mattings,
  ]);

  const [finalCheckouUrl, setFinalCheckoutUrl] = useState("");
  const checkUrl = () => {
    if (checkoutUrl === undefined || checkoutUrl === "") {
      setFinalCheckoutUrl("show");
    } else {
      setFinalCheckoutUrl(checkoutUrl);
    }
  };
  setTimeout(() => {
    setFinalCheckoutUrl("");
  }, 2000);
  // End

  var add;
  if (measurement === "cm") {
    add = 1.27;
  } else {
    add = 0.5;
  }

  // handle view cart click
  const history = useHistory();
  const handleViewCart = () => {
    history.push("/cart");
  };

  let regexPattern = /^-?[0-9]+$/;

  var graphWidth =
    Number(customDimensions?.width) +
    Number(borders?.Left) +
    Number(borders?.Right) +
    Number(mattings?.Left) +
    Number(mattings?.Right);
  var graphWidthO = regexPattern.test(graphWidth)
    ? graphWidth
    : graphWidth.toFixed(1);

  var graphHeight =
    Number(customDimensions?.height) +
    Number(borders?.Top) +
    Number(borders?.Bottom) +
    Number(mattings?.Top) +
    Number(mattings?.Bottom);
  var graphHeightO = regexPattern.test(graphHeight)
    ? graphHeight
    : graphHeight.toFixed(1);

  var graphPaperWidth =
    Number(customDimensions?.width) +
    Number(borders?.Left) +
    Number(borders?.Right);
  var graphPaperWidthO = regexPattern.test(graphPaperWidth)
    ? graphPaperWidth
    : graphPaperWidth.toFixed(1);

  var graphPaperHeight =
    Number(customDimensions?.height) +
    Number(borders?.Top) +
    Number(borders?.Bottom);
  var graphPaperHeightO = regexPattern.test(graphPaperHeight)
    ? graphPaperHeight
    : graphPaperHeight.toFixed(1);
  return (
    <div className="container cartToasterContainer">
      <Form.Row>
        <Col>
          <div className="bg-white bg-white-moblie">
            <div className="col-white-box">
              <h2>PRINT DETAILS</h2>
              <div className="frame_dimension_main">
                <div className="frame_dimension_display_box_out">
                  <div className="frame_dimension_display_box">
                    <div className="left-identity-value">
                      <p
                        className="height-outside"
                        style={{
                          left: `${measurement === "cm" ? -60 : -47}px`,
                        }}
                      >
                        {`${graphHeightO}${measurement === "cm" ? "cm" : '"'}`}
                      </p>
                    </div>
                    <div
                      className={` ${
                        frameCode ? "frame-preview-black-small" : null
                      } frame-dimension-display`}
                      style={{
                        display: "inline-block",
                        boxSizing: "borderBox",
                      }}
                    >
                      <div>
                        <HorizontalArrow
                          position="absolute"
                          left=" -18px"
                          bottom="0"
                          top="0"
                          height="100%"
                        />

                        <VerticalArrow
                          position="absolute"
                          left="0"
                          bottom="-18px"
                          right="0"
                          width="100%"
                        />
                        <p className="width-outside">{`${graphWidthO}${
                          measurement === "cm" ? "cm" : '"'
                        }`}</p>
                      </div>
                      <div>
                        <div
                          style={{
                            borderTop: `${Number(
                              mattings?.Top * 2
                            )}px solid rgb(245, 241, 229)`,
                            borderRight: `${
                              Number(mattings?.Right) * 2
                            }px solid rgb(245, 241, 229)`,
                            borderBottom: `${
                              Number(mattings?.Bottom) * 2
                            }px solid rgb(245, 241, 229)`,
                            borderLeft: `${
                              Number(mattings?.Left) * 2
                            }px solid rgb(245, 241, 229)`,
                          }}
                        >
                          <div
                            className="main-scale-area"
                            style={{
                              borderTop: `${
                                Number(borders?.Top) * 2
                              }px solid grey`,
                              borderRight: `${
                                Number(borders?.Right) * 2
                              }px solid grey`,
                              borderBottom: `${
                                Number(borders?.Bottom) * 2
                              }px solid grey`,
                              borderLeft: `${
                                Number(borders?.Left) * 2
                              }px solid grey`,
                              height: `${
                                Number(customDimensions?.height) >
                                Number(customDimensions?.width)
                                  ? 138 +
                                    Number(borders?.Top) +
                                    Number(borders?.Bottom)
                                  : 110 +
                                    Number(borders?.Left) +
                                    Number(borders?.Right)
                              }px`,
                              width: `${
                                Number(customDimensions?.height) >
                                Number(customDimensions?.width)
                                  ? 110 +
                                    Number(borders?.Top) +
                                    Number(borders?.Bottom)
                                  : 138 +
                                    Number(borders?.Top) +
                                    Number(borders?.Bottom)
                              }px`,
                              background: "#fafafa",
                              position: "relative",
                            }}
                          >
                            <div>
                              {Number(borders?.Top) !== 0 ||
                              Number(borders?.Bottom) !== 0 ? (
                                <HorizontalArrow
                                  position="absolute"
                                  left="10%"
                                  bottom="0"
                                  top="0"
                                  height="100%"
                                />
                              ) : null}
                              {Number(borders?.Top) !== 0 ||
                              Number(borders?.Bottom) !== 0 ? (
                                <p className="height-inside">{`${
                                  customDimensions?.height
                                }${measurement === "cm" ? "cm" : '"'}`}</p>
                              ) : null}
                              {Number(borders?.Left) !== 0 ||
                              Number(borders?.Right) !== 0 ? (
                                <VerticalArrow
                                  position="absolute"
                                  left="0"
                                  bottom="10%"
                                  right="0px"
                                  width="100%"
                                />
                              ) : null}
                              {Number(borders?.Left) !== 0 ||
                              Number(borders?.Right) !== 0 ? (
                                <p className="width-inside">{`${
                                  customDimensions?.width
                                }${measurement === "cm" ? "cm" : '"'}`}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="print-label-size">
                  <ul>
                    <li>
                      <label>Image size: </label>
                      {Number(customDimensions?.width)}
                      {measurement === "cm" ? "cm" : '"'}
                      <span className="sign-cross">X</span>
                      {Number(customDimensions?.height)}
                      {measurement === "cm" ? "cm" : '"'}
                    </li>
                    <li>
                      <label>Paper size: </label>
                      {graphPaperWidthO}
                      {measurement === "cm" ? "cm" : '"'}
                      <span className="sign-cross">X</span>
                      {graphPaperHeightO}
                      {measurement === "cm" ? "cm" : '"'}
                    </li>
                    {selectedPaperType ? (
                      <li>
                        <label>Paper type: </label>
                        {selectedPaperType?.Papertype}
                      </li>
                    ) : null}
                    {selectedPaperType ? (
                      <li>
                        <label>Print Price: </label>${price?.toFixed(2)}
                      </li>
                    ) : null}
                    {frameCode ? (
                      <li>
                        <label>Framing Price: </label>$
                        {framingSubtotal === "NaN" ? 0 : framingSubtotal}
                      </li>
                    ) : null}

                    {MouldingPrice?.price ? (
                      <li>
                        <label>Mount Price: </label>$
                        {alupanelPrice?.total
                          ? (alupanelPrice?.total).toFixed(2)
                          : (MouldingPrice?.price).toFixed(2)}
                      </li>
                    ) : null}

                    {frameCode ? (
                      <li>
                        <label style={{ fontSize: "12px" }}>
                          Overall size (incl. frame):{" "}
                        </label>
                        {Number(
                          Number(customDimensions?.width) +
                            Number(borders?.Left) +
                            Number(borders?.Right) +
                            Number(mattings?.Left) +
                            Number(mattings?.Right) +
                            Number(add)
                        ).toFixed(2)}
                        {measurement === "cm" ? "cm" : '"'}X
                        {Number(
                          Number(customDimensions?.height) +
                            Number(borders?.Top) +
                            Number(borders?.Bottom) +
                            Number(mattings?.Top) +
                            Number(mattings?.Bottom) +
                            Number(add)
                        ).toFixed(2)}
                        {measurement === "cm" ? "cm" : '"'}
                      </li>
                    ) : null}
                    <li>{TooLargeWarning}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="price-area">
              <h2>PRICING</h2>
              <br />
              <div className="quantity-container">
                <Form.Group>
                  <div className="pricingRow">
                    <div className="pricingText">
                      <Form.Label>Quantity: </Form.Label>
                    </div>
                    <div className="pricinginput numeric">
                      <NumericInput
                        mobile
                        className="form-control"
                        min={1}
                        value={quantity}
                        onChange={(value) => setQuantity(value)}
                      />
                    </div>
                  </div>
                </Form.Group>
              </div>

              <div className="qty-contain mt-2">
                <div className="pricingRow">
                  <div className="pricingText">
                    <Form.Label className="label-print-total">
                      {" "}
                      Total:{" "}
                    </Form.Label>
                  </div>
                  <div className="pricinginput numeric">
                    <Form.Label className="label-print-price">
                      $
                      {framingPrintingSubtotal > 0
                        ? (
                            Number(framingPrintingSubtotal) * Number(quantity)
                          ).toFixed(2)
                        : MouldingPrice?.price > 0
                        ? (moutingType === "Alupanel"
                            ? Number(MouldingPrice?.price) * Number(quantity)
                            : Number(MouldingPrice?.price) +
                              Number(price) * Number(quantity)
                          ).toFixed(2)
                        : price
                        ? (Number(price) * Number(quantity)).toFixed(2)
                        : Number(0).toFixed(2)}
                    </Form.Label>
                  </div>
                </div>
              </div>
              <div className="btn-group  btn_group">
                <Button
                  href={checkoutUrl}
                  onClick={checkUrl}
                  type="submit"
                  variant="primary"
                  className={
                    !disableButton
                      ? "btn_disabled mobile-Checkout"
                      : "checkout-btn mobile-Checkout"
                  }
                  disabled={!checkoutUrl}
                >
                  CHECKOUT
                </Button>
                <Button
                  onClick={handleViewCart}
                  className={
                    !disableButton
                      ? "btn_disabled mobile-Checkout"
                      : "checkout-btn mobile-Checkout"
                  }
                  variant="primary"
                  disabled={!checkoutUrl}
                >
                  VIEW CART
                </Button>
              </div>
              {finalCheckouUrl === "show" ? (
                <div className="mt-3">
                  <div className="mt-4 ml-2 mr-2 w-2/3 m-auto position-relative empty-toaster">
                    <Toast>
                      <Toast.Body>
                        <div className="d-flex toaster-row ">
                          <div className="gif-img">
                            <img src="../images/waring.svg" />
                          </div>
                          <div
                            className="toaster-h"
                            style={{ paddingLeft: "16px" }}
                          >
                            <span>Empty Cart</span>Add an item in order to
                            checkout.
                          </div>
                          <div className="cdjcs">
                            <span onClick={() => setFinalCheckoutUrl("")}>
                              {" "}
                              +
                            </span>
                          </div>
                        </div>
                      </Toast.Body>
                    </Toast>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Col>
      </Form.Row>
    </div>
  );
};
export default PrintDetails;
