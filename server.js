import express from "express";
import bodyParser from "body-parser";
import {filterImageFromURL, deleteLocalFiles} from "./util/util.js";
import validUrl from "valid-url";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

/**************************************************************************** */

app.get("/filteredimage", async (req, res) => {
    try {
        const imageUrl = req.query.image_url;
        if (!imageUrl || !validUrl.isUri(imageUrl)) {
            res.status(422).send("Invalid image_url");
        } else {
            const path = await filterImageFromURL(imageUrl);
            res.status(200).sendFile(path);
            res.on("finish", () => deleteLocalFiles([path]));
        }
    } catch (exception) {
        res.status(500).send(exception);
    }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
});
