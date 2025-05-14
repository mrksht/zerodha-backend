import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import portfolioRoutes from "./routes/portfolio.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: "https://zerodha-dashboard-mu.vercel.app/", credentials: true }));
app.use(express.json());

app.use("/", portfolioRoutes);

export default app;
