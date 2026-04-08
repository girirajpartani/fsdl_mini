const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


const authRoutes = require("./routes/authRoutes");
const communityRoutes = require("./routes/communityRoutes");
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("IdeaWired API Running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));