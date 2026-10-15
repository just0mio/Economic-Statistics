import assert from "node:assert/strict";

const address = process.argv[2] ?? process.env.PAGES_URL;
assert.ok(address, "Provide the deployed Pages URL.");
const url = new URL(address);
assert.equal(url.protocol, "https:");
if (!url.pathname.endsWith("/")) url.pathname += "/";

async function read(address) {
  let last;
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      const response = await fetch(address, {signal: AbortSignal.timeout(15000), cache: "no-store"});
      assert.equal(response.status, 200, `${address}: HTTP ${response.status}`);
      return response;
    } catch (error) {
      last = error;
      if (attempt < 11) await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  throw last;
}

const html = await (await read(url)).text();
assert.ok(html.includes("LESE152") && html.includes('id="root"'), "Published entry is not the study app.");
const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map((m)=>m[1]);
const styles = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"/g)].map((m)=>m[1]);
assert.ok(scripts.length && styles.length, "Published scripts and styles must exist.");
for(const path of [...scripts,...styles]) {
  const asset = new URL(path,url);
  assert.equal(asset.origin,url.origin);
  assert.ok(asset.pathname.startsWith(url.pathname), "Asset escapes the project website prefix.");
  const response = await read(asset);
  assert.ok((response.headers.get("content-type") ?? "").match(/javascript|css/));
}
const pdf = await read(new URL("materials/L6_Exam_Scope_Through_Normal.pdf",url));
assert.ok((pdf.headers.get("content-type") ?? "").includes("application/pdf"));
console.log("PASS live HTTPS website: app entry, JavaScript, CSS and Lecture6 PDF.");
