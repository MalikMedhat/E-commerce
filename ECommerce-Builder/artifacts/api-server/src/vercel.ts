import app from "./app.js";

// Export the Express app as a Vercel serverless function handler.
// Vercel's @vercel/node builder expects a default export that is
// compatible with the (req, res) => void signature. Express apps
// satisfy this contract natively.
export default app;
