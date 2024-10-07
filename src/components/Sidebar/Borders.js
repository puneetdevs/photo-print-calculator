import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import { Slider } from "antd";

const Borders = (props) => {
  const {
    setActiveKey,
    borders,
    setBorders,
    setOpen3,
    setOpen2,
    setOpen1,
    setOpen,
    yesCheck,
    setYesCheck,
    borderNo,
    setBorderNo,
    setYesBorder,
    setNoBorder,
    validationForPaper,
    setValidationForPaper,
    setRadioToggle,
    setFrameOptions,
    setFrameCode
  } = props;
  function CustomToggle({ _, eventKey }) {
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setActiveKey("3");
      setOpen3(false);
      setOpen2(false);
      setOpen1(false);
      setOpen(false);
      setBorders({ Top: 0, Bottom: 0, Left: 0, Right: 0 });
      setYesCheck(false);
      setBorderNo(true);
      setYesBorder(false);
      setNoBorder(true);
      setRadioToggle({
        printChecked: false,
        framingChecked: false,
        mountingChecked: false,
      });
      setFrameOptions("");
      setFrameCode("");
    });
    return (
      <input
        type="radio"
        checked={borderNo}
        onChange={decoratedOnClick}
      ></input>
    );
  }
  function CustomButton({ _, eventKey }) {
    const buttonClick = useAccordionToggle(eventKey, () => {
      setActiveKey("3");
      setOpen3(false);
      setOpen2(false);
      setOpen1(false);
      setOpen(false);
    });
    return (
      <div className="continue-button">
        <button
          type="button"
          className="btn btn-outline-primary btn-lg continue-button"
          onClick={buttonClick}
          disabled={validationForPaper !== false ? true : false}
        >
          CONTINUE
        </button>
      </div>
    );
  }

  const dataChange = (values) => {
    setBorders({
      Left: values,
      Right: values,
      Top: values,
      Bottom: values,
    });
  };
  useEffect(() => {
    if (borders?.Left < 0) {
      setBorders({ ...borders, Left: 0 });
    } else if (borders?.Right < 0) {
      setBorders({ ...borders, Right: 0 });
    } else if (borders?.Top < 0) {
      setBorders({ ...borders, Top: 0 });
    } else if (borders?.Bottom < 0) {
      setBorders({ ...borders, Bottom: 0 });
    }
    if (borders?.Left > 10) {
      setBorders({ ...borders, Left: 10 });
    } else if (borders?.Right > 10) {
      setBorders({ ...borders, Right: 10 });
    } else if (borders?.Top > 10) {
      setBorders({ ...borders, Top: 10 });
    } else if (borders?.Bottom > 10) {
      setBorders({ ...borders, Bottom: 10 });
    }
  }, [borders]);

  const editborder = yesCheck ? (
    <div className="custom-border-area">
      <Form>
        <div className="row-panel">
          <div className="row box-in-mobile">
            <div className="col-sm-3">
              <Form.Label>Left</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={borders.Left}
                onChange={(e) => {
                  setBorders({ ...borders, Left: e.target.value });
                }}
              />
            </div>
            <div className="col-sm-3">
              <Form.Label>Right</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={borders.Right}
                onChange={(e) => {
                  setBorders({ ...borders, Right: e.target.value });
                }}
              />
            </div>
            <div className="col-sm-3">
              <Form.Label>Top</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={borders.Top}
                onChange={(e) => {
                  setBorders({ ...borders, Top: e.target.value });
                }}
              />
            </div>
            <div className="col-sm-3">
              <Form.Label>Bottom</Form.Label>
              <Form.Control
                type="number"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={borders.Bottom}
                onChange={(e) => {
                  setBorders({ ...borders, Bottom: e.target.value });
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
              max={10}
              step={0.25}
              onChange={dataChange}
              tooltipVisible={false}
            />
            <div>+</div>
          </div>
          <Form.Label className="slide-border-line">
            <p>Slide to increase borders</p>
          </Form.Label>
        </Form.Group>
      </Form>
      {validationForPaper !== false ? (
        <div>
          <div className="mt-3">
            <p className="file-error text-center">{validationForPaper}</p>
          </div>
        </div>
      ) : null}
      <CustomButton />
    </div>
  ) : null;

  return (
    <Card>
      <Card.Body>
        <div className="test-area text-left">
          <h2 className="title">
            Borders are added in addition to the selected image size
          </h2>
          <div className="custom-radiobox custom-radiobox-border custom-radiobox-item ">
            <div className="label-cust">
              <label className="custom_radio">
                <input
                  type="radio"
                  name="checked"
                  checked={yesCheck}
                  onChange={(e) => {
                    setYesCheck(true);
                    setBorderNo(false);
                    setYesBorder(true);
                    setNoBorder(false);
                  }}
                />{" "}
                <span></span> Yes
              </label>
              {!yesCheck ? (
                <em className="border-text">
                  We strongly suggest that you have borders on your work for
                  handling/framing etc
                </em>
              ) : (
                <em className="border-text">
                  We strongly suggest that you have borders on your work for
                  handling. However, if we are matting or framing your order,
                  they are not necessary.
                </em>
              )}
            </div>
            <div className="label-cust">
              <label className="custom_radio">
                <CustomToggle /> <span></span> No
              </label>
              <em className="border-text">
                Your prints will be trimmed to the edge with no white space
                showing
              </em>
            </div>
          </div>
        </div>
        {editborder}
      </Card.Body>
    </Card>
  );
};
export default Borders;
