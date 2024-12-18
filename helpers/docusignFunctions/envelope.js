const functions = require("firebase-functions"); // v1
const getAccessTokenJWT = require("./getAccessToken.js");
const docusign = require("docusign-esign");


// send doc to docusign for signature
exports.sendDocuSignEnvelope = functions.https.onCall(async (data, context) => {
  try {
    // Step 1: Get the access token using JWT
    const accessToken = await getAccessTokenJWT(); // Implement JWT authentication in this function
    // Step 2: retrieve the pdf from the data object
    const encodedPDF = data.encodedPDF;
    const accountId = data.accountId;


    // Step 3: Create the document object for DocuSign
    const document = new docusign.Document();
    document.documentBase64 = encodedPDF;
    document.name = "Work Authorization";
    document.fileExtension = "pdf";
    document.documentId = "1";


    // Step 4: Create the signer and cc object
    const signer = new docusign.Signer();
    signer.email = data.email;
    signer.name = data.name;
    signer.recipientId = "1";
    signer.routingOrder = "1";


    const carbonCopy = new docusign.CarbonCopy();
    carbonCopy.email = data.ownerEmail;
    carbonCopy.name = data.ownerName;
    carbonCopy.recipientId = "2";
    carbonCopy.routingOrder = "2";


    // Step 5: Create SignHere tab (where the recipient should sign)
    const signHere = new docusign.SignHere({
      documentId: "1",
      pageNumber: "1",
      recipientId: "1",
      tabLabel: "SignHereTab",
      xPosition: "100",
      yPosition: "150",
    });


    // Step 6: Attach tabs to signer
    const tabs = new docusign.Tabs();
    tabs.signHereTabs = [signHere];
    signer.tabs = tabs;


    // Step 7: Create the envelope definition
    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject =
      "Congratulations! Please sign this document, and we can get started";
    envelopeDefinition.documents = [document];
    envelopeDefinition.recipients = {
      signers: [signer],
      carbonCopies: [carbonCopy],
    };
    envelopeDefinition.status = "sent"; // Set to "sent" to send immediately


    //step 8 get the base_uri
    const url = "https://account-d.docusign.com/oauth/userinfo";
    const uriResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });


    if (!uriResponse.ok) {
      throw new Error(`Failed to fetch base_uri: ${uriResponse.status} ${uriResponse.statusText}`);
    }


    const responseData = await uriResponse.json();
    const base_uri = responseData.accounts[0].base_uri;


    // Step 9: Send the envelope
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(`${base_uri}/restapi`);
    apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const results = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition: envelopeDefinition,
    });


    return { envelopeId: results.envelopeId };
  } catch (error) {
    console.error("Error sending envelope:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});


// add to firebase
// firebase functions:config:set docusign.integration_key="your_integration_key"
// firebase functions:config:set docusign.user_id="your_user_id"
// firebase functions:config:set docusign.private_key="your_private_key"