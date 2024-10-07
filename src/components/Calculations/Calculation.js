import { useImperativeHandle } from "react";

export const CalculateInch = (height, width) => {
  return {
    height: (Number(height) / 300).toFixed(1),
    width: (Number(width) / 300).toFixed(1),
  };
};

export const CalculateCm = (height, width) => {
  return {
    height: ((Number(height) / 300) * 2.54).toFixed(1),
    width: ((Number(width) / 300) * 2.54).toFixed(1),
  };
};

export const uploadedImageAreaInch = (height, width) => {
  return {
    area: (Number(height) / 180).toFixed(1) * (Number(width) / 180).toFixed(1),
  };
};

export const uploadedImageAreaCm = (height, width) => {
  return {
    area:
      ((Number(height) / 180) * 2.54).toFixed(1) *
      ((Number(width) / 180) * 2.54).toFixed(1),
  };
};

export const SquareInch = ({ height, width, measurement }) => {
  if (measurement === "cm") {
    return {
      area: (Number(height) / 2.54 + 2) * (Number(width) / 2.54 + 2),
    };
  } else {
    return {
      area: (Number(height) + 1) * (Number(width) + 1),
    };
  }
};

export const PrintOnlyPrice = (
  { height, width, measurement },
  selectedPaperType = {
    info: {
      filpaperTypePricename: 0.18,
      paperRollWidthInches: 44,
      paperRollWidthCm: 110,
      paperBasePrice: 18,
    },
  }
) => {
  if (measurement === "inch") {
    return (Number(height) + 1) *
      (Number(width) + 1) *
      selectedPaperType?.info?.filpaperTypePricename >
      selectedPaperType?.info?.paperBasePrice
      ? (Number(height) + 1) *
          (Number(width) + 1) *
          selectedPaperType?.info?.filpaperTypePricename
      : selectedPaperType?.info?.paperBasePrice;
  } else {
    return ((Number(height) + 2.54) / 2.54) *
      ((Number(width) + 2.54) / 2.54) *
      selectedPaperType?.info?.filpaperTypePricename >
      selectedPaperType?.info?.paperBasePrice
      ? ((Number(height) + 2.54) / 2.54) *
          ((Number(width) + 2.54) / 2.54) *
          selectedPaperType?.info?.filpaperTypePricename
      : selectedPaperType?.info?.paperBasePrice;
  }
};

export const FinalPrintOnlyPrice = (area, price) => {
  let FinalPrice;
  let discount = Number(price) * 0.08;
  if (area.area) {
    if (Number(area.area) < 576) {
      FinalPrice = price + 2;
      return FinalPrice;
    } else if (Number(area.area) > 576) {
      FinalPrice = price + 2 - discount;
      return FinalPrice;
    } else if (Number(area.area) > 864) {
      FinalPrice = price + 5 - discount;
      return FinalPrice;
    }
  }
};

export const TooLargePaperType = (
  { height, width, measurement },
  selectedPaperType = {
    info: {
      filpaperTypePricename: 0.18,
      paperRollWidthInches: 44,
      paperRollWidthCm: 110,
      paperBasePrice: 18,
    },
  }
) => {
  if (measurement === "inch") {
    if (
      Number(height) + 1 >
        Number(selectedPaperType?.info?.paperRollWidthInches) ||
      Number(width) + 1 > Number(selectedPaperType?.info?.paperRollWidthInches)
    ) {
      return "Too large Size for this paper type";
    }
  } else {
    if (
      Number(height + 2.54) >
        Number(selectedPaperType?.info?.paperRollWidthCm) ||
      Number(width + 2.54) > Number(selectedPaperType?.info?.paperRollWidthCm)
    ) {
      return "Too large Size for this paper type";
    }
  }
};

export const AspectRatioCalculate = (data) => {
  if (Object.keys(data).length !== 0) {
    let hcfInch;
    let inchHeight = Number(data.Inch.height) * 10;
    let inchWidth = Number(data.Inch.width) * 10;
    let cmHeight = Number(data.Cm.height) * 10;
    let cmWidth = Number(data.Cm.width) * 10;
    for (let i = 1; i <= inchHeight && i <= inchWidth; i++) {
      if (
        inchHeight !== NaN &&
        inchWidth !== NaN &&
        inchHeight % i == 0 &&
        inchWidth % i == 0
      ) {
        hcfInch = i;
      }
    }

    let AspectRatioHeightInch = inchHeight / hcfInch;
    let AspectRatioWidthInch = inchWidth / hcfInch;

    let hcfCm;
    for (let i = 1; i <= cmHeight && i <= cmWidth; i++) {
      if (cmHeight % i == 0 && cmWidth % i == 0) {
        hcfCm = i;
      }
    }
    let AspectRatioHeightCm = cmHeight / hcfCm;
    let AspectRatioWidthCm = cmWidth / hcfCm;

    return {
      Inch: { AspectRatioHeightInch, AspectRatioWidthInch },
      Cm: { AspectRatioHeightCm, AspectRatioWidthCm },
    };
  }
};

export const getKooltak = (finalDimensions, borders, selectedPaperType) => {
  if (finalDimensions?.measurement != "undefined") {
    let height = borderPrice(
      finalDimensions,
      borders,
      selectedPaperType
    )?.heightAfterBorder;

    let width = borderPrice(
      finalDimensions,
      borders,
      selectedPaperType
    )?.widthAfterBorder;

    if (finalDimensions?.measurement === "inch") {
      height = height - 1;
      width = width - 1;
    }

    return {
      heightAfterBorder: height,
      widthAfterBorder: width,
    };
  }
};

export const borderPrice = (finalDimensions, borders, selectedPaperType) => {
  if (selectedPaperType && finalDimensions?.measurement != "undefined") {
    let BorderLR = Number(borders?.Left) + Number(borders?.Right);
    let BorderTB = Number(borders?.Top) + Number(borders?.Bottom);
    let borderStatus = false;
    if (BorderLR > 0 || BorderTB > 0) {
      borderStatus = true;
    }
    let filpaperTypePricename = selectedPaperType?.info?.filpaperTypePricename;
    let paperBasePrice = selectedPaperType?.info?.paperBasePrice;

    let finalHeightWithBorder = Number(finalDimensions?.height) + BorderTB;
    let finalWidthWithBorder = Number(finalDimensions?.width) + BorderLR;

    let finalHeightWithoutBorder = 0;
    let finalWidthWithoutBorder = 0;

    let finalValue = 0;

    if (finalDimensions?.measurement === "inch") {
      finalHeightWithoutBorder = Number(finalDimensions?.height) + 1;
      finalWidthWithoutBorder = Number(finalDimensions?.width) + 1;
      // finalHeightWithBorder = finalHeightWithBorder + 1;
      // finalWidthWithBorder = finalWidthWithBorder + 1;
    } else {
      finalHeightWithoutBorder = Number(finalDimensions?.height) + 2.54;
      finalWidthWithoutBorder = Number(finalDimensions?.width) + 2.54;
      // finalHeightWithBorder = finalHeightWithBorder + 2.54;
      // finalWidthWithBorder = finalWidthWithBorder + 2.54;
    }

    let heightAfterBorder = finalHeightWithBorder;
    let widthAfterBorder = finalWidthWithBorder;

    if (finalHeightWithoutBorder > finalHeightWithBorder) {
      heightAfterBorder = finalHeightWithoutBorder;
    } else {
      heightAfterBorder = finalHeightWithBorder;
    }

    if (finalWidthWithoutBorder > finalWidthWithBorder) {
      widthAfterBorder = finalWidthWithoutBorder;
    } else {
      widthAfterBorder = finalWidthWithBorder;
    }

    // console.log(
    //   "finalHeightWithBorder",
    //   finalHeightWithBorder,
    //   "finalWidthWithBorder",
    //   finalWidthWithBorder,
    //   finalDimensions
    // );

    if (finalDimensions?.measurement === "inch") {
      finalValue = heightAfterBorder * widthAfterBorder * filpaperTypePricename;
      if (finalValue > paperBasePrice) {
        return {
          prize: finalValue,
          heightAfterBorder: heightAfterBorder,
          widthAfterBorder: widthAfterBorder,
        };
      } else {
        return {
          prize: paperBasePrice,
          heightAfterBorder: heightAfterBorder,
          widthAfterBorder: widthAfterBorder,
        };
      }
    } else {
      if (!borderStatus) {
        paperBasePrice = 15;
      }
      finalValue =
        (heightAfterBorder / 2.54) *
        (widthAfterBorder / 2.54) *
        filpaperTypePricename;
      if (finalValue > paperBasePrice) {
        return {
          prize: finalValue,
          heightAfterBorder: heightAfterBorder / 2.54,
          widthAfterBorder: widthAfterBorder / 2.54,
        };
      } else {
        return {
          prize: paperBasePrice,
          heightAfterBorder: heightAfterBorder / 2.54,
          widthAfterBorder: widthAfterBorder / 2.54,
        };
      }
    }
  }
};

export const FinalBorderPrice = (area, BorerPrice, printOnlyPrice) => {
  let finalPrice = 0;
  let discount = Number(printOnlyPrice) * 0.08;
  
  if (area.area) {
    if (Number(area.area) < 576) {
      finalPrice = Number(BorerPrice) + 2;
    } else if (Number(area.area) > 576) {
      finalPrice = Number(BorerPrice) + 2 - discount;
    } else if (Number(area.area) > 864) {
      finalPrice = Number(BorerPrice) + 5 - discount;
    }
  }
  return finalPrice;
};

export const validationForPaperError = (
  finalDimensions,
  borders,
  selectedPaperType
) => {
  if (selectedPaperType && finalDimensions?.measurement != "undefined") {
    let paperTypeError = false;

    let BorderLR = Number(borders?.Left) + Number(borders?.Right);
    let BorderTB = Number(borders?.Top) + Number(borders?.Bottom);
    let filpaperTypePricenameIn = selectedPaperType?.info?.paperRollWidthInches;
    let filpaperTypePricenameCm = selectedPaperType?.info?.paperRollWidthCm;

    let finalWidthWithoutBorder = Number(finalDimensions?.width) + BorderLR;
    let finalHeightWithoutBorder = Number(finalDimensions?.height) + BorderTB;
    let finalHighest = "";

    let finalMessage = "Image dimension must fit within max roll width: ";

    finalHighest = finalWidthWithoutBorder;

    // if (finalWidthWithoutBorder > finalHeightWithoutBorder) {
    //   finalHighest = finalWidthWithoutBorder;
    // } else {
    //   finalHighest = finalHeightWithoutBorder;
    // }

    if (finalDimensions?.measurement === "inch") {
      if (finalHighest > filpaperTypePricenameIn) {
        paperTypeError = finalMessage + filpaperTypePricenameIn;
      }
    } else {
      if (finalHighest > filpaperTypePricenameCm) {
        paperTypeError = finalMessage + filpaperTypePricenameCm;
      }
    }

    return paperTypeError;
  }
};

export const Ui = (height, width) => {
  let squareInch = Number(height) * Number(width);
  let squareFoot = squareInch / 144;
  let UI = Number(height) + Number(width);
  return UI;
};

export const matFinalUI = (mattings, frame, ply, ui) => {
  let matFinalDimensions;
  let unitedInch = Number(ui);
  let shadow;
  let matFinalUI;
  let matTop = Number(mattings?.Top);
  let matBottom = Number(mattings?.Bottom);
  let matLeft = Number(mattings?.Left);
  let matRight = Number(mattings?.Right);
  if (frame) {
    if (frame.FrameOption === "Shadow Box" && ply === "None") {
      shadow = 4;
    } else {
      shadow = 0;
    }
    if (ply === "None") {
      matFinalDimensions = 0;
    } else {
      matFinalDimensions = matTop + matBottom + matLeft + matRight + unitedInch;
    }
    // console.log('matFinalDimensions',matFinalDimensions);
    if (unitedInch > matFinalDimensions) {
      // console.log('unitedInch',unitedInch,'shadow',shadow)
      matFinalUI = unitedInch + shadow;
    } else {
      matFinalUI = matFinalDimensions;
    }
    // console.log('matFinalUI',matFinalUI)
  }
  return matFinalUI;
};

export const FrameUiRoundUp = (Ui) => {
  let ui = Number(Ui);
  if (ui <= 18) {
    return 18;
  } else if (ui <= 21) {
    return 21;
  } else if (ui <= 25) {
    return 25;
  } else if (ui <= 32) {
    return 32;
  } else if (ui <= 36) {
    return 36;
  } else if (ui <= 42) {
    return 42;
  } else if (ui <= 50) {
    return 50;
  } else if (ui <= 54) {
    return 54;
  } else if (ui <= 58) {
    return 58;
  } else if (ui <= 60) {
    return 60;
  } else if (ui <= 72) {
    return 72;
  } else if (ui <= 84) {
    return 84;
  } else if (ui <= 100) {
    return 100;
  } else if (ui > 100) {
    return 116;
  } else {
    return "You Broke It!";
  }
};

export const handmadeFrameRetail = (frameCode, matfinalUi, ply) => {
  let linearFoot = Math.ceil(Number(matfinalUi) / 12);
  let handmadeFrameCost;
  let handmadePaint;
  let handMadeJion;
  let handmadeSpacer;
  let handmadeSpacerYN;
  let HSMarkUp;
  let handmadeFrameRetail;

  if (frameCode.Code === "HS-S") {
    handmadeFrameCost = linearFoot * 3;
  } else if (frameCode.Code === "HS-M") {
    handmadeFrameCost = linearFoot * 4;
  } else if (frameCode.Code === "HS-L") {
    handmadeFrameCost = linearFoot * 5;
  } else {
    handmadeFrameCost = 0;
  }

  if (matfinalUi < 37) {
    handmadePaint = 100;
  } else if (matfinalUi <= 50) {
    handmadePaint = 150;
  } else if (matfinalUi > 50) {
    handmadePaint = 200;
  }

  if (matfinalUi <= 60) {
    handMadeJion = 50;
  } else if (matfinalUi > 60) {
    handMadeJion = 75;
  }

  if (matfinalUi <= 36) {
    handmadeSpacer = 20;
  } else if (matfinalUi <= 50) {
    handmadeSpacer = 30;
  } else if (matfinalUi > 50) {
    handmadeSpacer = 50;
  }

  if (ply === "None") {
    handmadeSpacerYN = handmadeSpacer;
  } else {
    handmadeSpacerYN = 0;
  }

  if (handmadeFrameCost <= 60) {
    HSMarkUp = 100;
  } else if (handmadeFrameCost <= 84) {
    HSMarkUp = 150;
  } else if (handmadeFrameCost > 85) {
    HSMarkUp = 200;
  } else {
    HSMarkUp = 0;
  }

  handmadeFrameRetail =
    handmadeFrameCost +
    handmadePaint +
    handMadeJion +
    handmadeSpacer +
    handmadeSpacerYN +
    HSMarkUp;

  return handmadeFrameRetail;
};

export const matFinalDimensionsCalulator = (mattings, ply, ui) => {
  let matFinalDimension;
  let matTop = Number(mattings?.Top);
  let matBottom = Number(mattings?.Bottom);
  let matLeft = Number(mattings?.Left);
  let matRight = Number(mattings?.Right);
  let unitedinch = Number(ui);
  if (ply === "None") {
    matFinalDimension = 0;
    return matFinalDimension;
  } else {
    matFinalDimension = matTop + matBottom + matLeft + matRight + unitedinch;
    return matFinalDimension;
  }
};

export const roundUpUi = (ply, Ui) => {
  //upar alay function toh augi eh
  let ui = Number(Ui);
  if (Ui !== "None") {
    // if (ply === "None") {
    //   return 0;
    // } else {
    if (ui <= 18) {
      return 18;
    } else if (ui <= 24) {
      return 24;
    } else if (ui <= 32) {
      return 32;
    } else if (ui <= 36) {
      return 36;
    } else if (ui <= 42) {
      return 42;
    } else if (ui <= 44) {
      return 44;
    } else if (ui <= 50) {
      return 50;
    } else if (ui <= 54) {
      return 54;
    } else if (ui <= 60) {
      return 60;
    } else if (ui <= 72) {
      return 72;
    } else if (ui <= 78) {
      return 78;
    } else if (ui <= 84) {
      return 84;
    } else if (ui <= 90) {
      return 90;
    } else if (ui <= 100) {
      return 100;
    } else if (ui > 100) {
      return 100;
    } else {
      return "You Broke It!";
    }
  }
};

export const GlassRoundUp = (Ui) => {
  let ui = Number(Ui);
  if (ui <= 18) {
    return 18;
  } else if (ui <= 21) {
    return 21;
  } else if (ui <= 25) {
    return 25;
  } else if (ui <= 28) {
    return 28;
  } else if (ui <= 32) {
    return 32;
  } else if (ui <= 36) {
    return 36;
  } else if (ui <= 42) {
    return 42;
  } else if (ui <= 44) {
    return 44;
  } else if (ui <= 50) {
    return 50;
  } else if (ui <= 54) {
    return 54;
  } else if (ui <= 58) {
    return 58;
  } else if (ui <= 60) {
    return 60;
  } else if (ui <= 62) {
    return 62;
  } else if (ui <= 66) {
    return 66;
  } else if (ui <= 70) {
    return 70;
  } else if (ui <= 72) {
    return 72;
  } else if (ui <= 84) {
    return 84;
  } else if (ui <= 100) {
    return 100;
  } else if (ui > 100) {
    return 116;
  } else {
    return "You Broke It!";
  }
};

export const BackingMaterialCalculator = (Ui) => {
  let ui = Number(Ui);
  if (ui) {
    if (ui <= 36) {
      return 12;
    } else if (ui <= 60) {
      return 16;
    } else if (ui > 60) {
      return 36;
    }
  }
};

export const spacerSizeFeeCalculator = (Ui) => {
  let ui = Number(Ui);
  if (ui) {
    if (ui <= 60) {
      return 0;
    } else if (ui <= 78) {
      return 20;
    } else if (ui > 78) {
      return 60;
    } else {
      return 0;
    }
  }
};

export const MouldingTypePrice = (height, width, moulding) => {
  if (moulding) {
    var height = Number(height);
    var width = Number(width);
    let squarefoot = Math.ceil((height * width) / 144);
    let laminate50 = squarefoot * 5.8 * 1.05;
    let laminate70 = squarefoot * 7.353 * 1.05;
    let either =
      height > 50 || width > 50
        ? Number(laminate70.toFixed(2))
        : Number(laminate50.toFixed(2));
    let dibond = squarefoot * 15.5 * 1.05;
    let rails =
      Math.ceil(((height - 6) * 2 + (width - 6) * 2) / 12) * 9.25 * 1.05;
    let zbar = Math.ceil((width - 9) / 12) * 3.5 * 1.05;
    let railsZbar = rails + zbar;
    let printCost = height * width * 0.13;
    let processingFee = 10.5;
    let price;
    let total = 0;

    if (moulding === "1/2 Ultra Mount") {
      price = squarefoot * 13.9 + 10;
      return { price: price, total: total };
    } else if (moulding === "3/16 Ultra Mount") {
      price = squarefoot * 10.45 + 10;
      return { price: price, total: total };
    } else if (moulding === "3/16 Archival Foam Board") {
      price = height * width * 0.075 + 10;
      return { price: price, total: total };
    } else if (moulding === "Alupanel") {
      total = either + dibond + railsZbar + processingFee;
      price = total + printCost < 158 ? 158 : total + printCost;
      return { price: price, total: total };
    } else {
      return { price: price, total: total };
    }
  }
};

export const numberToPixels = ({ height, width, measurement }) => {
  if (measurement === "inch") {
    return {
      height: (Number(height) * 300).toFixed(1),
      width: (Number(width) * 300).toFixed(1),
    };
  } else {
    return {
      height: ((Number(height) * 300) / 2.54).toFixed(1),
      width: ((Number(width) * 300) / 2.54).toFixed(1),
    };
  }
};

// for final prices
let finalPrintOnlyPrice = 0;
let finalPrintOnlyPriceWithBoarder = 0;
let finalMountingPrice = 0;

// print only price
export const printOnlyPrice = (measurement, selectedPaperType) => {
  let finalImageHeight = 0;
  let finalImageWidth = 0;
  let squareInch = 0;
  let price = 0;
  let discount = 0;
  let totalPrintOnlyPrice = 0;
  if (measurement.measurement == "inch") {
    //  for INCH case
    // final image height
    finalImageHeight = Number(measurement.height) + 1;
    // final image width
    finalImageWidth = Number(measurement.width) + 1;
    // price
    price =
      finalImageHeight * finalImageWidth * Number(selectedPaperType.price) >
      Number(selectedPaperType.paperBasePrice)
        ? finalImageHeight * finalImageWidth * Number(selectedPaperType.price)
        : selectedPaperType.paperBasePrice;
    // square inch
    squareInch =
      (Number(measurement.height) + 1) * (Number(measurement.width) + 1);
    // discount
    discount = price * 0.08;
    // total ptint only
    totalPrintOnlyPrice =
      squareInch < 576
        ? price + 2
        : squareInch >= 576
        ? price + 2 - discount
        : squareInch > 864
        ? price - discount
        : 0;
    // final print only price
    return finalPrintOnlyPrice = totalPrintOnlyPrice;
  } else {
    //  for CM case
    // final width
    finalImageHeight = measurement.height + 2.54;
    // final height
    finalImageWidth = measurement.width + 2.54;
    // price
    price =
      (finalImageHeight / 2.54) *
        (finalImageWidth / 2.54) *
        Number(selectedPaperType.price) >
      15
        ? (finalImageHeight / 2.54) *
          (finalImageWidth / 2.54) *
          Number(selectedPaperType.price)
        : 15;
    // discount
    discount = price * 0.08;
    // square cm
    squareInch =
      (measurement.width / 2.54 + 2) * (measurement.height / 2.54 + 2);
    // total print only
    totalPrintOnlyPrice =
      squareInch < 576
        ? price + 2
        : squareInch >= 576
        ? price + 2 - discount
        : squareInch > 864
        ? price - discount
        : 0;
    // finall print only price
    return finalPrintOnlyPrice = totalPrintOnlyPrice;
  }
  // console.log("////////////////////////////////////");
  // console.log("PRINT ONLY");
  // console.log(
  //   "measurement",
  //   measurement,
  //   "selectedPaperType",
  //   selectedPaperType
  // );
  // console.log(
  //   "finalImageHeight",
  //   finalImageHeight,
  //   "finalImageWidth",
  //   finalImageWidth,
  //   "squareInch",
  //   squareInch,
  //   "price",
  //   price,
  //   "discount",
  //   discount,
  //   "totalPrintOnlyPrice",
  //   totalPrintOnlyPrice,
  //   "finalPrintOnlyPrice",
  //   finalPrintOnlyPrice
  // );
  // console.log("////////////////////////////////////");
};

// print with border price
export const printWithBorderPrice = (
  measurement,
  borders,
  selectedPaperType
) => {
  let finalImageHeight = 0;
  let finalImageWidth = 0;
  let squareInch = 0;
  let priceWithoutBorder = 0;
  let priceWithBorder = 0;
  let discount = 0;
  let borderLR = 0;
  let borderTB = 0;
  let compareWithBorderWidth = 0;
  let compareWithBorderHeight = 0;
  let totalPriceWithBorder = 0;
  if (measurement.measurement === "inch") {
    //  for INCH case
    // final image height
    finalImageHeight = Number(measurement.height) + 1;
    // final image width
    finalImageWidth = Number(measurement.width) + 1;
    // border
    borderLR = borders.Left + borders.Right;
    borderTB = borders.Top + borders.Bottom;
    // compare to border H & W
    compareWithBorderHeight =
      finalImageHeight > measurement.height + borderTB
        ? finalImageHeight
        : measurement.height + borderTB;
    compareWithBorderWidth =
      finalImageWidth > measurement.width + borderLR
        ? finalImageWidth
        : measurement.width + borderLR;
    // price without border
    priceWithoutBorder =
      finalImageHeight * finalImageWidth * Number(selectedPaperType.price) >
      Number(selectedPaperType.paperBasePrice)
        ? finalImageHeight * finalImageWidth * Number(selectedPaperType.price)
        : selectedPaperType.paperBasePrice;
    // price with border
    priceWithBorder =
      compareWithBorderWidth *
        compareWithBorderHeight *
        selectedPaperType.price >
      selectedPaperType.paperBasePrice
        ? compareWithBorderWidth *
          compareWithBorderHeight *
          selectedPaperType.price
        : selectedPaperType.paperBasePrice;
    // square inch
    squareInch =
      (Number(measurement.height) + 1) * (Number(measurement.width) + 1);
    // discount
    discount = priceWithoutBorder * 0.08;
    // total price with border
    totalPriceWithBorder =
      squareInch < 576
        ? priceWithBorder + 2
        : squareInch > 576
        ? priceWithBorder + 2 - discount
        : squareInch > 864
        ? priceWithBorder + 5 - discount
        : 0;
    // finall print price with boarder
    return finalPrintOnlyPriceWithBoarder = totalPriceWithBorder;
  } else {
    //  for CM case

    // final width
    finalImageHeight = measurement.height + 2.54;
    // final height
    finalImageWidth = measurement.width + 2.54;
    // border
    borderLR = borders.Left + borders.Right;
    borderTB = borders.Top + borders.Bottom;
    // compare to border H & W
    compareWithBorderHeight =
      finalImageHeight > measurement.height + borderTB
        ? finalImageHeight
        : measurement.height + borderTB;
    compareWithBorderWidth =
      finalImageWidth > measurement.width + borderLR
        ? finalImageWidth
        : measurement.width + borderLR;
    // price wihtout border
    priceWithoutBorder =
      (finalImageHeight / 2.54) *
        (finalImageWidth / 2.54) *
        Number(selectedPaperType.price) >
      15
        ? (finalImageHeight / 2.54) *
          (finalImageWidth / 2.54) *
          Number(selectedPaperType.price)
        : 15;
    // price with border
    priceWithBorder =
      (compareWithBorderWidth / 2.54) *
        (compareWithBorderHeight / 2.54) *
        selectedPaperType.paperBasePrice >
      selectedPaperType.paperBasePrice
        ? (compareWithBorderWidth / 2.54) *
          (compareWithBorderHeight / 2.54) *
          selectedPaperType.price
        : selectedPaperType.paperBasePrice;

    // square cm
    squareInch =
      (measurement.width / 2.54 + 2) * (measurement.height / 2.54 + 2);
    // discount
    discount = priceWithoutBorder * 0.08;
    // total price with border
    totalPriceWithBorder =
      squareInch < 576
        ? priceWithBorder + 2
        : squareInch > 576
        ? priceWithBorder + 2 - discount
        : squareInch > 864
        ? priceWithBorder + 5 - discount
        : 0;
    // finall print price with boarder
    return finalPrintOnlyPriceWithBoarder = totalPriceWithBorder;
  }
  // console.log("////////////////////////////////////");
  // console.log("PRINT WITH BORDER");
  // console.log(
  //   "measurement",
  //   measurement,
  //   "selectedPaperType",
  //   selectedPaperType,
  //   "borders",
  //   borders
  // );
  // console.log(
  //   "finalImageHeight",
  //   finalImageHeight,
  //   "finalImageWidth",
  //   finalImageWidth,
  //   "borderLR",
  //   borderLR,
  //   "borderTB",
  //   borderTB,
  //   "compareWithBorderWidth",
  //   compareWithBorderWidth,
  //   "compareWithBorderHeight",
  //   compareWithBorderHeight,
  //   "squareInch",
  //   squareInch,
  //   "priceWithoutBorder",
  //   priceWithoutBorder,
  //   "priceWithBorder",
  //   priceWithBorder,
  //   "discount",
  //   discount,
  //   "totalPriceWithBorder",
  //   totalPriceWithBorder,
  //   "finalPrintOnlyPriceWithBoarder",
  //   finalPrintOnlyPriceWithBoarder
  // );
  // console.log("////////////////////////////////////");
};

// mounlding print price
export const mountingPrintPrice = (
  measurement,
  borders,
  mounting,
  selectedPaperType
) => {
  printOnlyPrice(measurement, selectedPaperType);
  printWithBorderPrice(measurement, borders, selectedPaperType);
  let finalImageHeight = 0;
  let finalImageWidth = 0;
  let finalMountingWidth = 0;
  let finalMountingHeight = 0;
  let borderLR = 0;
  let borderTB = 0;
  let compareWithBorderWidth = 0;
  let compareWithBorderHeight = 0;
  let squareInch = 0;
  let justTheMountingPrice = 0;
  let mountingPrice = 0;
  let mountingPrintPrice = 0;
  let squareFoot = 0;
  let laminate50 = 0;
  let laminate70 = 0;
  let lam = 0;
  let dibond = 0;
  let rails = 0;
  let zbars = 0;
  let railsAndBars = 0;
  let processingFee = 10.5;
  let alupanelPrintCost = 0;
  if (measurement.measurement == "inch") {
    // final image height
    finalImageHeight = Number(measurement.height) + 1;
    // final image width
    finalImageWidth = Number(measurement.width) + 1;
    // border
    borderLR = borders.Left + borders.Right;
    borderTB = borders.Top + borders.Bottom;
    // compare to border H & W
    compareWithBorderHeight =
      finalImageHeight > measurement.height + borderTB
        ? finalImageHeight
        : measurement.height + borderTB;
    compareWithBorderWidth =
      finalImageWidth > measurement.width + borderLR
        ? finalImageWidth
        : measurement.width + borderLR;
    // final mounting H & W
    finalMountingHeight = compareWithBorderHeight;
    finalMountingWidth = compareWithBorderWidth;
    // square inch
    squareInch = finalMountingWidth * finalMountingHeight;
    // check for mounting type
    // 3/16 Archival Foam Board
    if (mounting.type == "3/16 Archival Foam Board") {
      // just the mounting price
      justTheMountingPrice = squareInch * 0.075 + 10;
      // which price
      mountingPrice =
        finalPrintOnlyPrice >= finalPrintOnlyPriceWithBoarder
          ? finalPrintOnlyPrice
          : finalPrintOnlyPriceWithBoarder;
      // mounting print price
      mountingPrintPrice = justTheMountingPrice + mountingPrice;
      finalMountingPrice = mountingPrintPrice;
    }
    // 3/16" Ultra Mount
    if (mounting.type == "3/16 Ultra Mount") {
      // square foot
      squareFoot = Math.ceil(squareInch / 144, 1);
      // jut the mounting price
      justTheMountingPrice = squareFoot * 10.45 + 10;
      // which price
      mountingPrice =
        finalPrintOnlyPrice >= finalPrintOnlyPriceWithBoarder
          ? finalPrintOnlyPrice
          : finalPrintOnlyPriceWithBoarder;
      // mounting print price
      mountingPrintPrice = justTheMountingPrice + mountingPrice;
      finalMountingPrice = mountingPrintPrice;
    }
    // 1/2" Ultra Mount
    if (mounting.type == "1/2 Ultra Mount") {
      // square foot
      squareFoot = Math.ceil(squareInch / 144, 1);
      justTheMountingPrice = squareFoot * 13.9 + 10;
      // which price
      mountingPrice =
        finalPrintOnlyPrice >= finalPrintOnlyPriceWithBoarder
          ? finalPrintOnlyPrice
          : finalPrintOnlyPriceWithBoarder;
      // mounting print price
      mountingPrintPrice = justTheMountingPrice + mountingPrice;
      finalMountingPrice = mountingPrintPrice;
    }
    // Alupanel
    if (mounting.type == "Alupanel") {
      // square foot
      squareFoot = Math.ceil(squareInch / 144, 1);
      // laminate 50 & 70
      laminate50 = squareFoot * 5.8 * 1.05;
      laminate70 = squareFoot * 7.353 * 1.05;
      // lam
      if (finalMountingWidth > 50 || finalMountingHeight > 50) {
        lam = laminate70;
      } else {
        lam = laminate50;
      }
      // dibond
      dibond = squareFoot * 15.5 * 1.05;
      // rails
      rails =
        Math.ceil(
          ((finalMountingWidth - 6) * 2 + (finalMountingHeight - 6) * 2) / 12,
          1
        ) *
        9.25 *
        1.05;
      // z-bars
      zbars = Math.ceil((finalMountingWidth - 9) / 12, 1) * 3.5 * 1.05;
      //  rails and bars
      railsAndBars = rails + zbars;
      // just the mouting price
      justTheMountingPrice = lam + dibond + railsAndBars + processingFee;
      // aluphanel print cost
      alupanelPrintCost = finalMountingWidth * finalMountingHeight * 0.13;
      //  mount print only price
      mountingPrintPrice =
        justTheMountingPrice + alupanelPrintCost < 158
          ? 158
          : justTheMountingPrice + alupanelPrintCost;
      finalMountingPrice = mountingPrintPrice;
    }
  } else {
    // final width
    finalImageHeight = measurement.height + 2.54;
    // final height
    finalImageWidth = measurement.width + 2.54;
    // border
    borderLR = borders.Left + borders.Right;
    borderTB = borders.Top + borders.Bottom;
    // compare to border H & W
    compareWithBorderHeight =
      finalImageHeight > measurement.height + borderTB
        ? finalImageHeight
        : measurement.height + borderTB;
    compareWithBorderWidth =
      finalImageWidth > measurement.width + borderLR
        ? finalImageWidth
        : measurement.width + borderLR;
    // final moult H & W
    finalMountingHeight = compareWithBorderHeight / 2.54;
    finalMountingWidth = compareWithBorderWidth / 2.54;
    // square inch
    squareInch = finalMountingWidth * finalMountingHeight;
    // check for mounting type
    // 3/16 Archival Foam Board
    if (mounting.type == "3/16 Archival Foam Board") {
      // just the mounting price
      justTheMountingPrice = squareInch * 0.075 + 10;
      // which price
      mountingPrice =
        finalPrintOnlyPrice >= finalPrintOnlyPriceWithBoarder
          ? finalPrintOnlyPrice
          : finalPrintOnlyPriceWithBoarder;
      // mounting print price
      mountingPrintPrice = justTheMountingPrice + mountingPrice;
      finalMountingPrice = mountingPrintPrice;
    }
    // 3/16" Ultra Mount
    if (mounting.type == "3/16 Ultra Mount") {
      // square foot
      squareFoot = Math.ceil(squareInch / 144, 1);
      // jut the mounting price
      justTheMountingPrice = squareFoot * 10.45 + 10;
      // which price
      mountingPrice =
        finalPrintOnlyPrice >= finalPrintOnlyPriceWithBoarder
          ? finalPrintOnlyPrice
          : finalPrintOnlyPriceWithBoarder;
      // mounting print price
      mountingPrintPrice = justTheMountingPrice + mountingPrice;
      finalMountingPrice = mountingPrintPrice;
    }
    // 1/2" Ultra Mount
    if (mounting.type == "1/2 Ultra Mount") {
      // square foot
      squareFoot = Math.ceil(squareInch / 144, 1);
      justTheMountingPrice = squareFoot * 13.9 + 10;
      // which price
      mountingPrice =
        finalPrintOnlyPrice >= finalPrintOnlyPriceWithBoarder
          ? finalPrintOnlyPrice
          : finalPrintOnlyPriceWithBoarder;
      // mounting print price
      mountingPrintPrice = justTheMountingPrice + mountingPrice;
      finalMountingPrice = mountingPrintPrice;
    }
    // Alupanel
    if (mounting.type == "Alupanel") {
      // square foot
      squareFoot = Math.ceil(squareInch / 144, 1);
      // laminate 50 & 70
      laminate50 = squareFoot * 5.8 * 1.05;
      laminate70 = squareFoot * 7.353 * 1.05;
      // lam
      if (finalMountingWidth > 50 || finalMountingHeight > 50) {
        lam = laminate70;
      } else {
        lam = laminate50;
      }
      // dibond
      dibond = squareFoot * 15.5 * 1.05;
      // rails
      rails =
        Math.ceil(
          ((finalMountingWidth - 6) * 2 + (finalMountingHeight - 6) * 2) / 12,
          1
        ) *
        9.25 *
        1.05;
      // z-bars
      zbars = Math.ceil((finalMountingWidth - 9) / 12, 1) * 3.5 * 1.05;
      //  rails and bars
      railsAndBars = rails + zbars;
      // just the mouting price
      justTheMountingPrice = lam + dibond + railsAndBars + processingFee;
      // aluphanel print cost
      alupanelPrintCost = finalMountingWidth * finalMountingHeight * 0.13;
      // mounting print price

      mountingPrintPrice =
        justTheMountingPrice + alupanelPrintCost < 158
          ? 158
          : justTheMountingPrice + alupanelPrintCost;
      finalMountingPrice = mountingPrintPrice;
    }
  }
  // console.log("//////////////////////////////");
  // console.log("MOUNTING PRICE");
  // console.log(
  //   "measurement",
  //   measurement,
  //   "borders",
  //   borders,
  //   "mounting",
  //   mounting
  // );
  // console.log(
  //   "finalMountingWidth",
  //   finalMountingWidth,
  //   "finalMountingHeight",
  //   finalMountingHeight,
  //   "squareInch",
  //   squareInch,
  //   "justTheMountingPrice",
  //   justTheMountingPrice,
  //   "whichPrice",
  //   mountingPrice,
  //   "mountingPrintPrice",
  //   mountingPrintPrice,
  //   "squareFoot",
  //   squareFoot,
  //   "laminate50",
  //   laminate50,
  //   "laminate70",
  //   laminate70,
  //   "lam",
  //   lam,
  //   "dibond",
  //   dibond,
  //   "let",
  //   rails,
  //   "zbars",
  //   zbars,
  //   "railsAndBars",
  //   railsAndBars,
  //   "processingFee",
  //   processingFee,
  //   "alupanelPrintCost",
  //   alupanelPrintCost,
  //   "finalMountingPrice",
  //   finalMountingPrice
  // );
  // console.log("///////////////////////////////");
};

// framing print price

// printPrice(
//   { width: 114.3, height: 114.3, measurement: "cm" },
//   { price: 0.21, paperBasePrice: 20 }
// );
// printWithBorderPrice(
//   { width: 114.3, height: 114.3, measurement: "cm" },
//   { Left: 4, Right: 4, Top: 4, Bottom: 4 },
//   { price: 0.21, paperBasePrice: 20 }
// );
// mountingPrintPrice(
//   { width: 40, height: 50, type: "inch" },
//   { left: 0, right: 0, top: 0, bottom: 0 },
//   { type: "1/2 Ultra Mount" }
// );
