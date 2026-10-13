import { value } from "./rewrite_imports_dep.ts";
export { exported } from "./rewrite_imports_dep.ts";

const literal = "./rewrite_imports_dep.ts";
const dynamic = await import("./rewrite_imports_dep.ts");

console.log(value, dynamic.exported, literal);
