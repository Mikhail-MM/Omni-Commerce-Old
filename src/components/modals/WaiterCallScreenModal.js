import React from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

import { createNewTicket } from '../../actions/tickets-transactions';

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal()),
  createNewTicket: (token, employeeName) => dispatch(createNewTicket(token, employeeName)),
});

const mapStateToProps = (state) => {
  const { token } = state.authReducer;
  const { loggedInUsers } = state.employeeReducer;
  const { modalType, modalProps } = state.modalReducer;

  return {
    token,
    loggedInUsers,
    modalType,
    modalProps,
  };
};

const WaiterCallScreenMenu = (props) => {
  const { loggedInUsers } = props;
  console.log(loggedInUsers);
  const generateWaiterCallScreen = () => {
    if (loggedInUsers) {
      return loggedInUsers.map((employee) => (
        <button
          key={employee}
          onClick={() => {
            props.hideModal();
            props.createNewTicket(props.token, employee);
          }}
        >
          {employee}
        </button>
      ));
    }
  };

  return (
    <div>{props.loggedInUsers && generateWaiterCallScreen()}</div>
  );
};

const WaiterCallScreenModal = (props) => {
  const {
    token, loggedInUsers, createNewTicket, hideModal,
  } = props;
  return (
    <div>
      <Modal
        isOpen={props.modalType === 'SELECT_EMPLOYEE_OPENING_TICKET'}
        style={modalStyle}
        contentLabel="Employee Manifest"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick
        onRequestClose={() => props.hideModal()}
      >
        <WaiterCallScreenMenu
          token={token}
          loggedInUsers={loggedInUsers}
          createNewTicket={createNewTicket}
          hideModal={hideModal}
        />
        <button className="btn-back-out" onClick={() => hideModal()}>
          {' '}
          Cancel
          {' '}
        </button>
      </Modal>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaiterCallScreenModal);
