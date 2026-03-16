const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = 5000;

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

app.get("/getdata", async (req, res) => {
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const getData = await googleSheets.spreadsheets.values.get({
    spreadsheetId: "1hw9zsISMk-4sWAc7OZwmRQ2zmU4EjMwxDul34LVmHyU",
    range: "sheet 1",
    majorDimension: "ROWS",
  });
  const values = getData.data.values;
  const output = [];
  for (let i = 0; i < values.length; i++) {
    let row = {};
    row["email"] = values[i][0];
    row["name"] = values[i][1];
    row["ID"] = values[i][2];
    output.push(row);
  }
  res.json(output);
});

app.post("/adddata", async (req, res) => {
  const { sheetName, timestamp, name, id } = req.body;

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const getData = await googleSheets.spreadsheets.get({
    spreadsheetId: "1TVl-9GrX2OPq_NeHHAIs84Tr-36IuJ3y0ffkYztpJCg",
  });
  const findSheet = getData.data.sheets.find(
    (el) => el.properties.title === sheetName
  );
  if (findSheet) {
    const addData = await googleSheets.spreadsheets.values.append({
      spreadsheetId: "1TVl-9GrX2OPq_NeHHAIs84Tr-36IuJ3y0ffkYztpJCg",
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[timestamp, name, id]],
      },
    });
    res.json(addData.config.data.values);
  } else {
    const request = {
      spreadsheetId: "1TVl-9GrX2OPq_NeHHAIs84Tr-36IuJ3y0ffkYztpJCg",
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                // "sheetId": number,
                title: sheetName,
                // "index": number,
                // "sheetType": enum(SheetType),
                // "gridProperties": {
                //     object(GridProperties)
                // },
                // "hidden": boolean,
                // "tabColor": {
                //     object(Color)
                // },
                // "rightToLeft": boolean
              },
            },
          },
        ],
      },
    };
    googleSheets.spreadsheets
      .batchUpdate(request)
      .then(async () => {
        const addData = await googleSheets.spreadsheets.values.append({
          spreadsheetId: "1TVl-9GrX2OPq_NeHHAIs84Tr-36IuJ3y0ffkYztpJCg",
          range: sheetName,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [
              ["timestamp", "name", "id"],
              [timestamp, name, id],
            ],
          },
        });
        res.json(addData.config.data.values);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.get("/", (req, res) => {
  res.send("With google sheet");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
