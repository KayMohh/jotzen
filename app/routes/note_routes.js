const { ObjectId } = require("mongodb");

module.exports = function (app, db) {
  const notesCollection = db.collection("notes");

  // GET /notes/:id - Get a single note
  app.get("/notes/:id", (req, res) => {
    /**
     * @swagger
     * /notes/{id}:
     *   get:
     *     summary: Get a single note by ID
     *     description: Returns a note by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The note ID
     *     responses:
     *       200:
     *         description: A single note
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                 title:
     *                   type: string
     *                 text:
     *                   type: string
     *       400:
     *         description: Invalid ID
     *       404:
     *         description: Note not found
     */
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
    /**
     * @swagger
     * /notes/{id}:
     *   put:
     *     summary: Update a note by ID
     *     description: Updates an existing note's title and body
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The note ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - body
     *             properties:
     *               title:
     *                 type: string
     *                 example: Updated Title
     *               body:
     *                 type: string
     *                 example: This is the updated content.
     *     responses:
     *       200:
     *         description: Note updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                 title:
     *                   type: string
     *                 text:
     *                   type: string
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid ID, or title and body are required
     *       404:
     *         description: Note not found
     *       500:
     *         description: Failed to update note
     */
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
  /**
   * @swagger
   * /notes/{id}:
   *   delete:
   *     summary: Delete a note by ID
   *     description: Removes a note from the database by its ID
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The note ID
   *     responses:
   *       200:
   *         description: Note deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 _id:
   *                   type: string
   *       400:
   *         description: Invalid note ID
   *       404:
   *         description: Note not found
   *       500:
   *         description: Failed to delete note
   */
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
    /**
     * @swagger
     * /notes:
     *   get:
     *     summary: Get all notes
     *     description: Returns a list of all notes stored in the database
     *     responses:
     *       200:
     *         description: A list of notes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   _id:
     *                     type: string
     *                     description: The auto-generated ID of the note
     *                   title:
     *                     type: string
     *                     description: The title of the note
     *                   text:
     *                     type: string
     *                     description: The body/content of the note
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *                     description: When the note was created (if you add this field later)
     *                   updatedAt:
     *                     type: string
     *                     format: date-time
     *                     description: When the note was last updated
     *       500:
     *         description: Failed to retrieve notes
     */
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
    /**
     * @swagger
     * /notes:
     *   post:
     *     summary: Create a new note
     *     description: Adds a new note to the database with a title and body
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - body
     *             properties:
     *               title:
     *                 type: string
     *                 example: My Important Note
     *                 description: The title of the note
     *               body:
     *                 type: string
     *                 example: This is the content of my note. It can be anything!
     *                 description: The main content of the note
     *     responses:
     *       201:
     *         description: Note created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                   description: The auto-generated ID of the new note
     *                 title:
     *                   type: string
     *                 text:
     *                   type: string
     *                 message:
     *                   type: string
     *                   example: Note created successfully
     *       400:
     *         description: Both 'title' and 'body' are required
     *       500:
     *         description: Failed to save note
     */
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
