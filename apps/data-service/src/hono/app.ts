import { Hono } from "hono";

export const app = new Hono<{ Bindings: BaseEnv }>();

app.get("/", (c) => {
  return c.text("Hello World");
});
