import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { readFile, writeFile } from "../utils/helper";
import { User } from "../types";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/authschema";

const router = Router();
const USERS_PATH = "src/data/users.json";


// Register Route
router.post("/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid registration data", errors: result.error.issues });
    }

    const { email, password } = result.data;

    const users = await readFile(USERS_PATH);
    const existingUser = users.find((u: User) => u.email === email);

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
    };

    users.push(newUser);
    await writeFile(USERS_PATH, users);

    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Login Route

router.post("/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid login data", errors: result.error.issues });
    }

    const { email, password } = result.data;

    const users = await readFile(USERS_PATH);
    const user = users.find((u: User) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Failed to log in" });
  }
});

export default router;