import React, { useState } from 'react';
import { connect } from 'react-redux';
import PremiumRequiredModal from './PremiumRequiredModal';

function PremiumFeature(props) {
  const [openModal, setOpenModal] = useState(false);
  const captured = event => {
    if (!props.isSubscribed) {
      event.stopPropagation();
      setOpenModal(true);
    }
  };

  console.log(props.children);
  return (
    <>
      <div onClickCapture={captured}>{props.children}</div>
      {openModal && (
        <PremiumRequiredModal
          onClose={() => {
            setOpenModal(false);
          }}
        />
      )}
    </>
  );
}

const mapStateToProps = state => ({
  isSubscribed: state.subscription.isSubscribed
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PremiumFeature);
