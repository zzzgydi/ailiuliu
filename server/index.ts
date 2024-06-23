import { Hono } from "hono";
import { cors } from "hono/cors";
import { poweredBy } from "hono/powered-by";

const app = new Hono<{
  Bindings: {
    API_BASE: string;
    API_TOKEN: string;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  };
}>();

app.use(poweredBy());

app.use(
  "/v1/*",
  cors({
    origin: ["http://localhost:5173"],
    maxAge: 600,
    credentials: true,
  })
);

app.all("/v1/*", async (c, next) => {
  const targetUrl = new URL(c.env.API_BASE);
  const url = new URL(c.req.raw.url);
  url.host = targetUrl.host;
  url.port = targetUrl.port;
  url.protocol = targetUrl.protocol;

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

  const res = await fetch(url.toString(), {
    method: c.req.method,
    headers,
    body: await c.req.blob(),
  });

  return new Response(res.body, res);
});

export default app;
