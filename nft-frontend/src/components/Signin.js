import React, { useState, useRef, useEffect } from "react";
import "../styles/signin.css";
import checked from "../images/icons/checked.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateSignin } from "../store/authSlice";
import QRCode from "react-qr-code";
import bg from "../images/background.jpg";
import { io } from "socket.io-client";
import verified from "../images/icons/verified.png";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [emailRef, setEmail] = useState("");
  const [passRef, setPass] = useState("");
  const socket = io("http://localhost:5019/");
  const [errMsg, setErrMsg] = useState(false);
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrval, setqrval] = useState("");
  const [sessionId, setSessionId] = useState("lkmlkm");
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =
    useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);
  const [did, setdid] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setErrMsg("");
      setLoading(true);
      const instance = axios.create({
        baseURL: "http://localhost:5016/users/login",
        method: "POST",
        timeout: 1000,
      });

      let res = await instance.request({
        data: {
          email: emailRef,
          password: passRef,
          did: did,
        },
      });

      const currentUser = res.data;
      if (res.data.token) {
        window.localStorage.setItem("token", res.data.token);
      }
      let token = currentUser.token;
      let reqInstance = axios.create({
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      res = await reqInstance.get(
        `http://localhost:5016/users/find/${currentUser.id}`
      );
      dispatch(updateSignin(res.data));
      setUserSubmitted(true);
      socket.close();
    } catch (error) {
      setLoading(false);
      setErrMsg("email or password may be wrong");
    }
  }

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
            socket.close();
          } else {
            setVerfificationMessage("❌ Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);
  const TLD_REGEX = /\.(com|edu|gov|net|org)$/i;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/;
  const [validEmail, setValidEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState(false);
  const handleEmail = (email) => {
    setEmail(email);
    setEmail(email.toString());
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
  if (userSubmitted) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <div
        className="signin d-flex justify-content-center align-items-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* <div className={userSubmitted ? "submitted" : "not-submitted"}>
          <img className="check-img" src={checked} />
        </div> */}

        <div
          className="signin-form-container text-center"
          style={{ backgroundColor: "black", padding: "20px" }}
        >
          <h2 className="text-white font-style-bold">sign in</h2>
          <p></p>
          <form className="signin-form ">
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
            <div className="form-group text-white">
              <label htmlFor="InputPassword1">password:</label>
              <input
                type="password"
                required
                onChange={(e) => setPass(e.currentTarget.value)}
                autoComplete="on"
                className="form-control"
                id="InputPassword1"
              />
            </div>

            {!verificationCheckComplete ? (
              <div
                className="form-group text-center"
                style={{ backgroundColor: "" }}
              >
                <div
                  className="form-group justify-content-center align-items-center "
                  style={{}}
                >
                  <label>Use PolygonID wallet to prove you are above 18</label>

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
              </div>
            ) : (
              <img style={{ width: "100px" }} src={verified} />
            )}
            <p className={errMsg ? "text-danger" : "d-none"}>{errMsg}</p>
            <p
              className={
                !setVerificationCheckComplete ? "text-danger" : "d-none"
              }
            >
              {verificationMessage}
            </p>
            <button
              disabled={!verificationCheckComplete}
              onClick={(e) => {
                handleSubmit(e);
              }}
              className="btn signin-btn text-uppercase"
            >
              sign in
            </button>

            <p>
              don't have an account?{" "}
              <Link className="signup-link" to="/signup">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
