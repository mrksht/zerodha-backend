import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRoutes from "./routes/portfolio.routes";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://zerodha-dashboard-mu.vercel.app",
];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/", portfolioRoutes);

export default app;
