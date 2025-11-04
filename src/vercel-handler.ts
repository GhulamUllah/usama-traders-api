// src/vercel-handler.ts
import app from "./app";
import serverless from "serverless-http";
import connectDB from "./database/connection";
import { logger } from "./utils/logger";

/**
 * IMPORTANT:
 * - Do NOT call app.listen() here.
 * - Export a handler that Vercel can call for each request.
 *
 * Connect DB lazily and reuse connection if possible.
 */

// Attempt to connect once (for cold start). In serverless environments,
// the function container may be reused between invocations — keep the connection cached in module scope.
let dbConnected = false;

const ensureDb = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (err) {
            logger.error("DB connection error in serverless handler", err);
            // rethrow so Vercel gets a proper failure
            throw err;
        }
    }
};

const handler = async (req: any, res: any) => {
    // ensure DB connection
    await ensureDb();
    return serverless(app)(req, res);
};

export { handler };
export default handler;
