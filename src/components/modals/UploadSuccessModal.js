import React from 'react';
import { connect } from 'react-redux';

import Modal from 'react-modal';
import { modalStyle } from '../config';
import { hideModal } from '../../actions/modals';

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal()),
});

const mapStateToProps = (state) => {
  const { modalType, modalProps } = state.modalReducer;
  return { modalType, modalProps };
};

const UploadSuccessModal = (props) => (
  <div>
    <Modal
      isOpen={props.modalType === 'SHOW_ITEM_UPLOAD_SUCCESS_MODAL'}
      style={modalStyle}
      contentLabel="Example Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick
      onRequestClose={() => props.hideModal()}
    >
      <div>
        <h2> Item Uploade Success, logging props in console </h2>
        {console.log(props)}
      </div>
      <button
        className="btn-back-out"
        onClick={() => props.hideModal()}
      >
        {' '}
        Cancel
        {' '}
      </button>
    </Modal>
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadSuccessModal);
