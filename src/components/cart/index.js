import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./cart.css";
const baseUrl = process.env.REACT_APP_API_URL;

const Spinner = () => {
  return <div className="container text-center">Loading...</div>;
};

function Cart(props) {
  // for loading spinner
  const [spinner, setSpinner] = useState(true);
  // to get cart
  let cart;
  const [mainCart, setMainCart] = useState();
  // states to render on cards
  const [total, setTotal] = useState();
  const [subtotal, setSubTotal] = useState();
  const [tax, setTax] = useState();
  const [products, setProducts] = useState([]);
  const [mainCartId, setMainCartId] = useState();
  const [pleaseAddItems, setPleaseAddItems] = useState(false);
  const [continueBtn, setContinueBtn] = useState(false);
  const [shopifyUrl, setShopifyUrl] = useState();

  // component to show when cart is empty
  const PleaseAddItems = () => {
    return (
      <div className="cartIsEmpty">
        <Link className="text_decoration_none" to="/makeOrder">
          Cart is empty click here to add items.
        </Link>
      </div>
    );
  };
  // to scroll at top of the page on firdt render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const history = useHistory();
  useEffect(() => {
    if (!localStorage.getItem("checkoutdata")) {
      history.push("/makeOrder");
    }
  }, [history]);

  // for managing cart quantity in header
  let cartProductsQuantity;
  let sum = 0;

  useEffect(() => {
    async function fetchData() {
      // get cart url data from local storage
      const checkoutdata = await localStorage.getItem("checkoutdata");
      // parse the data so we can extract cart id
      const cartId = JSON.parse(checkoutdata);
      // to get checkout URL from the local stoage
      const checkoutUrl = JSON.parse(checkoutdata);
      // to get shopifyUrl from local
      setShopifyUrl(checkoutUrl.checkoutUrl);

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
          // console.log(cart.data.cart.lines.edges)
          if (cart.data.cart === null) {
            setSpinner(false);
            setPleaseAddItems(true);
            setContinueBtn(true);
          }
          setMainCart(cart);
          setTotal(cart.data.cart.estimatedCost.totalAmount.amount);
          setSubTotal(cart.data.cart.estimatedCost.subtotalAmount.amount);
          setTax(cart.data.cart.estimatedCost?.totalTaxAmount?.amount);
          setProducts(cart.data.cart.lines.edges);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cartProductsQuantity = cart.data.cart.lines.edges.map((i) => {
            return i.node.quantity;
          });
          // eslint-disable-next-line react-hooks/exhaustive-deps
          sum = cartProductsQuantity.reduce((pv, cv) => pv + cv, 0);
          props.setcartQuantity(sum);
          props.setShowIcons(true);
          setMainCartId(cart.data.cart.id);
          setSpinner(false);
          // if there are no products in the cart
          if (cart.data.lines?.edges.length === 0) {
            props.setShowIcons(true);
            setPleaseAddItems(true);
            setContinueBtn(true);
            // localStorage.clear();
          }
        });
    }
    fetchData();
  }, []);

  // handle product increment
  const handleIncreament = async (productId, quantity) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: mainCartId,
        cartQty: quantity + 1,
        productId: productId,
      }),
    };
    await fetch(`${baseUrl}/user/updateCart`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        cart = data;
        // console.log(cart);
        setMainCart(cart);
        setTotal(
          cart.data.cartLinesUpdate.cart.estimatedCost.totalAmount.amount
        );
        setSubTotal(
          cart.data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.amount
        );
        setTax(
          cart.data.cartLinesUpdate.cart.estimatedCost?.totalTaxAmount?.amount
        )
        setProducts(cart.data.cartLinesUpdate.cart.lines.edges);
        setMainCartId(cart.data.cartLinesUpdate.cart.id);
        // incresing cart items quantity for header
        cartProductsQuantity = cart.data.cartLinesUpdate.cart.lines.edges.map(
          (i) => {
            return i.node.quantity;
          }
        );
        sum = cartProductsQuantity.reduce((pv, cv) => pv + cv, 0);
        props.setcartQuantity(sum);
      });
  };

  // handle product decrement
  const handleDecrement = async (productId, quantity) => {
    if (quantity === 1) {
      return false;
    } else {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: mainCartId,
          cartQty: quantity - 1,
          productId: productId,
        }),
      };
      await fetch(`${baseUrl}/user/updateCart`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          cart = data;
          setMainCart(cart);
          setTotal(
            cart.data.cartLinesUpdate.cart.estimatedCost.totalAmount.amount
          );
          setSubTotal(
            cart.data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.amount
          );
          setTax(
            cart.data.cartLinesUpdate.cart.estimatedCost?.totalTaxAmount?.amount
          )
          setProducts(cart.data.cartLinesUpdate.cart.lines.edges);
          setMainCartId(cart.data.cartLinesUpdate.cart.id);
          cartProductsQuantity = cart.data.cartLinesUpdate.cart.lines.edges.map(
            (i) => {
              return i.node.quantity;
            }
          );
          sum = cartProductsQuantity.reduce((pv, cv) => pv + cv, 0);
          props.setcartQuantity(sum);
        });
      // if there are no products in the cart
      if (cart.data.cartLinesUpdate.cart.lines.edges.length === 0) {
        setPleaseAddItems(true);
        setContinueBtn(true);
        localStorage.removeItem('checkoutdata');
      }
    }
  };

  // handle delete
  const handleDelete = async (productId, quantity) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: mainCartId,
        cartQty: 0,
        productId: productId,
      }),
    };
    await fetch(`${baseUrl}/user/updateCart`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        cart = data;
        setMainCart(cart);
        setTotal(
          cart.data.cartLinesUpdate.cart.estimatedCost.totalAmount.amount
        );
        setSubTotal(
          cart.data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.amount
        );
        setTax(
          cart.data.cartLinesUpdate.cart.estimatedCost?.totalTaxAmount?.amount
        )
        setProducts(cart.data.cartLinesUpdate.cart.lines.edges);
        setMainCartId(cart.data.cartLinesUpdate.cart.id);
        cartProductsQuantity = cart.data.cartLinesUpdate.cart.lines.edges.map(
          (i) => {
            return i.node.quantity;
          }
        );
        sum = cartProductsQuantity.reduce((pv, cv) => pv + cv, 0);
        props.setcartQuantity(sum);
      });
    // if there are no products in the cart
    if (cart.data.cartLinesUpdate.cart.lines.edges.length === 0) {
      setPleaseAddItems(true);
      setContinueBtn(true);
      // localStorage.clear();
    }
  };

  useEffect(() => { }, [mainCart]);
  return (
    <section className="card_page">
      <div className="container-fluid">
        <div className="card_page_top">
          <Link className="back-btn" to="/makeOrder">
            <span>
              <i
                style={{ paddingLeft: "1rem" }}
                className="fa-solid fa-angle-left"
              ></i>{" "}
              <b>BACK</b>
            </span>
          </Link>
          <ul>
            <li className="active">
              <Link to='/cart'>
                <span>1. ORDER SUMMARY</span>
                <i className="fa-light fa-cart-shopping"></i>
              </Link>
            </li>
            <li>
              <a href={shopifyUrl}>
                <span>2. DELIVERY AND PAYMENT</span>
                <i className="fa-light fa-truck"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <div className="left">
              <div className="table-responsive">
                <table>
                <thead role="rowgroup">
                    <tr className="text-left"  role="row">
                      <th role="columnheader" width={"5%"}>PRODUCT</th>
                      <th role="columnheader">DETAILS</th>
                      <th role="columnheader">QUANTITY</th>
                      <th role="columnheader" width={"15%"}>UNIT COST</th>
                      <th role="columnheader" width={"17%"}>TOTAL</th>
                      <th></th>
                    </tr>
                  </thead>
                  {spinner ? (
                    <Spinner />
                  ) : (
                    <tbody role="rowgroup">
                      {products.map((i) => {
                        return (
                          <tr key={i.node.id} className='text-center' role="row">
                           <td role="cell">
                              <img
                                src={
                                  i.node.merchandise.product.featuredImage?.url
                                }
                                alt='product_img'
                                style={{
                                  maxHeight: 200,
                                }}
                              />
                            </td>
                            <td className="text-left" role="cell">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    i.node.merchandise.product.descriptionHtml
                                      .replace(
                                        /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))/g,
                                        ""
                                      ),
                                }}
                              ></div>
                              <span
                                className="modify_link"
                                onClick={() => {
                                  // to get filename from the fileurl
                                  let originalUrl =
                                    i.node.merchandise.product.description;
                                  originalUrl = originalUrl.split("crop_");
                                  originalUrl = originalUrl.pop();
                                  originalUrl = originalUrl.substring(
                                    0,
                                    originalUrl.lastIndexOf(" ")
                                  );
                                  // console.log(originalUrl);
                                  let sessionStorageData =
                                    sessionStorage.getItem("photoapp-configs");
                                  sessionStorageData =
                                    JSON.parse(sessionStorageData);
                                  const allImagesData = sessionStorageData.data;
                                  let selectedImageData = allImagesData.filter(
                                    (i) => {
                                      return i.config.filename === originalUrl;
                                    }
                                  );
                                  const imageId = selectedImageData[0]._id;
                                  // sending imageuuid to makeOrder
                                  if (imageId) {
                                    history.push(
                                      `/makeOrder?id=${imageId}&productId=${i.node.merchandise.product.id}`
                                    );
                                  } else {
                                    return false;
                                  }
                                }}
                              >
                                START OVER
                              </span>
                            </td>
                            <td role="cell">
                              <div className="counter_input">
                                <button
                                  className="btn_minus"
                                  onClick={() =>
                                    handleDecrement(i.node.id, i.node.quantity)
                                  }
                                >
                                  <i className="fa-solid fa-minus"></i>
                                </button>
                                <input
                                  className="input_box"
                                  type="text"
                                  value={i.node.quantity}
                                  disabled="true"
                                />
                                <button
                                  onClick={() =>
                                    handleIncreament(i.node.id, i.node.quantity)
                                  }
                                  className="btn_plus"
                                >
                                  <i className="fa-solid fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td>
                              $
                              {Number(
                                i.node.merchandise.product.priceRange
                                  .maxVariantPrice.amount
                              ).toFixed(2)}
                            </td>
                            <td>
                              $
                              {Number(
                                i.node.merchandise.product.priceRange
                                  .maxVariantPrice.amount * i.node.quantity
                              ).toFixed(2)}
                            </td>
                            <td>
                              <Link to='#'
                                className="link"
                                onClick={() => {
                                  handleDelete(i.node.id, i.node.quantity);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-trash link"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                  />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                </table>
                {pleaseAddItems ? <PleaseAddItems /> : ""}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="right_card">
              <h4>ORDER SUMMARY</h4>
              {spinner ? (
                <Spinner />
              ) : (
                <div className="right_card_in">
                  <ul>
                    <li>
                      <span>SUB TOTAL:</span>
                      {"$" + Number(subtotal ? subtotal : 0).toFixed(2)}
                    </li>
                    <li>
                      <span>Tax calculated upon checkout</span>
                    </li>
                    <li className="last">
                      <span>TOTAL:</span>
                      {"$" + Number(subtotal ? subtotal : 0).toFixed(2)}
                    </li>
                  </ul>
                  <a href={shopifyUrl}>
                    <button
                      disabled={continueBtn}
                      className="btn btn-primary continue-btn"
                    >
                      CONTINUE
                    </button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Cart;
