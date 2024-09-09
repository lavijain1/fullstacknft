const { auth, resolver, loaders } = require("@iden3/js-iden3-auth");
const getRawBody = require("raw-body");

// app.get("/api/sign-in", (req, res) => {
//     console.log('get Auth Request');
//     GetAuthRequest(req,res);
// });

// app.post("/api/callback", (req, res) => {
//     console.log('callback');
//     Callback(req,res);
// });

// GetQR returns auth request
const GetAuthRequest = async (req, res) => {
  // Audience is verifier id
  const hostUrl =
    "https://915a-2401-4900-1c3a-687a-44e-627c-cdbc-416c.ngrok-free.app";
  const sessionId = 1;
  const callbackURL = "/users/polygonid/callback";
  const audience =
    "did:polygonid:polygon:mumbai:2qDyy1kEo2AYcP3RT4XGea7BtxsY285szg6yP9SPrs";

  const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

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

  globalThis.globalAuthreq.set(sessionId, request);

  return res.status(200).set("Content-Type", "application/json").send(request);
};

const hasAuthorization = async (req, res, next) => {
  try {
    if (!globalThis.globalAuth) {
      throw new Error("You are not Authorized");
    } else {
      globalThis.globalAuth = false;
    }
    next();
  } catch (error) {
    res.status(404).json({
      status: "Fail",
      message: error.message,
    });
  }
};
// Callback verifies the proof after sign-in callbacks
const Callback = async (req, res) => {
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
  const authRequest = globalThis.globalAuthreq.get(sessionId);

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
    console.log(`HERE :- ${authRequest} , ${opts} `);

    const authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
    console.log(`AFTER:- ${authResponse} , ${tokenStr} `);
    globalThis.globalAuth = true;
    const userId = authResponse.from;
    return res
      .status(200)
      .set("Content-Type", "application/json")
      .send("user with ID: " + userId + " Succesfully authenticated");
  } catch (error) {
    console.log(` Error:- ${error}`);

    return res.status(500).send(error);
  }
};

module.exports = {
  GetAuthRequest,
  hasAuthorization,
  Callback,
};
