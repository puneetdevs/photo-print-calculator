/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Select, Slider } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
const { Option } = Select;

// const getLocalItem = () => {
//   const data = JSON.parse(localStorage.getItem("data"));

//   if (data) {
//     return JSON.parse(localStorage.getItem("data"));
//   } else {
//     return false;
//   }
// };

const Framingandmounting = (props) => {
  const {
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
    disableButton,
    setDisableButton,
    addToCart,
    checkoutUrl,
    addingToCartToaster,
    setSelectedPaperType,
    setFinalCheckoutUrl,
    selectedPaperType,
    radioToggle,
    setRadioToggle,
    mountchecked,
    setMountchecked,
    active,
    setActive,
    checkedFrame,
    setCheckedFrame,
    printonlyCheck,
    setPrintonlyCheck,
    validationForPaper,
    setValidationForPaper,
    borders,
    setBorders,
  } = props;

  // get productid from url
  var product_id = '';
  const [productID, setProductID] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    product_id = queryParams.get("productId")
    if (product_id) {
      setProductID(true)
    }
    else {
      setProductID(false)
    }
  },[]);

  const [frameData, setFrameData] = useState([]);

  useEffect(() => {
    //setDisableButton(true);
    const data = JSON.parse(localStorage.getItem("checkoutButton"));
    if (data) {
      // setDisableButton(data);
    }
  },[]);

  const fetchFrameData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/frame`)
      .then((res) => {
        setFrameData(res.data);
      })
      .catch((err) => { });
  };
  React.useEffect(() => {
    fetchFrameData();
  }, []);

  useEffect(() => {


    if (
      ((frameCode && glass !== "none") ||
        moutingType !== "" ||
        printonlyCheck) &&
      selectedPaperType
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [frameCode, moutingType, printonlyCheck, glass]);
  useEffect(() => {
    const codeValue = frameData.find((data) => {
      if (
        data.FrameOption === frameOptions &&
        data.Colour === matting &&
        data.Size === framesize
      ) {
        return data;
      }
    });
    if (codeValue !== undefined) {
      setFrameCode(codeValue);
    }
  }, [framesize, matting, frameOptions]);

  useEffect(() => {
    setMatting("");
  }, [frameOptions]);

  useEffect(() => {
    if (ply === "None") {
      setMattings({ Left: 0, Right: 0, Top: 0, Bottom: 0 });
    }
  }, [ply]);

  const onFrameChange = (value) => {
    setFrameCode(undefined);
    setFramesize("");
    setFrameOptions(value);
  };

  const dataChange = (values) => {
    setMattings({
      Left: values,
      Right: values,
      Top: values,
      Bottom: values,
    });
  };

  useEffect(() => {
    if (mattings?.Left < 0) {
      setMattings({ ...mattings, Left: 0 });
    } else if (mattings?.Right < 0) {
      setMattings({ ...mattings, Right: 0 });
    } else if (mattings?.Top < 0) {
      setMattings({ ...mattings, Top: 0 });
    } else if (mattings?.Bottom < 0) {
      setMattings({ ...mattings, Bottom: 0 });
    }
    if (mattings?.Left > 5) {
      setMattings({ ...mattings, Left: 5 });
    } else if (mattings?.Right > 5) {
      setMattings({ ...mattings, Right: 5 });
    } else if (mattings?.Top > 5) {
      setMattings({ ...mattings, Top: 5 });
    } else if (mattings?.Bottom > 5) {
      setMattings({ ...mattings, Bottom: 5 });
    }
  }, [mattings]);

  const onMattingChange = (value) => {
    setPly(value);
  };

  const onGlassChange = (value) => {
    setGlass(value);
  };

  // Start - to check the checkout url

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

  const MattingSlider =
    ply !== "None" && ply ? (
      <Form className="form-box1">
        <div className="row-panel ">
          <div className="row box-in-mobile">
            <div className="col-sm-3">
              <Form.Label>Left</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={mattings?.Left}
                onChange={(e) => {
                  setMattings({
                    ...mattings,
                    Left: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col-sm-3">
              <Form.Label>Right</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={mattings?.Right}
                onChange={(e) => {
                  setMattings({
                    ...mattings,
                    Right: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col-sm-3">
              <Form.Label>Top</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={mattings?.Top}
                onChange={(e) => {
                  setMattings({
                    ...mattings,
                    Top: e.target.value,
                  });
                }}
              />
            </div>
            <div className="col-sm-3">
              <Form.Label>Bottom</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={mattings?.Bottom}
                onChange={(e) => {
                  setMattings({
                    ...mattings,
                    Bottom: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <br />
        <Form.Group controlId="formBasicRange">
          <div className="SliderRow">
            <div>-</div>
            <Slider
              min={0}
              codeValue
              max={5}
              step={0.25}
              onChange={dataChange}
              tooltipVisible={false}
            />
            <div>+</div>
          </div>
          <Form.Label className="slide-border-line">
            <p> Slide to increase mat board width</p>
          </Form.Label>
        </Form.Group>
      </Form>
    ) : null;

  const framingdropdown = radioToggle?.framingChecked ? (
    <div className="select-frame-option">
      <Select
        placeholder="Frame Option"
        className="frameOptionSelect"
        style={{ width: 200, marginLeft: 30 }}
        size="large"
        defaultValue={frameOptions ? frameOptions : "Frame Option"}
        onChange={onFrameChange}
      >
        <Option value="Classic Wood" className="frame-options">
          Classic Wood
        </Option>
        <Option value="Metal" className="frame-options">
          Metal
        </Option>
        <Option value="Shadow Box" className="frame-options">
          Shadow Box
        </Option>
        <Option value="Handmade/Seamless" className="frame-options">
          Handmade/Seamless
        </Option>
      </Select>
    </div>
  ) : null;

  const FrameOption = () => {
    switch (frameOptions) {
      case "Classic Wood":
        return (
          <DropdownButton
            alignRight
            className="MouldingButton inner-dropdown drop-arrow-icon "
            // style={{ border: "1px solid #d9d9d9" }}
            title={
              frameCode ? (
                <b>{`${frameCode?.Colour}-${frameCode?.Size}`}</b>
              ) : (
                "Frame Colour"
              )
            }
            id="dropdown-menu-align-right"
            style={{ marginLeft: 30, borderTop: "0px" }}
          >
            <DropdownButton
              alignRight
              title="Black"
              className="moulding-options drop-arrow-icon hoverEffect offset"
              id="dropdown-menu-align-right"
              onClick={() => {
                setMatting("Black");
              }}
            >
              <Dropdown.Item
                eventKey="option-1"
                onClick={() => setFramesize("Small")}
              >
                Small
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="option-2"
                onClick={() => setFramesize("Large")}
              >
                Large
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              alignRight
              title="White"
              className="moulding-options drop-arrow-icon hoverEffect offset"
              id="dropdown-menu-align-right"
              onClick={() => {
                setMatting("White");
              }}
            >
              <Dropdown.Item
                eventKey="option-1"
                onClick={() => setFramesize("Small")}
              >
                Small
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="option-2"
                onClick={() => setFramesize("Large")}
              >
                Large
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              alignRight
              title="Maple"
              className="moulding-options drop-arrow-icon hoverEffect offset"
              id="dropdown-menu-align-right"
              onClick={() => {
                setMatting("Maple");
              }}
            >
              <Dropdown.Item
                eventKey="option-1"
                onClick={() => setFramesize("Small")}
              >
                Small
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="option-2"
                onClick={() => setFramesize("Large")}
              >
                Large
              </Dropdown.Item>
            </DropdownButton>
          </DropdownButton>
        );
      case "Metal":
        return (
          <DropdownButton
            alignRight
            title={
              frameCode ? (
                <b>{`${frameCode?.Colour}-${frameCode?.Size}`}</b>
              ) : (
                "Frame Colour"
              )
            }
            className="MouldingButton inner-dropdown drop-arrow-icon "
            id="dropdown-menu-align-right"
            style={{ marginLeft: 30 }}
          // style={{ marginLeft: 30, border: "1px solid #d9d9d9" }}
          >
            <DropdownButton
              alignRight
              title="Black"
              className="moulding-options drop-arrow-icon hoverEffect offset"
              id="dropdown-menu-align-right"
              onClick={() => {
                setMatting("Black");
              }}
            >
              <Dropdown.Item
                eventKey="option-1"
                onClick={() => setFramesize("Standard")}
              >
                Standard
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              alignRight
              title="Maple"
              className="moulding-options drop-arrow-icon hoverEffect offset"
              id="dropdown-menu-align-right"
              onClick={() => {
                setMatting("Maple");
              }}
            >
              <Dropdown.Item
                eventKey="option-1"
                onClick={() => setFramesize("Standard")}
              >
                Standard
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton
              alignRight
              title="Grey"
              className="moulding-options drop-arrow-icon hoverEffect offset"
              id="dropdown-menu-align-right"
              onClick={() => {
                setMatting("Grey");
              }}
            >
              <Dropdown.Item
                eventKey="option-1"
                onClick={() => setFramesize("Standard")}
              >
                Standard
              </Dropdown.Item>
            </DropdownButton>
          </DropdownButton>
        );
      case "Shadow Box":
        return (
          <div style={{ marginLeft: 30 }}>
            <DropdownButton
              alignRight
              title={
                frameCode ? (
                  <b>{`${frameCode?.Colour}-${frameCode?.Size}`}</b>
                ) : (
                  "Frame Colour"
                )
              }
              className="MouldingButton inner-dropdown drop-arrow-icon"
              id="dropdown-menu-align-right"
            // style={{ border: "1px solid #d9d9d9" }}
            >
              <DropdownButton
                alignRight
                title="Black"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                id="dropdown-menu-align-right"
                onClick={() => {
                  setMatting("Black");
                }}
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Standard")}
                >
                  Standard
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                alignRight
                title="White"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                id="dropdown-menu-align-right"
                onClick={() => {
                  setMatting("White");
                }}
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Standard")}
                >
                  Standard
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                alignRight
                title="Maple"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                id="dropdown-menu-align-right"
                onClick={() => {
                  setMatting("Maple");
                }}
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Standard")}
                >
                  Standard
                </Dropdown.Item>
              </DropdownButton>
            </DropdownButton>
          </div>
        );

      case "Handmade/Seamless":
        return (
          <div style={{ marginLeft: 30 }}>
            <DropdownButton
              alignRight
              title={
                frameCode ? (
                  <b>{`${frameCode?.Colour}-${frameCode?.Size}`}</b>
                ) : (
                  "Frame Colour"
                )
              }
              className="MouldingButton inner-dropdown drop-arrow-icon "
              id="dropdown-menu-align-right"
            // style={{ border: "1px solid #d9d9d9" }}
            >
              <DropdownButton
                alignRight
                title="Black"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                onClick={() => {
                  setMatting("Black");
                }}
                id="dropdown-menu-align-right"
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Small")}
                >
                  Small
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-2"
                  onClick={() => setFramesize("Medium")}
                >
                  Medium
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-3"
                  onClick={() => setFramesize("Large")}
                >
                  Large
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                alignRight
                title="White"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                id="dropdown-menu-align-right"
                onClick={() => {
                  setMatting("White");
                }}
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Small")}
                >
                  Small
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-2"
                  onClick={() => setFramesize("Medium")}
                >
                  Medium
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-3"
                  onClick={() => setFramesize("Large")}
                >
                  Large
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                alignRight
                title="Maple"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                id="dropdown-menu-align-right"
                onClick={() => {
                  setMatting("Maple");
                }}
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Small")}
                >
                  Small
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-2"
                  onClick={() => setFramesize("Medium")}
                >
                  Medium
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-3"
                  onClick={() => setFramesize("Large")}
                >
                  Large
                </Dropdown.Item>
              </DropdownButton>
              <DropdownButton
                alignRight
                title="Grey"
                className="moulding-options drop-arrow-icon hoverEffect offset"
                id="dropdown-menu-align-right"
                onClick={() => {
                  setMatting("Grey");
                }}
              >
                <Dropdown.Item
                  eventKey="option-1"
                  onClick={() => setFramesize("Small")}
                >
                  Small
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-2"
                  onClick={() => setFramesize("Medium")}
                >
                  Medium
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="option-3"
                  onClick={() => setFramesize("Large")}
                >
                  Large
                </Dropdown.Item>
              </DropdownButton>
            </DropdownButton>
          </div>
        );
      default:
        <h1>lhxguycwj</h1>;
    }
  };

  const mountingdropdown =
    (mountchecked && active === 3) || radioToggle?.mountingChecked ? (
      <div className="select-frame-option">
        <Select
          placeholder={moutingType ? moutingType : "Select Option"}
          style={{ width: 200, marginLeft: 30 }}
          className="frameOptionSelect"
          size="large"
          onChange={(value) => setMoutingType(value)}
        >
          <Option value="1/2 Ultra Mount" className="hoverEffect">
            1/2" Ultra Mount
          </Option>
          <Option value="3/16 Ultra Mount" className="hoverEffect">
            3/16" Ultra Mount
          </Option>
          <Option value="3/16 Archival Foam Board" className="hoverEffect">
            3/16" Archival Foam Board
          </Option>

          {/* <Option value="Alupanel" className="hoverEffect">
            Alupanel
          </Option> */}
        </Select>
      </div>
    ) : null;
  return (
    <Card>
      <Card.Body className="pt-0 farm-mount-area">
        <div className="test-area text-left">
          <div className="custom-radiobox">
            <div className="label-cust label-cust-top">
              <label className="custom_radio">
                <input
                  type="radio"
                  name="printOnly"
                  checked={radioToggle?.printChecked}
                  onChange={() => {
                    setActive(1);
                    setDisableButton(true);
                    setPrintonlyCheck(true);
                    setRadioToggle({
                      printChecked: true,
                      mountingChecked: false,
                      framingChecked: false,
                    });
                    setMoutingType("");
                    setFrameOptions("");
                    setMattings("");
                    setFramesize("");
                    setPly("None");
                    setGlass("none");
                    setMattings({ Left: 0, Right: 0, Top: 0, Bottom: 0 });
                    setFrameCode(undefined);
                    // if(borders?.Left+borders?.Right == 1 || borders?.Top + borders?.Bottom == 1){
                    //   setBorders({ Top: 0, Bottom: 0, Left: 0, Right: 0 });
                    // }
                    // setOption("");
                  }}
                  onClick={() => { }}
                />{" "}
                <span></span>
                Print Only
              </label>
            </div>
            <div className="label-cust">
              <label className="custom_radio">
                <input
                  type="radio"
                  name="framing"
                  checked={radioToggle?.framingChecked}
                  onChange={() => {
                    setCheckedFrame(true);
                    setMountchecked(false);
                    setActive(2);
                    setPrintonlyCheck(false);
                    setRadioToggle({
                      printChecked: false,
                      mountingChecked: false,
                      framingChecked: true,
                    });
                    setMoutingType("");
                    // if(borders?.Left+borders?.Right == 0 || borders?.Top + borders?.Bottom == 0){
                    //   setBorders({ Top: 0.5, Bottom: 0.5, Left: 0.5, Right: 0.5 });
                    // }
                    // setOption("");
                  }}
                />{" "}
                <span></span>
                Framing
              </label>
              <div className="custom-select-area area-left">
                {framingdropdown}
                {FrameOption()}

                {frameCode &&
                  frameOptions !== "Shadow Box" &&
                  radioToggle?.framingChecked ? (
                  <>
                    <Select
                      placeholder="Matting"
                      className="mattingInput frameOptionSelect"
                      style={{
                        width: 200,
                        marginBottom: 20,
                        marginTop: 20,
                        marginLeft: 30,
                      }}
                      defaultValue={ply !== "None" ? ply : "Matting"}
                      size="large"
                      onChange={onMattingChange}
                    >
                      <Option value="None" className="hoverEffect">
                        {" "}
                        None
                      </Option>
                      <Option value="4 PLY white" className="hoverEffect">
                        4 PLY white
                      </Option>
                      <Option value="8 PLY white" className="hoverEffect">
                        8 PLY white
                      </Option>
                    </Select>
                    {MattingSlider}
                  </>
                ) : null}
                {frameCode && radioToggle?.framingChecked ? (
                  <>
                    <Select
                      placeholder="Glass"
                      className="mattingInput frameOptionSelect"
                      style={{
                        width: 200,
                        marginLeft: 30,
                        marginTop: frameOptions === "Shadow Box" ? 25 : 0,
                      }}
                      defaultValue={glass !== "none" ? glass : "Glass"}
                      size="large"
                      onChange={onGlassChange}
                    >
                      <Option value="Reflective" className="hoverEffect">
                        Reflective
                      </Option>
                      <Option value="Non-Reflective" className="hoverEffect">
                        Non-Reflective
                      </Option>
                    </Select>
                  </>
                ) : null}
              </div>
            </div>
            <div className="label-cust">
              <label className="custom_radio">
                <input
                  type="radio"
                  name="mounting"
                  checked={radioToggle?.mountingChecked}
                  onChange={() => {
                    setMountchecked(true);
                    setCheckedFrame(false);
                    setActive(3);
                    setRadioToggle({
                      printChecked: false,
                      mountingChecked: true,
                      framingChecked: false,
                    });
                    setPrintonlyCheck(false);
                    setFrameCode(undefined);
                    setFrameOptions("");
                    setMattings("");
                    setFramesize("");
                    setPly("None");
                    setGlass("none");
                    setMattings({ Left: 0, Right: 0, Top: 0, Bottom: 0 });
                    //  if(borders?.Left+borders?.Right == 1 || borders?.Top + borders?.Bottom == 1){
                    //   setBorders({ Top: 0, Bottom: 0, Left: 0, Right: 0 });
                    // }
                    // setOption("");
                  }}
                />{" "}
                <span></span>
                Mounting
              </label>
              <div className="custom-select-area area-left">
                {mountingdropdown}
              </div>
            </div>
          </div>
        </div>
        <div className="cart-control-btn btn-groups">
          <Form.Row>
            <Col xs={6}>
              <a href={checkoutUrl} onClick={checkUrl}>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className={
                    !checkoutUrl ? "btn_disabled w100p" : " btn-primary w100p"
                  }
                  disabled={!checkoutUrl}
                >
                  COMPLETE ORDER
                </Button>
              </a>
            </Col>
            <Col xs={6}>
              {addingToCartToaster ? (
                <Button
                  type="submit"
                  variant="outline-primary"
                  className={
                    !disableButton ? "btn_disabled w100p" : " btn-primary w100p"
                  }
                  loading="true"
                >
                  Adding to the cart ....
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="outline-primary"
                  className={
                    !disableButton ? "btn_disabled w100p" : " btn-primary w100p"
                  }
                  disabled={!disableButton}
                  onClick={addToCart}
                  loading="false"
                >
                  {productID ? 'UPDATE CART' : 'ADD TO CART & KEEP PRINTING'}
                </Button>
              )}
            </Col>
          </Form.Row>
        </div>
      </Card.Body>
    </Card>
  );
};
export default Framingandmounting;
