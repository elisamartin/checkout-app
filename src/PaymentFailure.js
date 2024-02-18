import React from 'react';

class PaymentFailure extends React.Component {
  render() {
    return (
      <div className="res-fail" >
        <h2>Payment Unsuccessful</h2>
        <p>Oops! Something went wrong with your payment.</p>
      </div>
    );
  }
}

export default PaymentFailure;
