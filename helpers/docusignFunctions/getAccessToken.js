const functions = require("firebase-functions");
const jwt = require("jsonwebtoken");


const getAccessTokenJWT = async () => {
  const createJWTToken = () => {
    const privateKey = functions.config().docusign.private_key;
    const jwtPayload = {
      iss: functions.config().docusign.integration_key, // Integration key
      sub: functions.config().docusign.user_id, // UserId (your DocuSign user ID)
      aud: "account-d.docusign.com", // Audience, always DocuSign's account server
      iat: Math.floor(Date.now() / 1000), // Issued at time
      exp: Math.floor(Date.now() / 1000) + 3600, // Expiry time (1 hour)
      scope: "signature", // Scope (signature + impersonation. Impersonation is implied by the JWT grant)
    };
    return jwt.sign(jwtPayload, privateKey, { algorithm: "RS256" });
  };


  const requestAccessToken = async () => {
    const jwtToken = createJWTToken();
    // get rid of the -d for production
    const response = await fetch("https://account-d.docusign.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      }).toString(),
    });


    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from DocuSign:", errorData);
      throw new Error("Failed to obtain access token");
    }


    const data = await response.json();
    return data.access_token;
  };


  try {
    const accessToken = await requestAccessToken();
    console.log("Access token:", accessToken);
    return accessToken;
  } catch (error) {
    throw new Error("Failed to obtain access token");
  }
};


module.exports = getAccessTokenJWT;