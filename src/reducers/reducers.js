import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

const stateMap = {
  authReducer: {
    isAuthenticated: false,
  },
  terminalItemsReducer: {
    isInvalidated: false,
    isFetching: false,
    menuItems: [],
  },
  ticketTrackingReducer: {
    isInvalidated: false,
    isFetching: false,
  },
  salesReportReducer: {
    salesReport: {},
    reportLoaded: false,
  },
  employeeReducer: {
    loggedInUsers: ['Terminal'],
  },
  marketplaceItemsReducer: {
    marketplaceItems: [],
    currentMarketplaceItem: {},
  },
  shoppingCartReducer: {
    shoppingCart: {
      itemsBought: [],
    },
  },
  modalReducer: {
    modalType: null,
    modalProps: {},
  },
  wishlistReducer: {
    wishlist: [],
  },
  socialReducer: {
    followContacts: [],
  },
};

const authReducer = (state = stateMap.authReducer, action) => {
  switch (action.type) {
    case 'USER_AUTHENTICATED': {
      const { accountType, token } = action.userInfo;
      window.localStorage.setItem('x-auth-token', token);
      window.localStorage.setItem('x-account-type', accountType);
      return {
        ...state,
        isAuthenticated: true,
        instanceType: accountType,
        token,
        hasError: false,
      };
    }
    case 'INVALID_CREDENTIALS': {
      return {
        ...state,
        isAuthenticated: false,
        hasError: true,
        errorText: action.errorText,
      };
    }
    case 'LOG_OUT': {
      window.localStorage.removeItem('x-auth-token');
      window.localStorage.removeItem('x-account-type');
      return {
        ...state,
        isAuthenticated: false,
        hasError: false,
        errorText: null,
      };
    }
    default:
      return state;
  }
};

const modalReducer = (state = stateMap.modalReducer, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case 'HIDE_MODAL':
      return stateMap.modalReducer;
    default:
      return state;
  }
};

const terminalItemsReducer = (
  state = stateMap.terminalItemsReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_MENU_ITEMS':
      return {
        ...state,
        isInvalidated: false,
        isFetching: false,
        menuItems: action.categorizedMenuItems,
      };
    case 'SET_VISIBLE_CATEGORY':
      return { ...state, visibleCategory: action.visibleCategory };
    case 'FOCUS_MENU_ITEM':
      return { ...state, itemInFocus: action.menuItem };
    default:
      return state;
  }
};

const ticketTrackingReducer = (
  state = stateMap.ticketTrackingReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_TICKETS':
      return {
        ...state,
        isInvalidated: false,
        isFetching: false,
        tickets: action.categorizedTicketsByStatus,
      };
    case 'RECEIVE_CURRENT_TICKET':
      return { ...state, activeTicket: action.ticket };
    default:
      return state;
  }
};

const employeeReducer = (
  state = stateMap.employeeReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_LOGGED_USERS': {
      return {
        ...state,
        loggedInUsers: action.loggedUsers.loggedInUsers,
      };
    }
    case 'RECEIVE_ALL_EMPLOYEES': {
      return { ...state, employees: action.employees };
    }
    default:
      return state;
  }
};

const marketplaceItemsReducer = (
  state = stateMap.marketplaceItemsReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_MARKETPLACE_GOODS':
      return { ...state, marketplaceItems: action.items };
    case 'RECEIVE_CURRENT_ITEM':
      return { ...state, currentMarketplaceItem: action.item };
    default:
      return state;
  }
};

const shoppingCartReducer = (
  state = stateMap.shoppingCartReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_SHOPPING_CART':
      return { ...state, shoppingCart: action.shoppingCart };
    case 'INVALID_CART_ORDER':
      return {
        ...state,
        invalidatedItems: action.invalidatedItems,
        notifyUserOfCartInvalidation:
          action.notifyUserOfCartInvalidation,
      };
    case 'DISREGARD_INVALIDATION':
      return {
        ...state,
        invalidatedItems: action.invalidatedItems,
        notifyUserOfCartInvalidation:
          action.notifyUserOfCartInvalidation,
      };
    default:
      return state;
  }
};

const salesReportReducer = (
  state = stateMap.salesReportReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_SALES_REPORT':
      return {
        ...state,
        salesReport: action.salesReport,
        reportLoaded: true,
      };
    default:
      return state;
  }
};

const wishlistReducer = (
  state = stateMap.wishlistReducer,
  action,
) => {
  switch (action.type) {
    case 'RECEIVE_WISHLIST':
      return { ...state, wishlist: action.wishlist };
    default:
      return state;
  }
};

const socialReducer = (state = stateMap.socialReducer, action) => {
  switch (action.type) {
    case 'RECEIVE_FOLLOW_FEED':
      return { ...state, followContacts: action.followContacts };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  authReducer,
  modalReducer,
  terminalItemsReducer,
  ticketTrackingReducer,
  salesReportReducer,
  employeeReducer,
  marketplaceItemsReducer,
  shoppingCartReducer,
  routerReducer,
  wishlistReducer,
  socialReducer,
});

export default rootReducer;
