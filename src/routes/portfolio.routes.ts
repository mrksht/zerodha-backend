import { Router } from "express";
import { handleCallback, getPortfolio, home, logout } from "../controllers/portfolio.controller";

const router = Router();

router.get("/", home);
router.get("/callback", handleCallback);
router.get("/portfolio", getPortfolio);
router.get("/logout", logout);

export default router;
