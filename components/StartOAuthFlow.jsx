import React from "react";

const StartOAuthFlow = () => {
  const initiateOAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_SIGNUP_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SIGNUP_redirect_uri;
    const scope = "signature";
    const authUrl = `https://account.docusign.com/oauth/auth?response_type=code&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`;

    // Redirect the user to DocuSign's OAuth authorization URL
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Start OAuth Flow</h1>
      <button onClick={initiateOAuth}>Sign in with DocuSign</button>
    </div>
  );
};

export default StartOAuthFlow;
