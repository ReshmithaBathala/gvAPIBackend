// server.js

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;

// Multer middleware for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS middleware
app.use(cors());

// Route for handling image analysis
app.post("/api/vision", upload.single("image"), async (req, res) => {
  try {
    // Send the image data to Google Vision API for analysis
    const response = await axios.post(
      "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB0G6d_UhKn4XUO8jo2q3PkdfbVxYZJ8H0",
      {
        requests: [
          {
            image: {
              content: req.file.buffer.toString("base64"),
            },
            features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract tags from the Vision API response
    const apiTags = response.data.responses[0].labelAnnotations.map(
      (label) => label.description
    );

    // Send back the tags to the frontend
    res.json({ tags: apiTags });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Error analyzing image" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
