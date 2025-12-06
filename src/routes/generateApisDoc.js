const fs = require("fs");
const path = require("path");
const { API_DOCS_FILE } = require("./../utils/constants");

// Folder containing all your route files
const ROUTES_DIR = __dirname;

// Helper: Pretty route title from file name
const formatTitle = (filename) =>
  filename
    .replace(".routes.js", "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Helper: Extract method + path from route layer
const extractRoutesFromRouter = (router, basePath = "") => {
  const routes = [];
  router.stack.forEach((layer) => {
    if (layer.route) {
      const routePath = basePath + layer.route.path;
      const methods = Object.keys(layer.route.methods).map((m) =>
        m.toUpperCase()
      );
      routes.push({
        methods,
        path: routePath,
      });
    } else if (layer.name === "router" && layer.handle.stack) {
      // Nested routers (e.g., router.use("/prefix", subRouter))
      let nestedPath = basePath;
      if (layer.regexp && layer.regexp.source) {
        nestedPath += layer.regexp.source
          .replace("^\\", "")
          .replace("\\/?(?=\\/|$)", "")
          .replace(/\\\//g, "/")
          .replace(/\$$/, "");
      }
      routes.push(...extractRoutesFromRouter(layer.handle, nestedPath));
    }
  });
  return routes;
};

// Main
if (require.main === module) {
  (async () => {
    let doc = `# API Documentation\n\nGenerated from Express routers in \`/routes\`\n\n`;
    let apiBase = "/api";

    const files = fs
      .readdirSync(ROUTES_DIR)
      .filter(
        (f) =>
          f.endsWith(".routes.js") && f.toLowerCase() !== "protected.routes.js"
      );

    for (const file of files) {
      const filePath = path.join(ROUTES_DIR, file);

      let router;
      try {
        router = require(filePath);
      } catch (err) {
        console.warn(`⚠️ Could not load router from ${file}:`, err.message);
        continue;
      }

      // If the exported router is not an Express router, skip
      if (!router || !router.stack) continue;

      const title = formatTitle(file);
      const info = `api base: ${apiBase}`;
      doc += `## ${title}\n`;
      if (title.toLowerCase() === "clientsites") {
        doc += `${info}/client-sites\n`;
      } else if (title.toLowerCase() === "ordertrackmasters") {
        doc += `${info}/order-tracks\n`;
      } else if (title.toLowerCase() === "ordertrackhistories") {
        doc += `${info}/order-track-histories\n`;
      } else {
        doc += `api base: ${apiBase}/${title.toLowerCase()}\n`;
      }
      const routes = extractRoutesFromRouter(router);
      if (routes.length === 0) {
        doc += `_(No routes found)_\n\n`;
        continue;
      }

      for (const route of routes) {
        for (const method of route.methods) {
          doc += `- \`${method}\` \`${route.path}\`\n`;
        }
      }
      doc += `\n`;
    }

    // // Get documented routes
    // const docs = getDocumentedRoutes();

    // // Optional: Transform docs into Markdown / JSON / OpenAPI etc.
    // doc += docs
    //   .map((route) => {
    //     return `### ${route.method.toUpperCase()} ${route.path}

    // - **Description:** ${route.description || "No description"}
    // - **Access:** ${route.access || "Not defined"}

    // `;
    //   })
    //   .join("\n");

    // Output to file
    fs.writeFileSync(API_DOCS_FILE, doc);

    console.log(`✅ API documentation generated at: ${API_DOCS_FILE}`);
    process.exit(0);
  })();
} else {
  // If required as a module, export a function (or do nothing)
  module.exports = { generateDocs: () => { /* ... */ } };
}
