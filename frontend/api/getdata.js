const { google } = require("googleapis");

const READ_SPREADSHEET_ID = "1hw9zsISMk-4sWAc7OZwmRQ2zmU4EjMwxDul34LVmHyU";
const READ_RANGE = "sheet 1";

function createGoogleAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google service account environment variables.");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auth = createGoogleAuth();
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const getData = await googleSheets.spreadsheets.values.get({
      spreadsheetId: READ_SPREADSHEET_ID,
      range: READ_RANGE,
      majorDimension: "ROWS",
    });

    const values = getData.data.values || [];
    const output = [];

    for (let i = 0; i < values.length; i++) {
      const row = {};
      row.email = values[i][0] || "";
      row.name = values[i][1] || "";
      row.ID = values[i][2] || "";
      output.push(row);
    }

    return res.status(200).json(output);
  } catch (error) {
    console.error("GET /api/getdata error:", error);
    return res.status(500).json({ error: "Failed to fetch data." });
  }
};