import next, { NextApiRequest, NextApiResponse } from "next";
import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";
import path from "path";

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req: IncomingMessage, res: ServerResponse) => {
      /* Parse request URL to get its pathname */
      const parsedUrl = url.parse(req.url || "", true);
      const { pathname } = parsedUrl;

      /* Serve the service worker as a static file */
      if (pathname === "/service-worker.js") {
        const filePath = path.join(__dirname, ".next", pathname);
        app.serveStatic(
          req as NextApiRequest,
          res as NextApiResponse,
          filePath
        );
      } else {
        handle(req, res, parsedUrl);
      }
    })
    .listen(port, () => {
      console.log(`Listening on PORT ${port}`);
    });
});
