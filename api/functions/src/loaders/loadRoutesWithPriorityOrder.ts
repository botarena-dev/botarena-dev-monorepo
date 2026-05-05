import { readdir } from "fs/promises";
import { join, basename } from "path";

const routesDirectory = join(process.cwd(), "src/routes");

export const loadRoutesWithPriorityOrder = async (router: any) => {
  // Read the files preffixed with router. in routes directory
  const files = await readdir(routesDirectory, { recursive: true })
    .then((files) => files)
    .catch((error) => {
      console.error("Error reading the routes directory:", error);
      return [];
    });
  const routeFiles = files.filter((file) => {
    const basenameOfFile = basename(file);

    return (
      basenameOfFile.startsWith("router.") &&
      (basenameOfFile.endsWith(".mjs") ||
        basenameOfFile.endsWith(".js") ||
        basenameOfFile.endsWith(".ts"))
    );
  });

  const routeFilesWithPriority = routeFiles.sort((a, b) => {
    const basenameA = basename(a);
    const basenameB = basename(b);

    // Order the files alphabetically by the value of string of their basenames
    return basenameA < basenameB ? -1 : 1;
  });

  console.debug("routeFilesWithPriority:", routeFilesWithPriority);

  // Find all the routes in the directory.
  for (const file of routeFilesWithPriority) {
    const importPath = join(routesDirectory, file);
    const singleRoute = await import(importPath).catch((error) =>
      console.error("Error loading the route file:", error),
    );

    // Check if the imported module default export is the instance of express router.
    if (!singleRoute.default || typeof singleRoute.default !== "function") {
      console.error(
        "The route file does not have a default export or it is not a function.",
      );
      continue;
    }

    router.use(singleRoute.default);
    console.debug("routes:", importPath);
  }
};
export default loadRoutesWithPriorityOrder;
