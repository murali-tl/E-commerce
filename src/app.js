const express = require("express");

const app = express();
const PORT = 3000;
const cors = require('cors')
const myRoute = require('./routes/mainRoutes');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
      origin: "*",
      methods: ["GET"],
    })
  );
app.use('/', myRoute);

app.get('/health', async (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);