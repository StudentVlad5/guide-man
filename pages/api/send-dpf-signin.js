import DownloadPage from "../lawyersRequestsForm";

// let file=fs.readFileSync('../../public/documents/')
const encryptDoc = async (
  // name,
  // projectName,
  // recipient
) => {
  try {
    // Generate the contract PDF bytes
    const contractBytes = await DownloadPage(
//     name,
//   projectName,
// recipient
    );


    // Create a Blob from the PDF bytes
    const contractBlob = new Blob([contractBytes], {
      type: "application/pdf",
    });

    // Open the PDF in a new window
    const url = URL.createObjectURL(contractBlob);
    window.open(url, "_blank");


    // Convert the PDF Blob to a Base64 string
    const base64PDF = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(contractBlob);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });


    return base64PDF;
  } catch (error) {
    console.error("Error creating the PDF document:", error);
    throw new Error("Failed to create the PDF document");
  }
};


export const  handleDocuSign = async ( 
     name, 
     projectName, 
     recipient, 
     recipientEmail, 
     senderEmail, 
     senderName
   ) => { 
    try { 
      // Згенеруйте PDF і отримайте його як рядок Base64 
      const encodedPDF = await  encryptDoc ( 
   name, 
   projectName, 
   recipient, 
      ); 


      // Ініціалізація функцій Firebase 
      const functions = getFunctions (myApp, "us-central1" ); 


      // Визначте, як надсилати його в DocuSign. Включіть атрибути, наприклад, кому ви хочете надіслати документ і хто надсилає документ 
      const sendDocuSignEnvelope = httpsCallable ( 
        functions, 
        "sendDocuSignEnvelope"
       ); 


      letpassedData = { 
        encodedPDF : encodedPDF, 
        email : recipientEmail, 
        name : name, 
        accountId : process. env . NEXT_PUBLIC_DOCUSIGN_ACCOUNT_ID , 
        senderEmail : senderEmail, 
        senderName : senderName, 
      }; 
      const response = await  sendDocuSignEnvelope ({ 
        ...passedData, 
      }); 


    } catch (помилка) { 
      console.error ( "Помилка надсилання документа в DocuSign:" , помилка); 
      // Відповідна обробка помилки
     } 
  };