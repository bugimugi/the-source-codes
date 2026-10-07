/**
 * Builds the two web models of the "interactive 3D body" from the BodyParts3D 4.0 musculoskeletal pack (CC BY 4.0,
 * (c) The Database Center for Life Science): skeleton.glb (bones, discs, ligaments, tendons) and muscles.glb.
 * Steps: split by material colour, merge the regions, simplify, drop materials (the page sets its own), compress with meshopt.
 * Usage: node build.mjs <dir with the region glbs> <output dir>
 * Not part of the normal build: run it once in a scratch folder with `npm i @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer`
 * (all free software); the region glbs come from `npm pack @somakine/bodyparts3d-musculoskeletal@0.2.0`. The results are committed in public/assets/models/.
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { mergeDocuments, simplify, weld, prune, dedup, quantize, meshopt } from "@gltf-transform/functions";
import { MeshoptSimplifier, MeshoptEncoder } from "meshoptimizer";
import { readdirSync, mkdirSync, statSync } from "node:fs";
import { Document } from "@gltf-transform/core";

const [src, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
await MeshoptSimplifier.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder });

const kindOf = (mat) => { const c = mat.getBaseColorFactor(); return c[1] > 0.5 ? "bone" : c[0] > 0.8 && c[1] < 0.2 ? "muscle" : "soft"; };

async function build(name, want, ratio, error) {
  const target = new Document();
  target.createBuffer();
  const scene = target.createScene("body");
  const root = target.createNode("BodyParts3D").setRotation([-0.7071067811865475, 0, 0, 0.7071067811865476]).setScale([0.001, 0.001, 0.001]);
  scene.addChild(root);
  for (const f of readdirSync(src).sort()) {
    const doc = await io.read(src + "/" + f);
    for (const n of doc.getRoot().listNodes()) {
      const m = n.getMesh();
      if (!m) continue;
      const k = kindOf(m.listPrimitives()[0].getMaterial());
      if (!want.includes(k)) { n.dispose(); }
    }
    // unused meshes/accessors out
    await doc.transform(prune());
    const map = mergeDocuments(target, doc);
    for (const oldScene of doc.getRoot().listScenes()) {
      const s = map.get(oldScene);
      for (const rootNode of s.listChildren()) for (const c of rootNode.listChildren()) { rootNode.removeChild(c); root.addChild(c); }
      scene.removeChild; // the merged scene stays unused
      s.dispose();
    }
  }
  for (const n of target.getRoot().listNodes()) if (n !== root && !n.getMesh() && n.listChildren().length === 0 && !n.getParentNode()) n.dispose();
  // one buffer for the GLB
  const bufs = target.getRoot().listBuffers();
  for (const a of target.getRoot().listAccessors()) a.setBuffer(bufs[0]);
  for (const b of bufs.slice(1)) b.dispose();
  // strip materials; the page sets its own
  for (const m of target.getRoot().listMeshes()) for (const p of m.listPrimitives()) p.setMaterial(null);
  await target.transform(
    prune(),
    weld({ tolerance: 0.0001 }),
    simplify({ simplifier: MeshoptSimplifier, ratio, error, lockBorder: false }),
    dedup(),
    prune(),
    quantize({ quantizePosition: 14, quantizeNormal: 10 }),
    meshopt({ encoder: MeshoptEncoder, level: "high" }),
  );
  const file = out + "/" + name + ".glb";
  await io.write(file, target);
  let verts = 0, meshes = 0;
  for (const m of target.getRoot().listMeshes()) { meshes++; for (const p of m.listPrimitives()) verts += p.getAttribute("POSITION").getCount(); }
  console.log(name, "meshes", meshes, "verts", verts, "bytes", statSync(file).size);
}

await build("skeleton", ["bone", "soft"], 0.28, 0.02);
await build("muscles", ["muscle"], 0.2, 0.02);
