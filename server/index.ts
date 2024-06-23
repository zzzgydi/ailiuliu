import type { RequestHandler } from "@remix-run/cloudflare";
import { type AppLoadContext } from "@remix-run/cloudflare";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { staticAssets } from "remix-hono/cloudflare";
import { remix } from "remix-hono/handler";

const app = new Hono<{
  Bindings: {
    API_BASE: string;
    API_TOKEN: string;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
  };
}>();

let handler: RequestHandler | undefined;

app.use(poweredBy());

app.use("/v1/*", async (c, next) => {
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

app.use(
  async (c, next) => {
    if (process.env.NODE_ENV !== "development" || import.meta.env.PROD) {
      return staticAssets()(c, next);
    }
    await next();
  },
  async (c, next) => {
    if (process.env.NODE_ENV !== "development" || import.meta.env.PROD) {
      const serverBuild = await import("../build/server");
      return remix({
        build: serverBuild,
        mode: "production",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getLoadContext(c) {
          return {
            cloudflare: {
              env: c.env,
            },
          };
        },
      })(c, next);
    } else {
      if (!handler) {
        // @ts-expect-error it's not typed
        const build = await import("virtual:remix/server-build");
        const { createRequestHandler } = await import("@remix-run/cloudflare");
        handler = createRequestHandler(build, "development");
      }
      const remixContext = {
        cloudflare: {
          env: c.env,
        },
      } as unknown as AppLoadContext;
      return handler(c.req.raw, remixContext);
    }
  }
);

export default app;
