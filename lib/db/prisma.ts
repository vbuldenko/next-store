import { PrismaClient } from "../../generated/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { resultTransformer } from "./db-result-transformer";

// import ws from "ws";
// neonConfig.webSocketConstructor = ws; // couses issues in serverless environments!!!

// Only use WebSocket in Node.js environments, not in serverless
// if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
//   try {
//     import("ws").then((wsModule) => {
//       neonConfig.webSocketConstructor = wsModule.default;
//     });
//   } catch {
//     console.log("WebSocket not available, using fetch");
//   }
// }

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

// Type definitions
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

const prisma = new PrismaClient({ adapter }).$extends(resultTransformer);

// const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
