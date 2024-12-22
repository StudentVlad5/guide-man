import { useState } from "react";

const SendDocumentForm = () => {
  const [file, setFile] = useState(null);
  const [signerEmail, setSignerEmail] = useState("");
  const [signerName, setSignerName] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result.split(",")[1]); // Save Base64 string
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("docusignAccessToken"); // Assume the token is saved in localStorage

    const response = await fetch("/api/docusign/sendDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        fileBase64: file,
        signerEmail,
        signerName,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Document sent for signing");
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Choose a PDF:</label>
        <input
          type="file"
          id="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
      </div>
      <div>
        <label htmlFor="signerEmail">Signer Email:</label>
        <input
          type="email"
          id="signerEmail"
          value={signerEmail}
          onChange={(e) => setSignerEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="signerName">Signer Name:</label>
        <input
          type="text"
          id="signerName"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send for Signature</button>
    </form>
  );
};

export default SendDocumentForm;
