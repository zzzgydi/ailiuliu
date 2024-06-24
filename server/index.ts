import { Hono } from "hono";
import { cors } from "hono/cors";
import { poweredBy } from "hono/powered-by";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { models } from "./models";

const app = new Hono<{
  Bindings: {
    API_BASE: string;
    API_TOKEN: string;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  };
}>();

const modelSet = new Set(models.map((model) => model.value));

app.use(poweredBy());

app.use(
  "/api/*",
  cors({ origin: ["http://localhost:5173"], maxAge: 600, credentials: true })
);

app.use("/api/*", clerkMiddleware());

app.get("/api/models", async (c) => {
  return c.json(models);
});

app.all("/api/v1/*", async (c, next) => {
  const auth = getAuth(c);
  if (!auth) {
    return new Response("Unauthorized", { status: 401 });
  }

  const targetUrl = new URL(c.env.API_BASE);
  const url = new URL(c.req.raw.url);
  url.host = targetUrl.host;
  url.port = targetUrl.port;
  url.protocol = targetUrl.protocol;
  url.pathname = url.pathname.replace(/^\/api/, "");

  const customHeaders = {
    Authorization: `Bearer ${c.env.API_TOKEN}`,
  };

  const headers = new Headers();
  for (const [key, value] of Object.entries(c.req.header())) {
    if (key.startsWith("x-stainless-")) continue;
    if (key === "cookie") continue;
    headers.set(key, value);
  }

  for (const [key, value] of Object.entries(customHeaders)) {
    headers.set(key, value);
  }

  const data = await c.req.json();
  if (!data.model) {
    return new Response("Bad Request", { status: 400 });
  }
  if (!modelSet.has(data.model)) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await fetch(url.toString(), {
    method: c.req.method,
    headers,
    body: JSON.stringify(data),
  });

  return new Response(res.body, res);
});

export default app;
