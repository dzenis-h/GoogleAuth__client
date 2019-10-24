import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class GoogleAuth extends Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "797401886567-9cumct9mrt3v2va409rasa7fa6fq02hh.apps.googleusercontent.com", // This might be deleted
          // "Google Cloud -> New Project -> Credentials -> Web client -> ClientId",
          scope: "email"
        })
        .then(() => {
          // Creating an OAuth instance
          this.auth = window.gapi.auth2.getAuthInstance();
          // Getting the current value -> true || false
          this.onAuthChange(this.auth.isSignedIn.get());
          // Listining for changes to reflect the state in real-tme
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = isSignedIn => {
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      // Currently we don't know if the user is logged in
      return null;
    } else if (this.props.isSignedIn) {
      // If this ends up being true, user is logged in
      return (
        <button onClick={this.onSignOutClick} className="ui grey google button">
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      // Uswr is NOT loggged in
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(GoogleAuth);
