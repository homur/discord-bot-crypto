require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

// Function to create the HMAC signature
function createSignature(queryString, secret) {
  return crypto.createHmac("sha256", secret).update(queryString).digest("hex");
}

async function getAccountInfo() {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;
  const signature = createSignature(
    queryString,
    process.env.BINANCE_API_SECRET
  );

  try {
    const response = await axios.get(
      `${process.env.BINANCE_API_URL}/api/v3/account`,
      {
        params: { timestamp, signature },
        headers: { "X-MBX-APIKEY": process.env.BINANCE_API_KEY },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = getAccountInfo;
