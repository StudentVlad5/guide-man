import * as docusign from "docusign-esign";

// Send Document for Signing
export const sendDocumentForSignature = async (
  fileUrl,
  signerEmail,
  signerName
) => {
  console.log(fileUrl, signerEmail, signerName);

  // DocuSign Configuration (from your DocuSign account)
  const clientId = process.env.NEXT_PUBLIC_SIGNUP_INTEGRATION;
  const clientSecret = process.env.NEXT_PUBLIC_SIGNUP_API_IDENIFICATOR;
  const redirectUri = process.env.NEXT_PUBLIC_SIGNUP_redirect_uri;
  const accountId = process.env.NEXT_PUBLIC_SIGNUP_USER_IDENIFICATOR;
  const REDIRECT_URI = "http://localhost:3000/signInPDF/callback";
  const AUTHORIZATION_URL = `https://account.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=${clientId}&redirect_uri=${REDIRECT_URI}`;

  let authCode;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    authCode = urlParams.get("code"); // Extract the authorization code
  }

  const getAccessToken = async (authCode) => {
    const response = await fetch(`${AUTHORIZATION_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data = await response.json();
    return data.access_token; // access token to use for making API calls
  };

  let accessToken;
  let envelopesApi;

  if (authCode) {
    accessToken = await getAccessToken(authCode);
  }

  // Initialize the DocuSign ApiClient
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath("https://demo.docusign.net/restapi");
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  // Authenticate the envelopes API
  envelopesApi = new docusign.EnvelopesApi(apiClient);

  console.log("accessToken", accessToken);
  console.log("envelopesApi", envelopesApi);

  // Create envelope
  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = "Please Sign the Document";

  // Create the document object
  const document = new docusign.Document();
  document.documentBase64 = fileUrl; // The document content (base64 encoded)
  document.name = "PDF Document"; // Name of the document
  document.fileExtension = "pdf"; // File type
  document.documentId = "1"; // The document ID for DocuSign

  envelopeDefinition.documents = [document];

  // Create the signer
  const signer = new docusign.Signer();
  signer.email = signerEmail;
  signer.name = signerName;
  signer.recipientId = "1";

  // Create the SignHere tab (signature area)
  const signHere = new docusign.SignHere();
  signHere.xPosition = "100";
  signHere.yPosition = "100";
  signHere.documentId = "1";
  signHere.pageNumber = "1";

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  // Add the signer to the envelope
  envelopeDefinition.recipients = new docusign.Recipients();
  envelopeDefinition.recipients.signers = [signer];

  // Send the envelope
  try {
    const results = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition: envelopeDefinition,
    });
    console.log("Envelope sent:", results);
    return results;
  } catch (error) {
    console.error("Error sending envelope:", error);
    throw error;
  }
};
