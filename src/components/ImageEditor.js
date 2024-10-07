/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useState,
  useSearchParams,
} from "react";
import Starthere from "./Sidebar/Starthere";
import PrintDetails from "./PrintDetails";
import ShowImage from "./ShowImage";
import useTricera from "./hooks/useTricera";
import { useHistory } from "react-router-dom";
import { Row, Col } from "antd";
import { toDataURL, dataURLtoFile, dataURLtoBlob } from "./Utils/ToImage";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImageEditor = ({
  checkoutPrice,
  setCheckoutPrice,
  checkoutUrl,
  setCheckoutUrl,
  cartId,
  setCartId,
  setcartQuantity,
  cartQuantity,
  toastermessage,
  setToastermessage,
  setShowIcons,
  sessionExist,
  setSessionExist,
}) => {
  const { configs, setConfigSession, getUUID } = useTricera();
  const [imageDetails, setImageDetails] = useState();
  const [customDimensions, setCustomDimensions] = useState({});
  const [finalDimensions, setFinalDimension] = useState({});
  const [radiochecked, setRadiochecked] = useState(false);
  const [inchradiochecked, setInchRadiochecked] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState();
  const [borders, setBorders] = useState({
    Top: 0,
    Bottom: 0,
    Left: 0,
    Right: 0,
  });
  const [mattings, setMattings] = useState({
    Top: 0,
    Bottom: 0,
    Left: 0,
    Right: 0,
  });
  const [moutingType, setMoutingType] = useState("");
  const [selectedPaperType, setSelectedPaperType] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [frameOptions, setFrameOptions] = useState("");
  const [framesize, setFramesize] = useState("");
  const [matting, setMatting] = useState("");
  const [frameCode, setFrameCode] = useState();
  const [ply, setPly] = useState("None");
  const [glass, setGlass] = useState("none");
  const [measurement, SetMeasurement] = useState();
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [id, setID] = useState();
  const [configData, setConfigData] = useState();
  const [mydata, setMydata] = useState();
  const [status, setStatus] = useState(true);
  const [resetDimensions, setResetDimensions] = useState(false);
  const [activeKey, setActiveKey] = useState("0");
  const [disableButton, setDisableButton] = useState(false);
  const [price, setPrice] = useState(0);
  const [cropper, setCropper] = useState();
  const [framingPrintingSubtotal, setPrintingFramingSubtotal] = useState(0);
  const [MouldingPrice, setMouldingPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [framingSubtotal, setFramingSubtotal] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  const [validationForPaper, setValidationForPaper] = useState("");

  const [addingToCartToaster, setAddingToCartToaster] = useState();
  const [waitForCroppedImage, setWaitForCroppedImage] = useState();
  const [saveOptions, setSaveoptions] = useState();
  const [incheschecked, setIncheschecked] = useState(false);
  const [finalConversion, setFinalConversion] = useState({
    inchChecked: false,
    inchCustomChecked: false,
    cmChecked: false,
    cmCustomChecked: false,
  });
  const [checked, setChecked] = useState(false);
  const [yesButton, setYesButton] = useState(false);
  const [yesCheck, setYesCheck] = useState(false);
  const [borderNo, setBorderNo] = useState(false);
  const [radioToggle, setRadioToggle] = useState({
    printChecked: false,
    framingChecked: false,
    mountingChecked: false,
  });
  const [blobs, setBlobs] = useState([]);
  const [blob, setBlob] = useState();
  let blobURL;
  const image =
    `${process.env.REACT_APP_API_URL}/public//` + selectedImage?.filename;
  let history = useHistory();

  // when user reorder the old uploaded image
  const queryParams = new URLSearchParams(window.location.search);
  const reorderid = queryParams.get("reorderid");
  useEffect(() => {
    setShowIcons(true);
    if (reorderid) {
      const url = `${process.env.REACT_APP_API_URL}/user/reOrder`;
      const data = { _id: reorderid };
      async function reOrder() {
        await axios.post(url, data).then((response) => {
          setConfigSession(response.data);
          setShowIcons(true);
          history.push("/makeOrder");
        });
      }
      reOrder();
    }
    if (sessionStorage.getItem("photoapp-configs") === null) {
      history.push("/");
    }
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  const [backGroundImage, setBackGroundImage] = useState({});
  const [showFrameImage, setShowFrameImage] = useState(false);

  const [border, setBorder] = useState({ border: true });
  const [border1, setBorder1] = useState({ border1: false });
  const [border2, setBorder2] = useState({ border2: false });
  const [border3, setBorder3] = useState({ border3: false });

  const [acceptAction, setAcceptAction] = useState("");
  const [dimensionBoxFinish, setDimensionBoxFinish] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [coordinates, setCoordinates] = useState({
    cLeft: false,
    cTop: false,
    cBoxWidth: false,
    cBoxHeight: false,
    cWidth: false,
    cHeight: false,
    nWidth: false,
    nHeight: false,
    fLeft: false,
    fTop: false,
    fWidth: false,
    fHeight: false,
  });

  const updateApi = async (fileData, coords) => {
    if (!status) {
      setWaitForCroppedImage(true);

      setBlobs([...blobs, { id: id, blob: blobURL }]);
      const formData = new FormData();
      formData.append("photo", fileData);
      formData.append("uuid", getUUID());
      formData.append("id", id);
      // formData.append("blob", blobURL);
      formData.append("height", finalDimensions?.height);
      formData.append("width", finalDimensions?.width);
      formData.append("measurement", finalDimensions?.measurement);
      formData.append("fHeight", coords?.fHeight);
      formData.append("fWidth", coords?.fWidth);
      formData.append("fLeft", coords?.fLeft);
      formData.append("fTop", coords?.fTop);

      var file = fileData;
      var r = new FileReader();
      r.readAsBinaryString(file);
      r.onload = async function () {
        await axios({
          method: "post",
          url: `${process.env.REACT_APP_API_URL}/user/update`,
          enctype: "multipart/form-data",
          processData: false,
          data: formData,
        }).then(async (res) => {
          if (res) {
            if (res?.data?.data?.length > 0) {
              const sessionData = await res.data;
              setConfigSession(sessionData);
              setMydata(sessionData.data);
              setStatus(true);
              setRadiochecked(false);
              setInchRadiochecked(false);
              setCroppedImage(null);
              setWaitForCroppedImage();
            }
          }
        });
      };
    }
  };

  const getCropData = useCallback(async () => {
    let data;
    if (cropper && !status) {
      data = await cropper?.getCroppedCanvas()?.toDataURL();
      if (!cropper?.cropBoxData?.left) {
      } else {
        setCoordinates({
          cLeft: cropper?.cropBoxData?.left,
          cTop: cropper?.cropBoxData?.top,

          cBoxWidth: cropper?.cropBoxData?.width,
          cBoxHeight: cropper?.cropBoxData?.height,

          cWidth: cropper?.canvasData?.width,
          cHeight: cropper?.canvasData?.height,

          nWidth: cropper?.imageData?.naturalWidth,
          nHeight: cropper?.imageData?.naturalHeight,

          fLeft:
            (cropper?.imageData?.naturalWidth / cropper?.canvasData?.width) *
            cropper?.cropBoxData?.left,
          fTop:
            (cropper?.imageData?.naturalHeight / cropper?.canvasData?.height) *
            cropper?.cropBoxData?.top,

          fWidth:
            (cropper?.imageData?.naturalWidth / cropper?.canvasData?.width) *
            cropper?.cropBoxData?.width,
          fHeight:
            (cropper?.imageData?.naturalHeight / cropper?.canvasData?.height) *
            cropper?.cropBoxData?.height,
        });
      }
    }
    if (data && !status) {
      const blob = dataURLtoBlob(data);

      blobURL = await URL.createObjectURL(blob);

      setCroppedImage(blobURL);
      const fileData = await dataURLtoFile(data, `${selectedImage?.filename}`);

      var cord = {
        fLeft:
          (cropper?.imageData?.naturalWidth / cropper?.canvasData?.width) *
          cropper?.cropBoxData?.left,
        fTop:
          (cropper?.imageData?.naturalHeight / cropper?.canvasData?.height) *
          cropper?.cropBoxData?.top,

        fWidth:
          (cropper?.imageData?.naturalWidth / cropper?.canvasData?.width) *
          cropper?.cropBoxData?.width,
        fHeight:
          (cropper?.imageData?.naturalHeight / cropper?.canvasData?.height) *
          cropper?.cropBoxData?.height,
      };
      updateApi(fileData, cord);
    }
  }, [cropper, finalDimensions]);

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

  useEffect(() => {
    checkoutlocalStorage();
  }, []);

  // if user select a product from viewcart
  let cartdata;
  let products;
  const [product, setProduct] = useState();
  useEffect(() => {
    // to get id from queryparameter
    const cart = localStorage.getItem("checkoutdata");
    if (cart) {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get("id");
      async function fetchData() {
        // get cart url data from local storage
        const checkoutdata = await localStorage.getItem("checkoutdata");
        // parse the data so we can extract cart id
        const cartId = JSON.parse(checkoutdata);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: cartId.cart_id }),
        };
        // for managing cart quantity in header
        // fetching cart data

        await fetch(`${baseUrl}/user/cartValid`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.data.cart != null) {
              cartdata = data;
              products = cartdata.data.cart.lines.edges;
            }
          });
        if (products != null) {
          let selectedProduct = products.filter((i) => {
            return i.node.id == id;
          });
        }
      }

      fetchData();
    }
  }, []);

  useEffect(() => {
    if (mydata && !status) {
      setConfigData(mydata);
      mydata.map((value) => {
        if (value?._id === id) {
          setSelectedImage(value.config);
          setWaitForCroppedImage(false);
        }
      });
    }
  }, [mydata]);

  {
    let finalPrice =
    framingPrintingSubtotal > 0
      ? (Number(framingPrintingSubtotal) * Number(quantity)).toFixed(2)
      : MouldingPrice?.price > 0
      ? (moutingType === "Alupanel"
          ? Number(MouldingPrice?.price) * Number(quantity)
          : Number(MouldingPrice?.price) + Number(price) * Number(quantity)
        ).toFixed(2)
      : price
      ? (Number(price) * Number(quantity)).toFixed(2)
      : Number(0).toFixed(2);
  }

  useEffect(() => {
    // framingPrintingSubtotal > 0
    //   ? setCheckoutPrice(
    //       (Number(framingPrintingSubtotal) * Number(quantity)).toFixed(2)
    //     )
    //   : MouldingPrice > 0
    //   ? moutingType === "Alupanel"
    //     ? setCheckoutPrice(
    //         (Number(MouldingPrice) * Number(quantity)).toFixed(2)
    //       )
    //     : setCheckoutPrice(
    //         (Number(MouldingPrice) + Number(price) * Number(quantity)).toFixed(
    //           2
    //         )
    //       )
    //   : setCheckoutPrice((Number(price) * Number(quantity)).toFixed(2));
    let finalPrice =
      framingPrintingSubtotal > 0
        ? (Number(framingPrintingSubtotal) * Number(quantity)).toFixed(2)
        : MouldingPrice?.price > 0
        ? (moutingType === "Alupanel"
            ? Number(MouldingPrice?.price) * Number(quantity)
            : Number(MouldingPrice?.price) + Number(price) * Number(quantity)
          ).toFixed(2)
        : price
        ? (Number(price) * Number(quantity)).toFixed(2)
        : Number(0).toFixed(2);
    setCheckoutPrice(finalPrice);
  }, [framingPrintingSubtotal, MouldingPrice, price]);

  const Msg = () => (
    <div className="d-flex toaster-row ">
      <div className="gif-img">
        <img src="../images/tick.svg" />
      </div>
      <div className="toaster-h">
        <span>Added!</span> Image is successfully added to the cart!
      </div>
    </div>
  );

  // get ID product ID from URL for update operation
  // get productid from url
  var product_id = "";
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    product_id = queryParams.get("productId");
  });
  const addToCart = async () => {
    setAddingToCartToaster(true);
    var sku = "t_00" + Math.floor(1000 + Math.random() * 9000);

    var measurementType = measurement === "cm" ? "cm" : '"';
    var imgOriginal =
      `${process.env.REACT_APP_API_URL}/original/` + selectedImage?.filename;
    var imgPublic =
      `${process.env.REACT_APP_API_URL}/public/` + selectedImage?.filename;
    var imgSrcOriginal =
      `${process.env.REACT_APP_API_URL}/` + selectedImage?.src_path;

    let regexPattern = /^-?[0-9]+$/;

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

    var body_html =
      "<div className='print-label-size'><ul>" +
      "<li><label>Image size: </label>" +
      Number(customDimensions?.width) +
      measurementType +
      " X " +
      Number(customDimensions?.height) +
      measurementType +
      "</li>" +
      "<li><label>Paper size: </label>" +
      graphPaperWidthO +
      measurementType +
      " X " +
      graphPaperHeightO +
      measurementType +
      "</li>" +
      (selectedPaperType
        ? "<li><label>Paper type: </label>" +
          selectedPaperType?.Papertype +
          "</li>"
        : "") +
      (frameCode
        ? "<li><label>Overall size (incl. frame): </label>" +
          Number(
            Number(customDimensions?.width) +
              Number(borders?.Left) +
              Number(borders?.Right) +
              Number(mattings?.Left) +
              Number(mattings?.Right)
          ) +
          measurementType +
          " X " +
          Number(
            Number(customDimensions?.height) +
              Number(borders?.Top) +
              Number(borders?.Bottom) +
              Number(mattings?.Top) +
              Number(mattings?.Bottom)
          ) +
          measurementType +
          "</li>"
        : "") +
      (borders
        ? "<li><label>Border Top: </label>" +
          borders?.Top +
          measurementType +
          "</li><li><label>Border Right: </label>" +
          borders?.Right +
          measurementType +
          "</li><li><label>Border Bottom: </label>" +
          borders?.Bottom +
          measurementType +
          "</li><li><label>Border Left: </label>" +
          borders?.Left +
          measurementType +
          "</li>"
        : "") +
      (frameOptions
        ? "<li><label>Frame Option: </label>" +
          frameOptions +
          "</li><li><label>Frame Colour: </label>" +
          matting +
          "</li><li><label>Frame Size: </label>" +
          framesize +
          "</li><li><label>Matting: </label>" +
          ply +
          "</li>" +
          (ply != "None"
            ? mattings
              ? "<li><label>Matting Top: </label>" +
                mattings?.Top +
                measurementType +
                "</li><li><label>Matting Right: </label>" +
                mattings?.Right +
                measurementType +
                "</li><li><label>Matting Bottom: </label>" +
                mattings?.Bottom +
                measurementType +
                "</li><li><label>Matting Left: </label>" +
                mattings?.Left +
                measurementType +
                "</li>"
              : ""
            : "") +
          "<li><label>Glass: </label>" +
          glass +
          "</li>"
        : "") +
        // (framingPrintingSubtotal 
        //   ? "<li><label>Framing Price: $</label>" +
        //     Number(framingPrintingSubtotal).toFixed(2) +
        //     "</li>"
        //   : "") +
      (moutingType
        ? "<li><label>Mounting: </label>" + moutingType + "</li>"
        : "") +
      (MouldingPrice
        ? "<li><label>Mount Price: $</label>" +
          Number(MouldingPrice?.price).toFixed(2) +
          "</li>"
        : "") +
      '<li class="imgsrc"><label>Image: </label><a target="_blank" href="' +
      imgPublic +
      '">' +
      imgPublic +
      '</a></li><li class="imgsrc imgsrcorig"><label>Original Image: </label><a target="_blank" href="' +
      imgOriginal +
      '">' +
      imgOriginal +
      '</a></li><li class="imgsrc"><label>Source Image: </label><a target="_blank" href="' +
      imgSrcOriginal +
      '">' +
      imgSrcOriginal +
      '</a></li><li class="_id" style="display:none;">' +
      id +
      "</li></ul></div>";

    var MainProduct = {
      title:
        "P_00" +
        Math.floor(1000 + Math.random() * 9000) +
        selectedImage?.filename,
      images: [
        {
          src:
            `${process.env.REACT_APP_API_URL}/public/thumb_` +
            selectedImage?.filename,
        },
      ],
      body_html: body_html,
      vendor: "Photoapp",
      display_scope: "all",
      status: "active",
      scope: "read_files,write_files",
      template_suffix: "special",
      publicationId: cartId,
      published: true,
      published_scope: "global",
      isEmbeddedApp: true,
    };
    if (product_id) {
    }
    var MainVariant = {
      sku: sku,
      price: checkoutPrice,
      border: borders?.Left + "px Solid black",
      "paper type": selectedPaperType?.Papertype,
      inventory_quantity: quantity,
      item_quantity: 20,
      fulfillment_service: "manual",
      inventory_management: "shopify",
    };
    var Option1 = {
      name: "Dimensions",
      values: [
        finalDimensions?.height +
          " " +
          finalDimensions?.width +
          " " +
          finalDimensions?.measurement,
        finalDimensions?.height,
        finalDimensions?.width,
        finalDimensions?.measurement,
      ],
    };

    var Option3 = {
      name: "Paper Type",
      value: selectedPaperType?.Papertype,
    };

    var Option2 = [
      frameOptions,
      matting,
      framesize,
      ply,
      mattings?.Left,
      glass,
    ];
    var uniqueOptions = Array.from(new Set(Option2));

    var printOnlyObject = {
      ...MainProduct,
      product_type: "Print Only",
      variants: [
        {
          ...MainVariant,
          option1:
            finalDimensions?.height +
            " " +
            finalDimensions?.width +
            " " +
            finalDimensions?.measurement,
          option2: selectedPaperType?.Papertype,
          option3: "",
        },
      ],
      options: [
        {
          ...Option1,
        },
        {
          ...Option3,
        },
      ],
    };

    var framingObject = {
      ...MainProduct,
      product_type: "Framing",
      variants: [
        {
          ...MainVariant,
          option1:
            finalDimensions?.height +
            " " +
            finalDimensions?.width +
            " " +
            finalDimensions?.measurement,
          option2: frameOptions,
          option3: "",
        },
        // {
        //   ...MainVariant,
        //   option1: "",
        //   option2: matting,
        //   option3: "",
        // },
        // {
        //   ...MainVariant,
        //   option1: "",
        //   option2: framesize,
        //   option3: "",
        // },
        {
          ...MainVariant,
          option1: "",
          option2: ply,
          option3: "",
        },
        {
          ...MainVariant,
          option1: "",
          option2: mattings?.Left,
          option3: "",
        },
        {
          ...MainVariant,
          option1: "",
          option2: glass,
          option3: selectedPaperType?.Papertype,
        },
      ],
      options: [
        {
          ...Option1,
        },
        {
          name: "Frame",
          values: uniqueOptions,
        },
        {
          ...Option3,
        },
      ],
    };

    if (matting != "") {
      framingObject.variants[4] = {
        ...MainVariant,
        option1: "",
        option2: matting,
        option3: "",
      };
    }

    if (framesize != "") {
      framingObject.variants[5] = {
        ...MainVariant,
        option1: "",
        option2: framesize,
        option3: "",
      };
    }

    var mouldingObject = {
      ...MainProduct,
      product_type: "Mounting",
      variants: [
        {
          ...MainVariant,
          option1:
            finalDimensions?.height +
            " " +
            finalDimensions?.width +
            " " +
            finalDimensions?.measurement,
          option2: moutingType,
          option3: selectedPaperType?.Papertype,
        },
      ],
      options: [
        {
          ...Option1,
        },
        {
          name: "Moulding",
          value: moutingType,
        },
        {
          ...Option3,
        },
      ],
    };

    var object;
    if (frameOptions !== "") {
      object = framingObject;
    } else if (moutingType !== "") {
      object = mouldingObject;
    } else {
      object = printOnlyObject;
    }

    if (product_id) {
      let buff = new Buffer(product_id, "base64");
      let base64ToStringNew = buff.toString("ascii");
      let spltId = base64ToStringNew.split("/");
      let id = spltId.pop();
      object.id = id;
    }

    await axios({
      method: "post",
      url: ` ${process.env.REACT_APP_API_URL}/user/cart`,
      headers: {
        "Content-Type": "application/json",
      },
      processData: false,
      data: JSON.stringify(object),
    }).then((res) => {
      if (res) {
        setCheckoutUrl(res?.data?.checkoutUrl);
        setCartId(res?.data?.cart_id);
        setcartQuantity(res?.data?.cartQuantity);
        setShowIcons(true);
        localStorage.setItem("checkoutdata", JSON.stringify(res?.data));
        localStorage.setItem("checkoutButton", JSON.stringify(disableButton));
        setAddingToCartToaster(false);
        setToastermessage(true);
        toast(
          <div className="custom_toaster">
            <img className="gif-img" src="../images/tick.svg" />

            <h6>Added!</h6>
            <span>Image is successfully added to the cart!</span>
          </div>,
          {
            toastId: "success1",
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        if (product_id) {
          setTimeout(() => {
            history.push("/cart");
          }, 1000);
        }
      }
    });
  };
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutdata"));
    if (data) {
      setCheckoutUrl(data?.checkoutUrl);
      setCartId(data?.cart_id);
    }
    if (window.location.href === `${process.env.REACT_APP_FRONTEND}`) {
      // localStorage.removeItem("checkoutdata");
      // localStorage.removeItem("checkoutButton");
    }
  }, []);

  useEffect(() => {
    if (toastermessage) {
      setTimeout(() => {
        setToastermessage(false);
      }, 4000);
    }
  }, [toastermessage]);

  // to manage cart quantity in header
  const baseUrl = process.env.REACT_APP_API_URL;
  const cartinfo = localStorage.getItem("checkoutdata");
  useEffect(() => {
    let cartproducts;
    let cartProductsQuantity;
    let sum = 0;
    if (cartinfo) {
      async function fetchdata() {
        const cartId = JSON.parse(cartinfo);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: cartId.cart_id }),
        };
        await fetch(`${baseUrl}/user/cartValid`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.data.cart != null) {
              cartproducts = data;
              cartproducts = cartproducts.data.cart.lines.edges;
              cartProductsQuantity = cartproducts.map((i) => {
                return i.node.quantity;
              });
              sum = cartProductsQuantity.reduce((pv, cv) => pv + cv, 0);
              setcartQuantity(sum);
            }
          });
      }
      fetchdata();
    }
  }, []);
  return (
    <>
      <div className="bg-color">
        <ToastContainer />

        <br />
        <div className="container container-center">
          <Row gutter={12} style={{ width: "100%" }}>
            <Col lg={6} style={{ width: "100%" }}>
              <Starthere
                imageDetails={imageDetails}
                setImageDetails={setImageDetails}
                customDimensions={customDimensions}
                setCustomDimensions={setCustomDimensions}
                borders={borders}
                setBorders={setBorders}
                selectedPaperType={selectedPaperType}
                setSelectedPaperType={setSelectedPaperType}
                finalDimensions={finalDimensions}
                setFinalDimension={setFinalDimension}
                selectedImage={selectedImage}
                radiochecked={radiochecked}
                setRadiochecked={setRadiochecked}
                inchradiochecked={inchradiochecked}
                setInchRadiochecked={setInchRadiochecked}
                rotation={rotation}
                setRotation={setRotation}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
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
                measurement={measurement}
                SetMeasurement={SetMeasurement}
                setCrop={setCrop}
                setZoom={setZoom}
                status={status}
                setStatus={setStatus}
                resetDimensions={resetDimensions}
                setResetDimensions={setResetDimensions}
                activeKey={activeKey}
                setActiveKey={setActiveKey}
                disableButton={disableButton}
                setDisableButton={setDisableButton}
                getCropData={getCropData}
                addToCart={addToCart}
                checkoutUrl={checkoutUrl}
                toastermessage={toastermessage}
                setToastermessage={setToastermessage}
                addingToCartToaster={addingToCartToaster}
                setSaveoptions={setSaveoptions}
                saveOptions={saveOptions}
                id={id}
                setId={setID}
                activeIndex={activeIndex}
                incheschecked={incheschecked}
                setIncheschecked={setIncheschecked}
                finalConversion={finalConversion}
                setFinalConversion={setFinalConversion}
                checked={checked}
                setChecked={setChecked}
                yesButton={yesButton}
                setYesButton={setYesButton}
                yesCheck={yesCheck}
                setYesCheck={setYesCheck}
                borderNo={borderNo}
                setBorderNo={setBorderNo}
                radioToggle={radioToggle}
                setRadioToggle={setRadioToggle}
                setCheckoutUrl={setCheckoutUrl}
                setCroppedImage={setCroppedImage}
                acceptAction={acceptAction}
                setAcceptAction={setAcceptAction}
                dimensionBoxFinish={dimensionBoxFinish}
                setDimensionBoxFinish={setDimensionBoxFinish}
                open={open}
                open1={open1}
                open2={open2}
                open3={open3}
                setOpen={setOpen}
                setOpen1={setOpen1}
                setOpen2={setOpen2}
                setOpen3={setOpen3}
                waitForCroppedImage={waitForCroppedImage}
                setWaitForCroppedImage={setWaitForCroppedImage}
                sessionExist={sessionExist}
                setSessionExist={setSessionExist}
                validationForPaper={validationForPaper}
                setValidationForPaper={setValidationForPaper}
                backGroundImage={backGroundImage}
                setBackGroundImage={setBackGroundImage}
                showFrameImage={showFrameImage}
                setShowFrameImage={setShowFrameImage}
                border={border}
                setBorder={setBorder}
                border1={border1}
                setBorder1={setBorder1}
                border2={border2}
                setBorder2={setBorder2}
                border3={border3}
                setBorder3={setBorder3}
                blob={blob}
                setBlob={setBlob}
              />
            </Col>

            <Col lg={12} span={24}>
              <ShowImage
                setSelectedPaperType={setSelectedPaperType}
                setImageDetails={setImageDetails}
                imageDetails={imageDetails}
                customDimensions={customDimensions}
                selectedPaperType={selectedPaperType}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
                borders={borders}
                radiochecked={radiochecked}
                setRadiochecked={setRadiochecked}
                inchradiochecked={inchradiochecked}
                setInchRadiochecked={setInchRadiochecked}
                setRotation={setRotation}
                rotation={rotation}
                aspectRatio={aspectRatio}
                measurement={measurement}
                crop={crop}
                setCrop={setCrop}
                croppedImage={croppedImage}
                onCropComplete={onCropComplete}
                zoom={zoom}
                setZoom={setZoom}
                id={id}
                setId={setID}
                frameCode={frameCode}
                mattings={mattings}
                configData={configData}
                setConfigData={setConfigData}
                status={status}
                setStatus={setStatus}
                setCroppedImage={setCroppedImage}
                resetDimensions={resetDimensions}
                setResetDimensions={setResetDimensions}
                activeKey={activeKey}
                setActiveKey={setActiveKey}
                setCustomDimensions={setCustomDimensions}
                cropper={cropper}
                setCropper={setCropper}
                image={image}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                waitForCroppedImage={waitForCroppedImage}
                incheschecked={incheschecked}
                setIncheschecked={setIncheschecked}
                setFinalConversion={setFinalConversion}
                SetMeasurement={SetMeasurement}
                setYesButton={setYesButton}
                setInchRadiochecked={setInchRadiochecked}
                setRadiochecked={setRadiochecked}
                setBorders={setBorders}
                setYesCheck={setYesCheck}
                setBorderNo={setBorderNo}
                radioToggle={radioToggle}
                setRadioToggle={setRadioToggle}
                setChecked={setChecked}
                setMattings={setMattings}
                setMoutingType={setMoutingType}
                setFrameCode={setFrameCode}
                setFrameOptions={setFrameOptions}
                setMatting={setMatting}
                setFramesize={setFramesize}
                setPly={setPly}
                setGlass={setGlass}
                setCheckoutUrl={setCheckoutUrl}
                frameOptions={frameOptions}
                blobs={blobs}
                setBlobs={setBlobs}
                acceptAction={acceptAction}
                setAcceptAction={setAcceptAction}
                dimensionBoxFinish={dimensionBoxFinish}
                setDimensionBoxFinish={setDimensionBoxFinish}
                getCropData={getCropData}
                open={open}
                open1={open1}
                open2={open2}
                open3={open3}
                setOpen={setOpen}
                setOpen1={setOpen1}
                setOpen2={setOpen2}
                setOpen3={setOpen3}
                backGroundImage={backGroundImage}
                setBackGroundImage={setBackGroundImage}
                showFrameImage={showFrameImage}
                setShowFrameImage={setShowFrameImage}
                setShowIcons={setShowIcons}
                sessionExist={sessionExist}
                setSessionExist={setSessionExist}
                validationForPaper={validationForPaper}
                setValidationForPaper={setValidationForPaper}
                setPrintingFramingSubtotal={setPrintingFramingSubtotal}
                setPrice={setPrice}
                setMouldingPrice={setMouldingPrice}
                border={border}
                setBorder={setBorder}
                border1={border1}
                setBorder1={setBorder1}
                border2={border2}
                setBorder2={setBorder2}
                border3={border3}
                setBorder3={setBorder3}
                blob={blob}
                setBlob={setBlob}
                setCartId={setCartId}
                setcartQuantity={setcartQuantity}
              />
            </Col>
            <Col lg={6} className="print_sidebar side_print_sidebar">
              <PrintDetails
                customDimensions={customDimensions}
                selectedPaperType={selectedPaperType}
                finalDimensions={finalDimensions}
                borders={borders}
                frameOptions={frameOptions}
                framesize={framesize}
                matting={matting}
                frameCode={frameCode}
                setFrameCode={setFrameCode}
                ply={ply}
                glass={glass}
                moutingType={moutingType}
                mattings={mattings}
                measurement={measurement}
                disableButton={disableButton}
                setDisableButton={setDisableButton}
                price={price}
                setPrice={setPrice}
                framingPrintingSubtotal={framingPrintingSubtotal}
                setPrintingFramingSubtotal={setPrintingFramingSubtotal}
                MouldingPrice={MouldingPrice}
                setMouldingPrice={setMouldingPrice}
                quantity={quantity}
                setQuantity={setQuantity}
                framingSubtotal={framingSubtotal}
                setFramingSubtotal={setFramingSubtotal}
                checkoutUrl={checkoutUrl}
                toastermessage={toastermessage}
                setToastermessage={setToastermessage}
                validationForPaper={validationForPaper}
                setValidationForPaper={setValidationForPaper}
                radioToggle={radioToggle}
                setRadioToggle={setRadioToggle}
                setPly={setPly}
                setMatting={setMatting}
                setMattings={setMattings}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default ImageEditor;
