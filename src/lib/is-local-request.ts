const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0"]);

/**
 * True when the request was addressed to this machine. Reads the Host header,
 * not req.url: Next builds req.url from the server's own bind address, so it
 * says "localhost" even for real traffic.
 */
export function isLocalRequest(req: Request) {
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return LOCAL_HOSTNAMES.has(new URL(`http://${host}`).hostname);
  } catch {
    return false;
  }
}
