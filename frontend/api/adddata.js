const { google } = require("googleapis");

const WRITE_SPREADSHEET_ID = "1TVl-9GrX2OPq_NeHHAIs84Tr-36IuJ3y0ffkYztpJCg";

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sheetName, timestamp, name, id } = req.body || {};

    if (!sheetName || !timestamp || !name || !id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const auth = createGoogleAuth();
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheet = await googleSheets.spreadsheets.get({
      spreadsheetId: WRITE_SPREADSHEET_ID,
    });

    const findSheet = spreadsheet.data.sheets.find(
      (el) => el.properties.title === sheetName
    );

    if (!findSheet) {
      await googleSheets.spreadsheets.batchUpdate({
        spreadsheetId: WRITE_SPREADSHEET_ID,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      await googleSheets.spreadsheets.values.append({
        spreadsheetId: WRITE_SPREADSHEET_ID,
        range: sheetName,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            ["timestamp", "name", "id"],
            [timestamp, name, id],
          ],
        },
      });

      return res.status(200).json([
        ["timestamp", "name", "id"],
        [timestamp, name, id],
      ]);
    }

    await googleSheets.spreadsheets.values.append({
      spreadsheetId: WRITE_SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[timestamp, name, id]],
      },
    });

    return res.status(200).json([[timestamp, name, id]]);
  } catch (error) {
    console.error("POST /api/adddata error:", error);
    return res.status(500).json({ error: "Failed to add data." });
  }
};