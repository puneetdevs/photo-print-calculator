import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ImageUpload from "./components/ImageUpload";
import ImageEditor from "./components/ImageEditor";
import MainHeader from "./components/Utils/Header";
import "react-multi-carousel/lib/styles.css";
import Cart from "../src/components/cart";
import LargeFileUpload from "./components/LargeFileUpload";
import ImageUpload2 from "./components/ImageUpload2";

const App = () => {
  const hist = createBrowserHistory();
  const [showIcons, setShowIcons] = React.useState(false);
  const [checkoutPrice, setCheckoutPrice] = React.useState();
  const [checkoutUrl, setCheckoutUrl] = React.useState();
  const [cartQuantity, setcartQuantity] = React.useState(0);
  const [cartId, setCartId] = React.useState();
  const [toastermessage, setToastermessage] = React.useState(false);
  // if session exist 
  const [sessionExist, setSessionExist] = useState('');
  return (
    <>
      <div>
        <div>
          <Router history={hist}>
            <MainHeader
              showIcons={showIcons}
              setShowIcons={setShowIcons}
              checkoutPrice={checkoutPrice}
              checkoutUrl={checkoutUrl}
              cartQuantity={cartQuantity}
              setcartQuantity={setcartQuantity}
              toastermessage={toastermessage}
              setToastermessage={setToastermessage}
            />
            <Switch>
              <Route exact path="/">
                <ImageUpload2 setShowIcons={setShowIcons} setcartQuantity={setcartQuantity} />
              </Route>
              <Route path="/makeOrder">
                <ImageEditor
                  checkoutPrice={checkoutPrice}
                  setCheckoutPrice={setCheckoutPrice}
                  checkoutUrl={checkoutUrl}
                  setCheckoutUrl={setCheckoutUrl}
                  cartId={cartId}
                  setCartId={setCartId}
                  setcartQuantity={setcartQuantity}
                  cartQuantity={cartQuantity}
                  toastermessage={toastermessage}
                  setToastermessage={setToastermessage}
                  setShowIcons={setShowIcons}
                  sessionExist={sessionExist}
                  setSessionExist={setSessionExist}
                />
              </Route>
              <Route path="/cart">
                <Cart cartQuantity={cartQuantity} setcartQuantity={setcartQuantity} setShowIcons={setShowIcons} />
              </Route>
              { /*
              <Route path="/largeUpload">
                <ImageUpload setShowIcons={setShowIcons} setcartQuantity={setcartQuantity} />
                <ImageUpload2 setShowIcons={setShowIcons} setcartQuantity={setcartQuantity} />
              </Route>
              */ }
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
};
export default App;
