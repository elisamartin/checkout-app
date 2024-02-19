import React from "react";
import "./index.css";
import GooglePayButton from "@google-pay/button-react";
import { ClipLoader } from "react-spinners";
import { Navigate } from "react-router-dom";

const apiPublicKey = process.env.REACT_APP_API_PUBLIC_KEY;
const apiSecretKey = process.env.REACT_APP_API_SECRET_KEY;
const apiProcessingChannelId = process.env.REACT_APP_API_PROCESSING_CHANNEL_ID;
const apiGPMerchantId = process.env.REACT_APP_API_GOOGLE_PAY_MERCHANT_ID;
const apiGPMerchantName = process.env.REACT_APP_API_GOOGLE_PAY_MERCHANT_NAME;

class CheckoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "Jon",
      lastName: "Snow",
      email: "jonny@winterfell.nor",
      address: "Winterfell, 42",
      country: "Germany",
      currency: "USD",
      creditCardNumber: "4242424242424242",
      cvv: "222",
      expirationDate: "02/2025",
      loading: false,
      error: null,
      paymentMethod: "Credit Card",
      lastClickedMethod: "Credit Card",
      redirect: false,
      redirectURL: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handlePaymentMethodChange = (method) => {
    this.setState((prevState) => ({
      paymentMethod: method,
      lastClickedMethod: method,
    }));
  };

  handleRedirect = (url) => {
    this.setState({ redirect: true, redirectURL: url });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      address,
      currency,
      paymentMethod,
      creditCardNumber,
      cvv,
      expirationDate,
    } = this.state;
    try {
      this.setState({ loading: true });
      const currentURL = window.location.href;
      const requestBodyTemplates = {
        "Credit Card": {
          source: {
            type: "card",
            number: creditCardNumber,
            expiry_month: 12,
            expiry_year: 2025,
          },
          amount: 2499,
          currency: currency,
          reference: "ORD-5023-4E89",
        },
        "Google Pay": {
          firstName,
          lastName,
          email,
          address,
          paymentMethod: "google_pay",
        },
        Giropay: {
          source: {
            type: "giropay",
          },
          shipping: {
            address: {
              city: address,
              zip: "10101",
              country: "DE",
            },
          },
          description: "Mens black t-shirt L",
          amount: 2499,
          currency: "EUR",
          success_url: currentURL + "/success",
          failure_url: currentURL + "/failure",
        },
      };

      const requestBody = requestBodyTemplates[paymentMethod];
      const response = await fetch(
        "https://api.sandbox.checkout.com/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiSecretKey}`,
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("data  ", data);
          if (data.status === "Pending" && paymentMethod === "Giropay") {
            window.location.href = data._links.redirect.href;
            // Confirmation of a giropay payment is only communicated through webhooks. All payments are labeled as Pending until you receive a payment_captured webhook notification (response code 10000), indicating a successful transaction.
          } else if (
            data.response_summary === "Approved" &&
            paymentMethod === "Credit Card"
          ) {
            this.handleRedirect("/checkout/success");
          } else {
            this.handleRedirect("/checkout/failure");
          }
        });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      address,
      country,
      currency,
      creditCardNumber,
      cvv,
      expirationDate,
      loading,
      error,
      paymentMethod,
      lastClickedMethod,
      redirect,
      redirectURL,
    } = this.state;

    return (
      <div className="container">
        <h2>Checkout Page</h2>
        {redirect && <Navigate to={redirectURL} />}
        {error && <p className="error">Error: {error}</p>}
        <div className="payment-methods">
          <button
            className={
              paymentMethod === "Credit Card"
                ? "active last-clicked"
                : lastClickedMethod === "Credit Card"
                ? "last-clicked"
                : ""
            }
            onClick={() => this.handlePaymentMethodChange("Credit Card")}
          >
            Credit Card
          </button>
          <button
            className={
              paymentMethod === "Giropay"
                ? "active last-clicked"
                : lastClickedMethod === "Giropay"
                ? "last-clicked"
                : ""
            }
            onClick={() => this.handlePaymentMethodChange("Giropay")}
          >
            Giropay
          </button>
          <div className="gp">
            <GooglePayButton
              environment="TEST"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: [
                        "AMEX",
                        "DISCOVER",
                        "JCB",
                        "MASTERCARD",
                        "VISA",
                      ],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "checkoutltd",
                        gatewayMerchantId: apiPublicKey,
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: apiGPMerchantId,
                  merchantName: apiGPMerchantName,
                },
                transactionInfo: {
                  totalPriceStatus: "FINAL",
                  totalPriceLabel: "Total",
                  totalPrice: "24.99",
                  currencyCode: "EUR",
                  countryCode: "DE",
                },
              }}
              onLoadPaymentData={(paymentRequest) => {
                console.log("load payment data", paymentRequest);
              }}
              onPaymentAuthorized={() => ({
                transactionState: "SUCCESS",
              })}
              onClick={(event) => {
                console.log("click", event);
                event.preventDefault();
              }}
              onError={(reason) => {
                console.log("error - reason ", reason);
              }}
            />
          </div>
        </div>
        {loading ? (
          <div className="loader">
            <ClipLoader color="#36d7b7" />
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            <div>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                Country:
                <select
                  id="country"
                  name="country"
                  value={country}
                  onChange={this.handleInputChange}
                >
                  <option value="DE">Germany</option>
                  <option value="UK">UK</option>
                </select>
              </label>
              <label>
                Currency:
                <select
                  id="currency"
                  name="currency"
                  value={currency}
                  onChange={this.handleInputChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Credit Card Number:
                <input
                  type="text"
                  id="creditCardNumber"
                  name="creditCardNumber"
                  value={creditCardNumber}
                  onChange={this.handleInputChange}
                  required
                />
              </label>
            </div>
            <div className="ccdetails">
              <label>
                CVV:
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cvv}
                  onChange={this.handleInputChange}
                  required
                />
              </label>
              <label>
                Expiration Date:
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  value={expirationDate}
                  onChange={this.handleInputChange}
                  required
                />
              </label>
            </div>
            <button type="submit" disabled={loading}>
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }
}

export default CheckoutPage;
