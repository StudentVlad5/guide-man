import { NextApiRequest, NextApiResponse } from 'next';
import * as docusign from 'docusign-esign';

export default async function handler(req, res) {
  const { accessToken, fileBase64, signerEmail, signerName } = req.body;
  const accountId = process.env.NEXT_PUBLIC_SIGNUP_USER_IDENIFICATOR;

  if (!accessToken || !fileBase64 || !signerEmail || !signerName) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // Initialize the DocuSign API client
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath('https://demo.docusign.net/restapi');
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  // Create the envelope definition
  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = 'Please Sign the Document';

  // Create the document object
  const document = new docusign.Document();
  document.documentBase64 = fileBase64; // The document content in Base64
  document.name = 'PDF Document'; // Name of the document
  document.fileExtension = 'pdf'; // File type
  document.documentId = '1'; // Document ID for DocuSign

  envelopeDefinition.documents = [document];

  // Create the signer
  const signer = new docusign.Signer();
  signer.email = signerEmail;
  signer.name = signerName;
  signer.recipientId = '1';

  // Create the SignHere tab (signature area)
  const signHere = new docusign.SignHere();
  signHere.xPosition = '100';
  signHere.yPosition = '100';
  signHere.documentId = '1';
  signHere.pageNumber = '1';

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  // Add the signer to the envelope
  envelopeDefinition.recipients = new docusign.Recipients();
  envelopeDefinition.recipients.signers = [signer];

  try {
    const results = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition: envelopeDefinition,
    });
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error creating envelope', error);
    return res.status(500).json({ message: 'Failed to send document for signing' });
  }
}
