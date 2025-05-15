import { Request, Response } from "express";
import {
  generateSession,
  getHoldingsAndPositions,
  getLoginURL,
  setAccessToken,
  isAuthenticated,
  logoutSession,
  getProfile,
} from "../services/kite.service";

interface Holding {
  symbol: string;
  exchange: string;
  quantity: number;
  averagePrice: number;
  lastPrice: number;
  pnl: number;
  pnlPercentage: number;
}

interface PortfolioData {
  totalInvestment: number;
  currentValue: number;
  todayPnL: number;
  holdings: Holding[];
  overallPnLPercentage?: number;
  overallPnL?: number;
}

export const home = async (req: Request, res: Response): Promise<any> => {
  if (!isAuthenticated()) {
    return res.send(`<a href="${getLoginURL()}">Login to Zerodha</a>`);
  }
  await logoutSession();
  return res.status(200).json({ message: "Already authenticaled" });
};

export const handleCallback = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { request_token } = req.query;
  if (!request_token || typeof request_token !== "string") {
    return res.status(400).send("Missing request_token");
  }

  try {
    const userAccessData = await generateSession(request_token);
    return res.status(200).json({ body: userAccessData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating session");
  }
};

export const getPortfolio = async (
  _req: Request,
  res: Response
): Promise<any> => {
  if (!isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { holdings, positions } = await getHoldingsAndPositions();

    // Transform holdings data to match frontend expectations
    const transformedHoldings = holdings.map((holding) => ({
      symbol: holding.tradingsymbol,
      exchange: holding.exchange,
      quantity: holding.quantity,
      averagePrice: holding.average_price,
      lastPrice: holding.last_price,
      pnl: (holding.last_price - holding.average_price) * holding.quantity,
      pnlPercentage:
        ((holding.last_price - holding.average_price) / holding.average_price) *
        100,
    }));

    let portfolioData: PortfolioData = {
      totalInvestment: holdings.reduce(
        (sum, h) => sum + h.average_price * h.quantity,
        0
      ),
      currentValue: holdings.reduce(
        (sum, h) => sum + h.last_price * h.quantity,
        0
      ),
      todayPnL: holdings.reduce((sum, h) => sum + h.day_change * h.quantity, 0),
      holdings: transformedHoldings,
    };

    const overallPnL =
      portfolioData.currentValue - portfolioData.totalInvestment;
    const overallPnLPercentage =
      (overallPnL / portfolioData.totalInvestment) * 100;

    portfolioData = { ...portfolioData, overallPnLPercentage, overallPnL };

    res.json(portfolioData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const { access_token } = req.query;
  if (!access_token || typeof access_token !== "string") {
    await logoutSession();
    return res.status(200).json({ message: "Access token invalidated" });
  }

  try {
    await logoutSession(access_token);
    return res.status(200).json({ message: "Access token invalidated" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating session");
  }
};

export const getProfileDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { access_token } = req.query;
  if (!isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const profile = await getProfile();
    return res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Failed to fetch profile"});
  }
};
