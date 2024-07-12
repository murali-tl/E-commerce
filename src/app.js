// api/index.js
const express = require("express");
// const serverless = require("serverless-http");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
// Create an Express app
const app = express();
const PORT = 3001;

const cors = require('cors')
const myRoute = require('./routes/mainRoutes');


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
      origin: "*",
      methods: ["GET"],
    })
  );
app.use('/', myRoute);

app.get('/', async (req, res) => {
    // let colors = await color.findAll({});
    //     let sizes = await size.findAll({});
    //     let categories = await category.findAll({});
    //     console.log(colors, sizes, categories);
    console.info("/health api called at", new Date().toISOString());
    res.status(200).send("Welcome to health URL of Server");
});

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Export the handler for serverless functions
//module.exports.handler = serverless(app);


app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);