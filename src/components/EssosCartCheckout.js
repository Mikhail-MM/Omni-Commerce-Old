import React from 'react';
import { connect } from 'react-redux';

import ModalRoot from './ModalRoot';
import { validateCartAndProceedToPayment, pullItemFromCart } from '../actions/shopping-cart';

const mapStateToProps = (state) => {
  const { token, isAuthenticated } = state.authReducer;
  const { shoppingCart } = state.shoppingCartReducer;
  return { token, isAuthenticated, shoppingCart };
};

const mapDispatchToProps = (dispatch) => ({
  handleCheckout: (token) => dispatch(validateCartAndProceedToPayment(token)),
  removeItem: (token, subdocID) => dispatch(pullItemFromCart(token, subdocID)),
});

/*

	Note: Need to move Shipping/Billing Address out of account credentials and into a session-specific form

*/
const EssosCartCheckout = (props) => {
  const { shoppingCart, token } = props;

  const generateShoppingCartDropdownContent = () => shoppingCart.itemsBought.map((item) => (
    <div className="cart-item-container-row">
      <div className="cart-item-mini-image-container">
        <img alt="" className="cart-item-mini-image" src={item.imageURL} />
      </div>
      <div className="cart-item-descriptor-container">
        <div className="cart-item-name-container">
          {item.itemName}
        </div>
        <div className="cart-item-quant-container">
          {`Quantity Requested: ${item.numberRequested}`}
        </div>
        <div className="cart-item-price-container">
          {`Cost Per Unit: $${item.itemPrice}`}
        </div>
        <div className="removal" onClick={() => props.removeItem(token, item._id)}>
							Remove
        </div>
      </div>
    </div>
  ));
  const generateCartTable = () => shoppingCart.itemsBought.map((item) => (
    <tr>
      <td style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 75, height: 100 }}>
          <img alt="" className="cart-item-mini-image" src={item.imageURL} />
        </div>
        <div className="cart-item-name-container">
          {item.itemName}
        </div>
      </td>
      <td>
        {item.itemPrice}
        {' '}
x
        {item.numberRequested}
        {' '}
=
        {`$${item.itemPrice * item.numberRequested}`}
      </td>
      <td>
        <div className="removal" onClick={() => props.removeItem(token, item._id)}>
							Remove
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="cart-root">
      <div className="checkout-page-wrapper">
        <ModalRoot />
        <div className="cart-header-menu">
          <h6 style={{ width: 100, height: 100, textAlign: 'center' }}>
            {' '}
            {'< Back'}
            {' '}
          </h6>
          <div style={{ width: 100, height: 100 }}>
            <img alt="" src="/assets/TRANSLOGOthin.svg" />
          </div>
          <h6 style={{ width: 100, height: 100, textAlign: 'center' }}> Secure Checkout </h6>
        </div>
        <div className="header-container">
          <h1> Confirm Your Purchase </h1>
        </div>
        <table className="checkout-table">
          <thead>
            <th style={{ borderRight: 'none' }}> Item Name </th>
            <th style={{ borderRight: 'none', borderLeft: 'none' }}> Item Price </th>
            <th style={{ borderLeft: 'none' }}> Actions</th>
          </thead>
          <tbody>
            { shoppingCart && generateCartTable() }
          </tbody>
          <tfoot />
        </table>
        <div className="shopping-cart-dropdown-container" />

        <button onClick={() => props.handleCheckout(token)}> Confirm order </button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EssosCartCheckout);
