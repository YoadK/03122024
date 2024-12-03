import express from "express";
import { getAllItems, getItemById, addItem, updateItem, deleteItem } from "./src/crud-operations";

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// File paths
const postsFile = "json_data_files/posts.json";
const usersFile = "json_data_files/users.json";

// Routes for Posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await getAllItems(postsFile);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/posts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const post = await getItemById(postsFile, id);
        if (!post) return res.status(404).send("Post not found");
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/posts", async (req, res) => {
    try {
        const newPost = await addItem(postsFile, req.body);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/posts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedPost = await updateItem(postsFile, id, req.body);
        if (!updatedPost) return res.status(404).send("Post not found");
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/posts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const success = await deleteItem(postsFile, id);
        if (!success) return res.status(404).send("Post not found");
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Routes for Users (similar to Posts)
app.get("/users", async (req, res) => {
    try {
        const users = await getAllItems(usersFile);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = await getItemById(usersFile, id);
        if (!user) return res.status(404).send("User not found");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/users", async (req, res) => {
    try {
        const newUser = await addItem(usersFile, req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updatedUser = await updateItem(usersFile, id, req.body);
        if (!updatedUser) return res.status(404).send("User not found");
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const success = await deleteItem(usersFile, id);
        if (!success) return res.status(404).send("User not found");
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
