const { ObjectId } = require("mongodb"); // ✅ Moved to top

module.exports = function (app, db) {
  const notesCollection = db.collection("notes");

  // GET /notes/:id - Get a single note
  app.get("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    const objId = isValidId(noteId);
    if (!objId) return res.status(400).json({ error: "Invalid note ID" });

    notesCollection
      .findOne({ _id: objId })
      .then((note) => {
        if (!note) return res.status(404).json({ error: "Note not found" });
        note._id = note._id.toString(); // ✅ Convert to string
        res.status(200).json(note);
      })
      .catch((err) => {
        console.error("Fetch by ID error:", err);
        res.status(500).json({ error: "Server error" });
      });
  });

  // PUT /notes/:id - Update a note
  app.put("/notes/:id", (req, res) => {
    const { title, body } = req.body;
    const noteId = req.params.id;
    const objId = isValidId(noteId);
    if (!objId) return res.status(400).json({ error: "Invalid note ID" });

    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    const updatedNote = {
      title,
      text: body,
      updatedAt: new Date(),
    };

    notesCollection
      .updateOne({ _id: objId }, { $set: updatedNote })
      .then((result) => {
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Note not found" });
        }
        res.status(200).json({
          _id: noteId,
          ...updatedNote,
          message: "Note updated successfully",
        });
      })
      .catch((err) => {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update note" });
      });
  });

  // DELETE /notes/:id - Delete a note
  app.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    const objId = isValidId(noteId);
    if (!objId) return res.status(400).json({ error: "Invalid note ID" });

    notesCollection
      .deleteOne({ _id: objId })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Note not found" });
        }
        res
          .status(200)
          .json({ message: "Note deleted successfully", _id: noteId });
      })
      .catch((err) => {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete note" });
      });
  });

  // GET /notes - Get all notes
  app.get("/notes", (req, res) => {
    notesCollection
      .find({})
      .toArray()
      .then((notes) => {
        // Convert all _id to strings
        const cleanNotes = notes.map((note) => {
          note._id = note._id.toString();
          return note;
        });
        res.status(200).json(cleanNotes);
      })
      .catch((err) => {
        console.error("Fetch all error:", err);
        res.status(500).json({ error: "Failed to fetch notes" });
      });
  });

  // POST /notes - Create a new note
  app.post("/notes", (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: 'Both "title" and "body" are required',
      });
    }

    const note = { title, text: body };

    notesCollection
      .insertOne(note)
      .then((result) => {
        res.status(201).json({
          _id: result.insertedId.toString(), // ✅ String ID
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

  // 🔁 Reusable helper
  function isValidId(id) {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
  }
};
