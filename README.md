# ISURUX GAMING TOPUP STORE

This starter is prepared for:
UID -> package -> eZ Cash payment verification -> Shell Topup order.

## Setup
1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Put your Shell reseller API key in `SHELL_API_KEY`.
4. Run `npm install`.
5. Run `npm start`.
6. Open http://localhost:3000

## Important
- Never put the Shell API key in browser JavaScript.
- The `/api/order` endpoint deliberately requires a server-verified payment ID.
- The screenshots provided show `/api/v1/order`, `/api/v1/games`, and `/api/v1/balance`, but do not show a separate player/nickname verification endpoint. Do not use the order endpoint just to "verify" a UID because it can spend wallet balance.
- The eZ Cash part must be connected using the official merchant/payment-gateway API credentials and callback/webhook verification.
