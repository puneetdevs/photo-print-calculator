import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Badge } from "antd";
import { Toast } from "react-bootstrap";

const baseUrl = process.env.REACT_APP_API_URL;
// website url
const websiteUrl = process.env.REACT_APP_TRICERA_PRINT_URL;
// url to faq
const faqUrl = process.env.REACT_APP_TRICERA_PRINT_URL + "/faq/";
// url to go to my files
const myFilesUrl = process.env.REACT_APP_SHOPIFY_URL + "/account/";
// url to login
const loginUrl = process.env.REACT_APP_SHOPIFY_URL + "/account/login";

let cart = localStorage.getItem("checkoutdata");
const MainHeader = ({
  showIcons,
  setShowIcons,
  checkoutPrice,
  checkoutUrl,
  cartQuantity,
  toastermessage,
  setToastermessage,
}) => {
  const [configData, setConfigData] = React.useState(
    sessionStorage.getItem("photoapp-configs")
  );
  useEffect(() => {
    if (cart) {
      let session = sessionStorage.getItem("photoapp-configs");
      if (session) {
        setShowIcons(true);
      } else {
        setShowIcons(false);
      }
    } else {
      setShowIcons(false);
    }
    // if (
    //   window.location.href === `${process.env.REACT_APP_FRONTEND}/makeOrder`
    // ) {
    //   setShowIcons(true);
    // } else {
    //   setShowIcons(false);
    // }
  }, [setShowIcons]);
  // Start - to check the checkout url
  const history = useHistory();
  const [finalCheckouUrl, setFinalCheckoutUrl] = useState("");
  const [showToaster, setShowToaster] = useState("");
  const checkUrl = () => {
    cart = localStorage.getItem("checkoutdata");
    if (cart === null) {
      setShowToaster("show");
      setFinalCheckoutUrl("show");
    } else {
      async function fetchData() {
        // get cart url data from local storage
        const checkoutdata = await localStorage.getItem("checkoutdata");
        // parse the data so we can extract cart id
        const cartId = JSON.parse(checkoutdata);
        // to get checkout URL from the local stoage
        const checkoutUrl = JSON.parse(checkoutdata);
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: cartId.cart_id }),
        };
        // fetching cart data
        await fetch(`${baseUrl}/user/cartValid`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            cart = data;
            // if there are no products in the cart
            if (cart.data.cart.lines.edges.length === 0) {
              setShowToaster("");
              setShowToaster("show");
            } else {
              setShowToaster("");
              history.push("/cart");
            }
          });
      }
      fetchData();
      setFinalCheckoutUrl(checkoutUrl);
    }
  };
  setTimeout(() => {
    setFinalCheckoutUrl("");
  }, 2000);
  setTimeout(() => {
    setShowToaster("");
  }, 2000);
  // End

  return (
    <div className="header-section bg-white">
      <div className="container">
        <div className=" flex flex-wrap">
          <div className="flex-1 flex justify-between items-center">
            <a href={websiteUrl}>
              {" "}
              <img className="headerLeft" src="../images/Photoapp-print.svg" />
            </a>
          </div>

          {/* <label htmlFor="menu-toggle" className="pointer-cursor sm:hidden block">
          <svg
            className="fill-current text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label> */}
          {/* <input type="checkbox" id="menu-toggle" /> */}

          {showIcons ? (
            <>
              <div
                className="md:flex md:items-center md:w-auto w-full mt-8 md:mt-0"
                id="menu"
              >
                <span className="information">
                  <a href={faqUrl} target="_blank">
                    <img src="../images/information.svg" alt="logo" />
                  </a>
                </span>
                <span className="myfiles">
                  <a href={myFilesUrl} className="myFiles_link">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="29"
                      fill="currentColor"
                      className="bi bi-person"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                  </a>
                </span>
                <Badge className="cart" count={cartQuantity}>
                  <Link to="#" onClick={() => checkUrl()}>
                    <img src="../images/cart.svg" alt="logo" />
                  </Link>
                </Badge>
              </div>
              {showToaster ? (
                <div
                  className="position-absolute empty-toaster"
                  style={{
                    right: "10px",
                    top: "10px",
                    zIndex: 1,
                    width: "320px",
                    background: "white",
                    borderRadius: "inherit",
                  }}
                >
                  <Toast>
                    <Toast.Body>
                      <div className="custom_toaster">
                        <img className="gif-img" src="../images/waring.svg" />

                        <h6>Empty Cart</h6>
                        <span>Add an item in order to checkout.</span>

                        <div className="close_icon">
                          <span onClick={() => setShowToaster("")}>
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.5875 4L7.2125 1.37917C7.29096 1.30071 7.33503 1.19429 7.33503 1.08333C7.33503 0.972375 7.29096 0.865961 7.2125 0.787501C7.13404 0.709041 7.02762 0.664963 6.91666 0.664963C6.8057 0.664963 6.69929 0.709041 6.62083 0.787501L4 3.4125L1.37916 0.787501C1.3007 0.709041 1.19429 0.664963 1.08333 0.664963C0.972369 0.664963 0.865955 0.709041 0.787495 0.787501C0.709035 0.865961 0.664957 0.972375 0.664957 1.08333C0.664957 1.19429 0.709035 1.30071 0.787495 1.37917L3.4125 4L0.787495 6.62083C0.748441 6.65957 0.717444 6.70565 0.69629 6.75643C0.675137 6.8072 0.664246 6.86166 0.664246 6.91667C0.664246 6.97167 0.675137 7.02613 0.69629 7.07691C0.717444 7.12768 0.748441 7.17377 0.787495 7.2125C0.826229 7.25155 0.872313 7.28255 0.923088 7.30371C0.973863 7.32486 1.02832 7.33575 1.08333 7.33575C1.13833 7.33575 1.19279 7.32486 1.24357 7.30371C1.29434 7.28255 1.34043 7.25155 1.37916 7.2125L4 4.5875L6.62083 7.2125C6.65956 7.25155 6.70565 7.28255 6.75642 7.30371C6.8072 7.32486 6.86166 7.33575 6.91666 7.33575C6.97167 7.33575 7.02613 7.32486 7.0769 7.30371C7.12768 7.28255 7.17376 7.25155 7.2125 7.2125C7.25155 7.17377 7.28255 7.12768 7.3037 7.07691C7.32485 7.02613 7.33574 6.97167 7.33574 6.91667C7.33574 6.86166 7.32485 6.8072 7.3037 6.75643C7.28255 6.70565 7.25155 6.65957 7.2125 6.62083L4.5875 4Z"
                                fill="#939393"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Toast.Body>
                  </Toast>
                </div>
              ) : null}
              {/* {finalCheckouUrl === "show" ? ( 
              <div
                className="position-absolute empty-toaster"
                style={{
                  right: "10px",
                  top: "10px",
                  zIndex: 1,
                  width: "320px",
                  background: "white",
                  borderRadius: "inherit",
                }}
              >
                <Toast>
                  <Toast.Body>
                    <div className="custom_toaster">
                  
                        <img className="gif-img" src="../images/waring.svg" />                    
                       
                        <h6>Empty Cart</h6>
                        <span>Add an item in order to checkout.</span>
                      
                      <div className="close_icon">
                        <span onClick={() => setFinalCheckoutUrl("")}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5875 4L7.2125 1.37917C7.29096 1.30071 7.33503 1.19429 7.33503 1.08333C7.33503 0.972375 7.29096 0.865961 7.2125 0.787501C7.13404 0.709041 7.02762 0.664963 6.91666 0.664963C6.8057 0.664963 6.69929 0.709041 6.62083 0.787501L4 3.4125L1.37916 0.787501C1.3007 0.709041 1.19429 0.664963 1.08333 0.664963C0.972369 0.664963 0.865955 0.709041 0.787495 0.787501C0.709035 0.865961 0.664957 0.972375 0.664957 1.08333C0.664957 1.19429 0.709035 1.30071 0.787495 1.37917L3.4125 4L0.787495 6.62083C0.748441 6.65957 0.717444 6.70565 0.69629 6.75643C0.675137 6.8072 0.664246 6.86166 0.664246 6.91667C0.664246 6.97167 0.675137 7.02613 0.69629 7.07691C0.717444 7.12768 0.748441 7.17377 0.787495 7.2125C0.826229 7.25155 0.872313 7.28255 0.923088 7.30371C0.973863 7.32486 1.02832 7.33575 1.08333 7.33575C1.13833 7.33575 1.19279 7.32486 1.24357 7.30371C1.29434 7.28255 1.34043 7.25155 1.37916 7.2125L4 4.5875L6.62083 7.2125C6.65956 7.25155 6.70565 7.28255 6.75642 7.30371C6.8072 7.32486 6.86166 7.33575 6.91666 7.33575C6.97167 7.33575 7.02613 7.32486 7.0769 7.30371C7.12768 7.28255 7.17376 7.25155 7.2125 7.2125C7.25155 7.17377 7.28255 7.12768 7.3037 7.07691C7.32485 7.02613 7.33574 6.97167 7.33574 6.91667C7.33574 6.86166 7.32485 6.8072 7.3037 6.75643C7.28255 6.70565 7.25155 6.65957 7.2125 6.62083L4.5875 4Z" fill="#939393"/>
                        </svg>
                        </span>
                      </div>
                    </div>
                  </Toast.Body>
                </Toast>
              </div>
             ) : null}  */}
            </>
          ) : (
            <div
              className="md:flex md:items-center md:w-auto w-full mt-8 md:mt-0"
              id="menu"
            >
              <div>
                <a className="login-button-a" href={loginUrl}>
                  <button className="login-button">YOUR ACCOUNT</button>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
