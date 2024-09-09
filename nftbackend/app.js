const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const nftsRouter = require("./routes/nfts");
const userRouter = require("./routes/users");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const { Server } = require("socket.io");
const { auth, resolver, loaders } = require("@iden3/js-iden3-auth");
const getRawBody = require("raw-body");
const app = express();
var http = require("http").createServer(app);

app.use(
  cors({
    origin: "*",
  })
);
dotenv.config({ path: "./config.env" });

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from you, Please try again later",
});

app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(mongoSanitize());

app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "difficulty",
      "maxGroupSize",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
    ],
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/Api-starter-file/nft-data/img`));
app.use((req, res, next) => {
  next();
});
app.use(helmet());
app.use("/", limiter);

app.use("/nfts", nftsRouter);
app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Cant find ${req.originalUrl} on this server`);
  err.status = "Fail";
  err.statusCode = 404;
  next(err);
});

// Create a map to store the auth requests and their session IDs
let authorizer = false;
const requestMap = new Map();
//creating socket
const temp = http.listen(5019, function () {
  console.log(`listening on 5019`);
});
const io = new Server(temp, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const STATUS = {
  Loading: "Loading",
  error: "eroor",
  finish: "finish",
};
const socketMessage = (fn, status, data) => ({
  fn,
  status,
  data,
});

userRouter.get("/polygonid/verify", async (req, res) => {
  // Audience is verifier id

  const hostUrl =
    "https://c83c-2401-4900-598f-feaa-a1f-be0-b808-96f7.ngrok-free.app";
  let sessionId = req.query.sessionId;
  sessionId = sessionId.toString();
  const callbackURL = "/users/polygonid/callback";
  const audience =
    "did:polygonid:polygon:mumbai:2qDyy1kEo2AYcP3RT4XGea7BtxsY285szg6yP9SPrs";

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;
  io.sockets.emit(
    sessionId,
    socketMessage("getAuthQr", STATUS.Loading, sessionId)
  );
  // Generate request for basic authentication
  const request = auth.createAuthorizationRequest(
    "Requesting Age",
    audience,
    uri
  );

  request.id = "156asdf4a6s5f1as6";
  request.thid = "156asdf4a6s5f1as6";
  // Add request for a specific proof
  const proofRequest = {
    id: 1,
    circuitId: "credentialAtomicQuerySigV2",
    query: {
      allowedIssuers: ["*"],
      type: "KYCAgeCredential",
      context:
        "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
      credentialSubject: {
        birthday: {
          $lt: 20050101,
        },
      },
    },
  };
  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  // Store auth request in map associated with session ID

  requestMap.set(sessionId, request);
  io.sockets.emit(
    sessionId,
    socketMessage("getAuthQr", STATUS.finish, request)
  );
  return res.status(200).set("Content-Type", "application/json").send(request);
});

userRouter.post("/polygonid/callback", async (req, res) => {
  // Get session ID from request
  const sessionId = req.query.sessionId;

  // get JWZ token params from the post request
  const raw = await getRawBody(req);
  const tokenStr = raw.toString().trim();
  const ethURL =
    "https://polygon-mumbai.g.alchemy.com/v2/c9LZuxV-4hQtlbRwizI30xJ-JQBfsIkR";
  const contractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";
  const keyDIR = "./keys";

  const ethStateResolver = new resolver.EthStateResolver(
    ethURL,
    contractAddress
  );

  const resolvers = {
    ["polygon:mumbai"]: ethStateResolver,
  };

  // fetch authRequest from sessionID
  const authRequest = requestMap.get(sessionId.toString());
  io.sockets.emit(
    sessionId,
    socketMessage("handleVerification", STATUS.Loading, authRequest)
  );
  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(keyDIR);
  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");
  // const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");

  // EXECUTE VERIFICATION
  const verifier = new auth.Verifier(verificationKeyloader, sLoader, resolvers);

  try {
    const opts = {
      AcceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
    };

    const authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
    console.log(
      `AFTER:- ID:- ${authResponse.id},\n BODY:- ${authResponse.body},\nfrom:- ${authResponse.from}, \nto:- ${authResponse.to} ,\ntokenstr:- ${tokenStr} `
    );
    authorizer = true;
    const userId = authResponse.from;
    io.sockets.emit(
      sessionId,
      socketMessage("handleVerification", STATUS.finish, authResponse)
    );
    return res
      .status(200)
      .set("Content-Type", "application/json")
      .send("user with ID: " + userId + " Succesfully authenticated");
  } catch (error) {
    console.log(` Error:- ${error}`);

    return res.status(500).send(error);
  }
});
//GLOBAL ERROR

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
});
module.exports = app;
