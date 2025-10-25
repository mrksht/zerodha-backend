import { KiteConnect } from "kiteconnect";
import dotenv from "dotenv";

dotenv.config();

const kite = new KiteConnect({ api_key: process.env.API_KEY! });

let accessToken: string | null = null;

export const getLoginURL = () => kite.getLoginURL();

export const isAuthenticated = () => accessToken !== null;

export const generateSession = async (requestToken: string) => {
  const session = await kite.generateSession(
    requestToken,
    process.env.API_SECRET!
  );
  accessToken = session.access_token;
  kite.setAccessToken(accessToken);
  return session;
};

export const setAccessToken = (token: string) => {
  accessToken = token;
  kite.setAccessToken(token);
};

export const getHoldingsAndPositions = async () => {
  const [holdings, positions] = await Promise.all([
    kite.getHoldings(),
    kite.getPositions(),
  ]);
  return { holdings, positions };
};

export const logoutSession = async (access_token?: string) => {
  accessToken = null;
  if (access_token) {
    kite.invalidateAccessToken(access_token);
  } else {
    kite.invalidateAccessToken();
  }
};

export const getProfile = async () => {
  const profile = await kite.getProfile();
  return profile;
};

export const placeOrder = async (
  variety: "amo" | "auction" | "co" | "iceberg" | "regular",
  tradingsymbol: string,
  quantity: number,
  exchange?: "NSE" | "BSE" | "NFO" | "CDS" | "BCD" | "BFO" | "MCX",
  product?: "NRML" | "MIS" | "CNC",
  order_type?: "LIMIT" | "MARKET" | "SL" | "SL-M"
) => {
  await kite.placeOrder(variety, {
    tradingsymbol,
    quantity,
    exchange: exchange ? exchange : "NSE",
    transaction_type: "BUY",
    product: product ? product : "CNC",
    order_type: order_type ? order_type : "MARKET",
  });
};

export const sellStock = async (
  variety: "amo" | "auction" | "co" | "iceberg" | "regular",
  tradingsymbol: string,
  quantity: number,
  exchange?: "NSE" | "BSE" | "NFO" | "CDS" | "BCD" | "BFO" | "MCX",
  product?: "NRML" | "MIS" | "CNC",
  order_type?: "LIMIT" | "MARKET" | "SL" | "SL-M"
) => {
  await kite.placeOrder(variety, {
    tradingsymbol,
    quantity,
    exchange: exchange ? exchange : "NSE",
    transaction_type: "SELL",
    product: product ? product : "CNC",
    order_type: order_type ? order_type : "MARKET",
  });
};
