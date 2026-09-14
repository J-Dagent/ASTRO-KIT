export function getPolarServer(value?: string): "sandbox" | "production" {
  return value === "production" ? "production" : "sandbox";
}
