import React, { useState, useEffect } from "react";
// import { auth } from "./firebase";

import "../styles/signup.css";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import checked from "../images/icons/checked.png";
import QRCode from "react-qr-code";
import bg from "../images/background.jpg";
// import { useAuth } from "../contexts/AuthContext";
import { io } from "socket.io-client";
import verified from "../images/icons/verified.png";

import axios from "axios";
import { useSelector } from "react-redux";

const USER_REGEX = /^(?:[a-zA-Z]{3,})(?:[a-zA-Z\s]+)?$/;
const TLD_REGEX = /\.(com|edu|gov|net|org)$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
const PASS_REGEX = /^([/s\S]){8,24}$/;

function Signup() {
  const { isSignin } = useSelector((state) => state.auth);
  const socket = io("http://localhost:5019/");
  useEffect(() => {
    if (isSignin) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    window.scrollTo(0, 0);
  }, []);
  // FIREBASE CODE
  //   const { signup, SignInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [userMsg, setUserMsg] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState(false);

  const [pass, setPass] = useState("");
  const [validPass, setValidPass] = useState(false);
  const [passMsg, setPassMsg] = useState(false);

  const [matchPass, setMatchPass] = useState("");
  const [validMatchPass, setValidMatchPass] = useState(false);
  const [matchPassMsg, setMatchPassMsg] = useState(false);

  const [checkbox, setCheckbox] = useState(false);
  const [checkboxMsg, setCheckboxMsg] = useState(false);
  const [did, setdid] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState("lkmlkm");
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =
    useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);
  async function handleSubmit() {
    try {
      setError("");
      setLoading(true);
      const instance = axios.create({
        baseURL: "http://localhost:5016/users/signup",
        method: "POST",
        timeout: 1000,
      });

      let res = await instance.request({
        data: {
          name: username,
          email: email,
          password: pass,
          passwordConfirm: matchPass,
          role: "user",
          did: did,
        },
      });

      const currentUser = res.data.json;
      //   await signup(username, email, pass);
      setUserSubmitted(true);
    } catch {
      setLoading(false);
      setError("Failed to Create an acccount");
    }
  }

  const handleUsername = (username) => {
    setUsername(username);
    if (USER_REGEX.test(username)) {
      setUserMsg("Valid");
      setValidUsername(true);
    } else {
      setUserMsg("at least 3 english letters");
      setValidUsername(false);
    }
  };

  const handleEmail = (email) => {
    setEmail(email);
    // If it match the regex
    if (EMAIL_REGEX.test(email) && TLD_REGEX.test(email)) {
      setEmailMsg("Valid");
      setValidEmail(true);
    } else {
      setValidEmail(false);
      setEmailMsg(
        "not a valid e-mail, should be in this form example@example.com"
      );
    }
  };

  const handlePass = (pass) => {
    setPass(pass);
    if (PASS_REGEX.test(pass)) {
      setValidPass(true);
      setPassMsg("valid");
      if (matchPass === pass) {
        setValidMatchPass(true);
        setMatchPassMsg("Matches");
      } else {
        setMatchPassMsg("password doesn't match");
        setValidMatchPass(false);
      }
    } else {
      setValidPass(false);
      setPassMsg("password must have 8 characters at least ");
    }
  };
  const [qrval, setqrval] = useState("");

  const handleMatchPass = (matchPass) => {
    setMatchPass(matchPass);
    if (pass) {
      if (matchPass === pass) {
        setValidMatchPass(true);
        setMatchPassMsg("Matches");
      } else {
        setMatchPassMsg("password doesn't match");
        setValidMatchPass(false);
      }
    } else {
      setMatchPassMsg("password doesn't match");
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const checkUser = (e) => {
    e.preventDefault();
    if (validUsername && validEmail && validMatchPass && checkbox) {
      handleSubmit();
    } else {
      handleUsername(username);
      handleEmail(email);
      handlePass(pass);
      handleMatchPass(matchPass);
      handleCheckboxMsg();
      setErrMsg(true);
    }
  };

  const handleCheckbox = () => {
    if (checkbox) {
      setCheckbox(false);
    } else {
      setCheckbox(true);
    }
  };

  const handleCheckboxMsg = () => {
    if (checkbox) {
      setCheckboxMsg(false);
    } else {
      setCheckboxMsg("check the box to continue");
    }
  };
  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);

      // only watch this session's events
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
  }, []);
  const getQrCodeApi = (sessionId) =>
    `http://localhost:5016/users/polygonid/verify?sessionId=${sessionId}`;

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      setqrval(data);
    };

    if (sessionId) {
      fetchQrCode().catch(console.error);
    }
  }, [sessionId]);
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "Loading") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "finish") {
            setVerfificationMessage("✅ Verified proof");
            // setTimeout(() => {
            //   reportVerificationResult(true);
            // }, "2000");
            setdid(currentSocketEvent.data.from.toString());
            console.log("got in frontend", currentSocketEvent.data.from);
            socket.close();
          } else {
            setVerfificationMessage("❌ Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);
  if (userSubmitted) {
    return <Navigate to="/" />;
  }
  return (
    <div
      className="signup d-flex justify-content-center align-items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className={userSubmitted ? "submitted" : "not-submitted"}>
        <img className="check-img" src={checked} />
      </div>
      <div
        className="signup-form-container"
        style={{ backgroundColor: "black", padding: "20px" }}
      >
        <h2 className="text-white">sign up</h2>
        <p></p>
        <form className="signup-form">
          <div className="form-group">
            <label htmlFor="username">name:</label>
            <input
              required
              onChange={(e) => {
                handleUsername(e.currentTarget.value.toLowerCase());
              }}
              type="text"
              autoComplete="off"
              className="form-control"
              id="username"
            />
            <small className={validUsername ? "text-success" : "text-danger"}>
              {userMsg ? userMsg : ""}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="InputEmail1">email address:</label>
            <input
              onChange={(e) => {
                handleEmail(e.currentTarget.value);
              }}
              type="email"
              required
              autoComplete="on"
              className="form-control"
              id="InputEmail1"
            />
            <small
              id="emailHelp"
              className={
                emailMsg
                  ? validEmail
                    ? "text-success"
                    : "text-danger"
                  : "d-none"
              }
            >
              {emailMsg ? emailMsg : ""}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword1">password:</label>
            <input
              type="password"
              onChange={(e) => {
                handlePass(e.currentTarget.value);
              }}
              required
              autoComplete="on"
              className="form-control"
              id="InputPassword1"
            />
            <small
              className={
                passMsg
                  ? validPass
                    ? "text-success"
                    : "text-danger"
                  : "d-none"
              }
            >
              {passMsg ? passMsg : ""}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="InputPassword2">confirm password:</label>
            <input
              type="password"
              onChange={(e) => {
                handleMatchPass(e.currentTarget.value);
              }}
              required
              autoComplete="on"
              className="form-control"
              id="InputPassword2"
            />
            <small
              className={
                matchPassMsg
                  ? validMatchPass
                    ? "text-success"
                    : "text-danger"
                  : "d-none"
              }
            >
              {matchPassMsg ? matchPassMsg : ""}
            </small>
          </div>
          {!verificationCheckComplete ? (
            <div
              className="form-group justify-content-center align-items-center "
              style={{ backgroundColor: "" }}
            >
              <label>Use PolygonID wallet to prove you are above 18+</label>

              <QRCode
                className="p-2"
                style={{
                  height: "80%",
                  width: "100%",
                  backgroundColor: "purple",
                }}
                value={qrval}
                viewBox={`0 0 256 256`}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <img style={{ width: "100px" }} src={verified} />
            </div>
          )}

          <div className="form-group form-check">
            <input
              onClick={() => handleCheckbox()}
              type="checkbox"
              required
              className="form-check-input"
              id="Check1"
            />
            <label className="form-check-label" htmlFor="Check1">
              i agree to the terms and conditions.
            </label>
          </div>
          <p
            className={setVerificationCheckComplete ? "text-danger" : "d-none"}
          >
            {verificationMessage}
          </p>
          <small
            className={
              checkboxMsg
                ? checkbox
                  ? "d-none"
                  : "text-danger d-block"
                : "d-none"
            }
          >
            {checkboxMsg ? checkboxMsg : ""}
          </small>
          <p className={errMsg ? "text-danger" : "d-none"}>
            please fill all fields with valid values
          </p>
          <button
            disabled={!verificationCheckComplete}
            type="submit"
            className="btn signup-btn text-uppercase"
            onClick={(e) => {
              checkUser(e);
            }}
          >
            Submit
          </button>
          <p>
            already have an account?{" "}
            <Link className="signin-link" to="/signin">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
