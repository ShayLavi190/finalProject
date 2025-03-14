const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./userRoutes");

const app = express();
const PORT = process.env.PORT || 5020;

app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});