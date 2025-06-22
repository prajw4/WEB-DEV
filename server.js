const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require("fs");

const path = require("path");

const PORT = 3000;

const FILES_DIR = path.join(__dirname, "files");

if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);

    fs.writeFileSync(
        path.join(FILES_DIR, "sample.txt"),
        "This is the sample text baby."
    );
    fs.writeFileSync(
        path.join(FILES_DIR, "fample.txt"),
        "This is a fample text darling"
    );
}

app.get("/files", function (req, res) {
    fs.readdir(FILES_DIR, function (err, files) {
        if (err) {
        return res
            .status(500)
            .json({ error: "unable to read the file directory" });
        }

        res.status(200).json(files);
    });
});

app.get("/file/:filename", function (req, res) {
    const filename = req.params.filename;
    const filepath = path.join(FILES_DIR, filename);

    fs.readFile(filepath, "utf8", function (err, data) {
        if (err) {
        if (err.code == "ENOENT") {
            return res.status(404).send("Files not found");
        }

        return res.status(500).send("Internal server error");
        }

        res.status(200).send(data);
    });
});

app.post("/upload", function (req, res) {
    console.log(req.body);
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).send("Filename and content are required");
    }

    const filePath = path.join(FILES_DIR, filename);

    fs.writeFile(filePath, content, (err) => {
        if (err) return res.status(500).send("Failed to write file");
        res.status(201).send("File uploaded successfully");
    });
});

app.delete("/files/:filename", function (req, res) {
    console.log("Trying to delete:", req.params.filename);

    const filepath = path.join(FILES_DIR, req.params.filename);
    console.log("Resolved file path:", filepath);

    fs.unlink(filepath, function (err) {
        if (err)
        return res.status(404).send("File not found or already has been deleted");
        res.status(200).send("File deleted successfully");
    });
});

//app.use(function (req, res) {
  //res.status(404).send("Not Found");
//});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


  