import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

/**
 * Builds src/data/landdots.json: points of an evenly spread sphere (Fibonacci lattice) that lie on land, as [lat, lon] in
 * tenths of a degree. Source: Natural Earth (public domain) via the npm package world-atlas (ISC). The result is
 * committed; the two packages are only needed to run this script (npm run globe:data).
 */
type Ring = number[][];
const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land) as unknown as { features: { geometry: { type: string; coordinates: Ring[][] | Ring[][][] } }[] } | { geometry: { type: string; coordinates: unknown } };
const geoms: { type: string; coordinates: unknown }[] = "features" in land ? land.features.map((f) => f.geometry) : [land.geometry];
const polys: Ring[][] = geoms.flatMap((g) => (g.type === "Polygon" ? [g.coordinates as Ring[]] : (g.coordinates as Ring[][])));

function inRing(lon: number, lat: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// polygon = outer ring minus holes
const onLand = (lon: number, lat: number) => polys.some((p) => inRing(lon, lat, p[0]) && !p.slice(1).some((h) => inRing(lon, lat, h)));

const N = 16000, golden = Math.PI * (3 - Math.sqrt(5));
const dots: [number, number][] = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (2 * (i + 0.5)) / N;
  const lat = (Math.asin(y) * 180) / Math.PI;
  let lon = (((i * golden) / Math.PI) * 180) % 360;
  if (lon > 180) lon -= 360;
  if (onLand(lon, lat)) dots.push([Math.round(lat * 10), Math.round(lon * 10)]);
}
writeFileSync("src/data/landdots.json", JSON.stringify(dots));
console.log(`${dots.length} Landpunkte von ${N} geschrieben.`);
