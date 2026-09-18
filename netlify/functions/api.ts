import serverless from "serverless-http";

import { createServer } from "../../arc/backend/server";

export const handler = serverless(createServer());
