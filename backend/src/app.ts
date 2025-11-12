import express from "express";
import cors from "cors";
import userRouter from "./routes/user.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/users", userRouter);

export default app;
