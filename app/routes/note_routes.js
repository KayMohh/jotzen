module.exports = function (app, db) {
  app.post("/notes", (req, res) => {
    console.log("POST /notes received");
    console.log("Body:", req.body); // Debug: check what was sent

    const { title, body } = req.body;

    // Validate input
    if (!title || !body) {
      return res.status(400).json({
        error: "Both 'title' and 'body' are required",
      });
    }

    const note = { title, text: body }; // or use 'content', 'body' — be consistent

    // Use insertOne (modern MongoDB driver)
    db.collection("notes")
      .insertOne(note)
      .then((result) => {
        // Send back the inserted note with its new _id
        res.status(201).json({
          _id: result.insertedId,
          ...note,
          message: "Note created successfully",
        });
      })
      .catch((err) => {
        console.error("DB Insert Error:", err);
        res
          .status(500)
          .json({ error: "Failed to save note", details: err.message });
      });
  });
};
