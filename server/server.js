const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const generateRoutes = require("./routes/generate");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", generateRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

