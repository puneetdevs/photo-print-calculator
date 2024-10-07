import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { Button } from "antd";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import { fixControlledValue } from "antd/lib/input/Input";

const Papertype = (props) => {
  const {
    selectedPaperType,
    setSelectedPaperType,
    setOpen3,
    setOpen2,
    setOpen1,
    setOpen,
    setActiveKey,
    papertypewarning,
    measurement,
    customDimensions,
  } = props;
  const [paper, setPaper] = useState([]);
  const [dropdownArrow, setDropdownArrow] = useState(false);
  const [paperTypeWarning, setPaperTypeWarning] = useState(false);
  const paperData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API_URL}/user/paper`)
      .then((res) => {
        setPaper(res.data);
      })
      .catch((err) => { });
  };

  useEffect(() => {
    paperData();
  }, []);

  function CustomButton({ _, eventKey }) {
    const buttonClick = useAccordionToggle(eventKey, () => {
      if (selectedPaperType) {
        setActiveKey("2");
        setOpen3(false);
        setOpen2(true);
        setOpen1(false);
        setOpen(false);
      } else {
        setPaperTypeWarning(true);
        setTimeout(() => {
          setPaperTypeWarning(false);
        }, 2000);
      }
    });
    return (
      <Button
        size="large"
        className="continue-button-border"
        onClick={buttonClick}
      >
        <p className="continue-button-text-border">CONTINUE</p>
      </Button>
    );
  }

  return (
    <>
      {paperTypeWarning ? (
        <p className="file-error" style={{ textAlign: "center" }}>
          Please select Paper Type before moving ahead
        </p>
      ) : null}
      <Card>
        <Card.Body>
          <div className="test-area text-left">
            <div className="custom-select-area select-media">
              <span className="text-right">
                {dropdownArrow ? (
                  <img
                    className="arrow-image-dropdown"
                    src="../images/arrow-down.png"
                    alt=""
                  />
                ) : (
                  <img
                    className="arrow-image-dropdown"
                    src="../images/arrow-down.png"
                    alt=""
                  />
                )}
              </span>

              <DropdownButton
                alignRight
                title={
                  selectedPaperType ? (
                    <p style={{ letterSpacing: "1px", marginBottom: "0rem" }}>
                      {selectedPaperType.Papertype}
                    </p>
                  ) : (
                    "Select a Media"
                  )
                }
                id="dropdown-menu-align-right"
                onClick={(e) => {
                  setDropdownArrow(true);
                }}
              >
                {" "}
                {measurement === "inch"
                  ? paper.map((data) => {
                    let paperRollWidth = Number(data.info.paperRollWidthInches)
                    let finalW = Number(customDimensions.width) + 1
                    let finalH = Number(customDimensions.height) + 1
                    if (
                      finalW > paperRollWidth && finalH > paperRollWidth
                    ) {
                      //console.log('in', finalW > paperRollWidth && finalH > paperRollWidth)
                    } else {
                      //console.log('in', finalW > paperRollWidth && finalH > paperRollWidth)
                      return (
                        <Dropdown.Item
                          key={data._id}
                          eventKey={data._id}
                          onClick={(e) => {
                            setSelectedPaperType(data);
                          }}
                        >
                          {data.Papertype}
                        </Dropdown.Item>
                      );
                    }
                  })
                  : paper.map((data) => {
                    let paperRollWidth = Number(data.info.paperRollWidthCm)
                    let finalW = Number(customDimensions.width) + 2.54
                    let finalH = Number(customDimensions.height) + 2.54
                    if (
                      finalW > paperRollWidth || finalH > paperRollWidth
                    ) {
                      //console.log('cm', finalW > paperRollWidth || finalH > paperRollWidth)
                    } else {
                      //console.log('cm', finalW > paperRollWidth || finalH > paperRollWidth)
                      return (
                        <Dropdown.Item
                          key={data._id}
                          eventKey={data._id}
                          onClick={(e) => {
                            setSelectedPaperType(data);
                          }}
                        >
                          {data.Papertype}
                        </Dropdown.Item>
                      );
                    }
                  })}
              </DropdownButton>
              {papertypewarning}
              <CustomButton />
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default Papertype;
