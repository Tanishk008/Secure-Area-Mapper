# Secure Area Mapper

An intuitive web-based application to draw, save, and export secured map zones. Ideal for use cases in smart city planning, geo-fencing, campus security, and more. Powered with blockchain-based data integrity.

---

## Features 

- Interactive map canvas to define secured zones.   
- Freehand drawing with customizable color, stroke width.  
- Save map drawings as JSON.  
- Export map snapshots to PDF.  
- Optional blockchain-backed data logging for tamper-proof security.  
- Intuitive UI, no login required. 

---

## Live Demo

> [Click here to see it live](https://drive.google.com/file/d/177OLfSI2oGJ0DxifLMMlkJx8EnXZ3VqV/view?usp=sharing)

## Technologies Used

- HTML5  
- CSS  
- JavaScript  
- [jsPDF](https://github.com/parallax/jsPDF) (for PDF export)  
- Blockchain (for secure data logging - e.g., using dummy hash or future smart contract)

---

## How Blockchain is Used

Although this is a front-end application, we simulate blockchain functionality by:  
- Generating a hash of map data using SHA-256  
- Storing the hash or simulated transaction ID in local storage or a mock server  
- Enabling future integration with smart contracts to store zone metadata on-chain

---

## Project Structure
secure-area-mapper/ │ ├── index.html # Main web page ├── style.css # Custom styles ├── script.js # JavaScript logic ├── assets/├── logo/└── README.md # You are here!


---

## Getting Started

Use Cases : 
- Campus boundary mapping
- Geo-fencing logistics zones
- Protected environmental zones
- Blockchain-secured land/property tagging

Challenges Faced :
- Managing dynamic canvas drawing with JavaScript
- Implementing accurate export to PDF
- Mocking blockchain functionality in a frontend-only app

  Future Improvements
- Real-time sync with a blockchain backend (e.g., Ethereum/Polygon smart contracts)
- User authentication and map sharing
- Uploading saved maps to IPFS for decentralization

  Authors 
- Tanishk Gupta ([GitHub Profile](https://github.com/Tanishk008))
- Prerna Kashyap ([GitHub Profile](https://github.com/Prerna1313))
- Raamanjal Singh Gangwar ([GitHub Profile](https://github.com/Raamanjal))
- Suryank Batham ([GitHub Profile](https://github.com/SuryankB))

  License : 
This project is licensed under the MIT License.

Show Your Support : 
If you like this project, star it and share it. Contributions are welcome.
  








