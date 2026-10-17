
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173"
  ]
}));
app.use(express.json());

const users = [];

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

app.get("/api/health", (req, res) => {
  res.json({ message: "Pratiksha Shopping API is running" });
});

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required."
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      message: "Password must contain at least 6 characters."
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({
      message: "This email is already registered. Please log in."
    });
  }

  const user = {
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(String(password))
  };

  users.push(user);

  return res.status(201).json({
    message: "Registration successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required."
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(String(password))) {
    return res.status(401).json({
      message: "Incorrect email or password."
    });
  }

  return res.json({
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.post("/api/logout", (req, res) => {
  res.json({ message: "Logged out successfully." });
});

app.listen(PORT, () => {
  console.log(`Pratiksha Shopping API running at http://localhost:${PORT}`);
});
