import { Router } from "express";
import { handleCallback, getPortfolio, home, logout, getProfileDetails } from "../controllers/portfolio.controller";

const router = Router();

router.get("/", home);
router.get("/callback", handleCallback);
router.get("/portfolio", getPortfolio);
router.get("/logout", logout);
router.get("/profile", getProfileDetails);

export default router;
