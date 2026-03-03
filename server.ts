import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.resolve();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API to list games
  app.get("/api/games", (req, res) => {
    const gamesDir = path.join(__dirname, "data", "games");
    if (!fs.existsSync(gamesDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(gamesDir).filter(f => f.endsWith(".json"));
    const games = files.map(file => {
      const content = fs.readFileSync(path.join(gamesDir, file), "utf-8");
      return JSON.parse(content);
    });
    res.json(games);
  });

  // API to get a specific game's iframe content
  app.get("/api/games/:id/iframe", (req, res) => {
    const { id } = req.params;
    const iframePath = path.join(__dirname, "data", "games", `${id}.html`);
    if (fs.existsSync(iframePath)) {
      res.sendFile(iframePath);
    } else {
      res.status(404).send("Game iframe not found");
    }
  });

  // Simple Proxy for bypassing CORS/Filters
  // Usage: /proxy/http://example.com
  app.use("/proxy", (req, res, next) => {
    const targetUrl = req.url.slice(1); // Remove leading slash
    if (!targetUrl) return res.status(400).send("No URL provided");
    
    // Basic validation to ensure it's a URL
    try {
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).send("Invalid URL");
    }

    const proxy = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/proxy/${targetUrl}`]: "",
      },
      router: (req) => {
          // Extract target from the path
          const url = req.url?.slice(1);
          return url || targetUrl;
      },
      on: {
        proxyRes: (proxyRes) => {
          // Remove security headers that prevent iframing
          delete proxyRes.headers['content-security-policy'];
          delete proxyRes.headers['x-frame-options'];
        }
      }
    });
    
    // @ts-ignore
    return proxy(req, res, next);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
