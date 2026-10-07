/**
 * Drawings for the element profile pages (src/ui/elementProfile.ts): placeholders until the pictures exist, and computed diagrams
 * (molecule geometry, the Bohr model, the spectrum, rosettes). Nothing here is a photo or an AI picture.
 */

/** hero stand-in (900 x 500): a glass sphere with a glowing nucleus and orbits over dark rocks */
export function heroSvg(uid: string): string {
  const stars = Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 149) % 900}" cy="${(i * 53) % 330}" r="${0.6 + (i % 3) * 0.5}" fill="#fff" opacity="${0.2 + (i % 5) * 0.12}"/>`).join("");
  const bubbles = [[470, 80, 22], [760, 130, 30], [450, 360, 16], [690, 380, 20], [620, 60, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#9fd8ff" stroke-opacity=".5" stroke-width="1.4"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.18}" fill="#fff" opacity=".6"/>`).join("");
  return `<svg class="ep-hero-svg" viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="${uid}-bg" cx=".72" cy=".42" r=".75"><stop offset="0" stop-color="#1c2f5a"/><stop offset=".6" stop-color="#0a1226"/><stop offset="1" stop-color="#04070e"/></radialGradient>
      <radialGradient id="${uid}-sp" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#9fd8ff" stop-opacity=".55"/><stop offset=".6" stop-color="#2a6fb0" stop-opacity=".35"/><stop offset="1" stop-color="#0b2748" stop-opacity=".7"/></radialGradient>
      <radialGradient id="${uid}-nu" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#7fc4ff"/><stop offset="1" stop-color="#58a8ff" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="900" height="500" fill="url(#${uid}-bg)"/>${stars}
    <circle cx="560" cy="250" r="150" fill="url(#${uid}-sp)" stroke="#9fd8ff" stroke-opacity=".55" stroke-width="2"/>
    <circle cx="560" cy="250" r="56" fill="url(#${uid}-nu)"/>
    <g fill="none" stroke="#cfeaff" stroke-opacity=".7" stroke-width="1.4"><ellipse cx="560" cy="250" rx="128" ry="42" transform="rotate(-24 560 250)"/><ellipse cx="560" cy="250" rx="96" ry="29" transform="rotate(38 560 250)"/></g>
    <circle cx="656" cy="205" r="5" fill="#fff"/>${bubbles}
    <path d="M300 500 L360 430 L430 450 L500 400 L580 440 L660 410 L760 450 L840 420 L900 450 L900 500 Z" fill="#12141c"/><path d="M500 400 L540 430 L520 470 Z M760 450 L800 470 L770 500Z" fill="#fff" fill-opacity=".05"/></svg>`;
}

/** the Bohr picture of the atom (360 x 220): nucleus of one proton and `neutrons` neutrons, one electron on its orbit */
export function bohrSvg(uid: string, neutrons = 0): string {
  const parts: [number, number, string][] = [[180, 110, "#ff5a4a"]];
  if (neutrons >= 1) parts.push([192, 118, "#a9b4c2"]);
  if (neutrons >= 2) parts.push([172, 120, "#a9b4c2"]);
  return `<svg class="ep-bohr" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bohr-Modell: Kern mit einem Proton und ${neutrons} Neutronen, ein Elektron auf einer Bahn">
    <defs><radialGradient id="${uid}-g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7fc4ff" stop-opacity=".5"/><stop offset="1" stop-color="#58a8ff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="180" cy="110" r="100" fill="url(#${uid}-g)"/>
    <ellipse cx="180" cy="110" rx="120" ry="46" transform="rotate(-16 180 110)" fill="none" stroke="#cfeaff" stroke-opacity=".75" stroke-width="1.4"/>
    <ellipse cx="180" cy="110" rx="78" ry="32" transform="rotate(32 180 110)" fill="none" stroke="#cfeaff" stroke-opacity=".3" stroke-width="1"/>
    ${parts.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/><circle cx="${x - 4}" cy="${y - 4}" r="4" fill="#fff" opacity=".45"/>`).join("")}
    <circle cx="288" cy="82" r="9" fill="#cfeaff"/><circle cx="288" cy="82" r="16" fill="#7fc4ff" opacity=".25"/></svg>`;
}

/** the 3D view's still picture, used when WebGL is not available (300 x 300) */
export function sphereSvg(uid: string): string {
  return `<svg class="ep-sphere" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wasserstoffatom, schematische Zeichnung (die 3D-Ansicht braucht WebGL)">
    <defs><radialGradient id="${uid}-s" cx=".38" cy=".34" r=".8"><stop offset="0" stop-color="#cfeaff" stop-opacity=".6"/><stop offset=".55" stop-color="#2a6fb0" stop-opacity=".3"/><stop offset="1" stop-color="#0b2748" stop-opacity=".6"/></radialGradient>
    <radialGradient id="${uid}-n" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#7fc4ff"/><stop offset="1" stop-color="#58a8ff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="150" cy="150" r="124" fill="url(#${uid}-s)" stroke="#9fd8ff" stroke-opacity=".6" stroke-width="2"/><circle cx="150" cy="150" r="46" fill="url(#${uid}-n)"/>
    <ellipse cx="150" cy="150" rx="102" ry="34" transform="rotate(-24 150 150)" fill="none" stroke="#cfeaff" stroke-opacity=".8" stroke-width="1.5"/><circle cx="238" cy="118" r="6" fill="#fff"/></svg>`;
}

/** a spiral galaxy made of points (400 x 240): stand-in for "Vorkommen im Universum" */
export function galaxySvg(uid: string): string {
  const pts: string[] = [];
  for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 150; i++) {
    const t = i / 150, ang = arm * Math.PI + t * 5.2, r = 14 + t * 120;
    const jx = Math.sin(i * 12.9898 + arm) * 9 * (0.4 + t), jy = Math.sin(i * 78.233 + arm * 3) * 7 * (0.4 + t);
    const x = 200 + Math.cos(ang) * r * 1.35 + jx, y = 120 + Math.sin(ang) * r * 0.55 + jy;
    pts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + (i % 4) * 0.35).toFixed(2)}" fill="${arm ? "#ffb88a" : "#9fb4ff"}" opacity="${(0.85 - t * 0.5).toFixed(2)}"/>`);
  }
  const stars = Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 97) % 400}" cy="${(i * 41) % 240}" r="${0.5 + (i % 3) * 0.4}" fill="#fff" opacity="${0.2 + (i % 4) * 0.15}"/>`).join("");
  return `<svg class="ep-galaxy" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <defs><radialGradient id="${uid}-c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2d0"/><stop offset=".35" stop-color="#ffb070" stop-opacity=".6"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="240" fill="#05060f"/>${stars}<ellipse cx="200" cy="120" rx="150" ry="70" fill="#6a4bd0" opacity=".14"/>${pts.join("")}<ellipse cx="200" cy="120" rx="46" ry="24" fill="url(#${uid}-c)"/></svg>`;
}

/**
 * Small ball-and-stick pictures of molecules (120 x 100). Water uses its real bond angle of 104,5 degrees; the others are drawn
 * schematically from their known shape (tetrahedron, pyramid, two atoms). Colours follow the usual chemistry code.
 */
export function moleculeSvg(id: string, uid: string): string {
  const C: Record<string, [string, number]> = { H: ["#f4f4f4", 9], O: ["#e8402e", 15], C: ["#4a4f58", 14], N: ["#4a6df0", 14], Cl: ["#3fbf5a", 16] };
  type A = [string, number, number];
  let atoms: A[] = [], bonds: [number, number][] = [];
  if (id === "wasser") {
    const a = (104.5 / 2) * (Math.PI / 180), L = 36;
    atoms = [["O", 60, 34], ["H", 60 - L * Math.sin(a), 34 + L * Math.cos(a)], ["H", 60 + L * Math.sin(a), 34 + L * Math.cos(a)]]; bonds = [[0, 1], [0, 2]];
  } else if (id === "methan") {
    atoms = [["C", 60, 52], ["H", 60, 14], ["H", 26, 68], ["H", 94, 68], ["H", 64, 86]]; bonds = [[0, 1], [0, 2], [0, 3], [0, 4]];
  } else if (id === "ammoniak") {
    atoms = [["N", 60, 34], ["H", 28, 66], ["H", 60, 78], ["H", 92, 66]]; bonds = [[0, 1], [0, 2], [0, 3]];
  } else {
    atoms = [["Cl", 40, 50], ["H", 86, 50]]; bonds = [[0, 1]];
  }
  const order = atoms.map((a, i) => i).sort((i, j) => (id === "methan" || id === "ammoniak" ? atoms[i][2] - atoms[j][2] : 0));
  return `<svg class="ep-mol" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>${Object.entries(C).map(([k, [c]]) => `<radialGradient id="${uid}-${k}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".6"/></radialGradient>`).join("")}</defs>
    ${bonds.map(([i, j]) => `<line x1="${atoms[i][1].toFixed(1)}" y1="${atoms[i][2].toFixed(1)}" x2="${atoms[j][1].toFixed(1)}" y2="${atoms[j][2].toFixed(1)}" stroke="#c8d2de" stroke-width="4" stroke-linecap="round"/>`).join("")}
    ${order.map((i) => { const [k, x, y] = atoms[i]; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${C[k][1]}" fill="url(#${uid}-${k})"/>`; }).join("")}</svg>`;
}

/** rosettes r = |cos(k * theta)|: a picture of standing waves (200 x 200); an illustration, not a measurement */
export function rosetteSvg(uid: string): string {
  const path = (k: number) => Array.from({ length: 361 }, (_, i) => { const t = (i / 360) * Math.PI * 2, r = 88 * Math.abs(Math.cos(k * t / 2 + 0.0001)); return `${i ? "L" : "M"}${(100 + Math.cos(t) * r).toFixed(1)} ${(100 + Math.sin(t) * r).toFixed(1)}`; }).join("");
  const cols = ["#58D6E8", "#7fa8ff", "#c07bff", "#F0D18B", "#ffb35a"];
  return `<svg class="ep-rosette" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><radialGradient id="${uid}-g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7fc4ff" stop-opacity=".3"/><stop offset="1" stop-color="#7fc4ff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="100" cy="100" r="96" fill="url(#${uid}-g)" stroke="#9fd8ff" stroke-opacity=".35"/>
    ${[2, 3, 4, 5, 6].map((k, i) => `<path d="${path(k)}Z" fill="none" stroke="${cols[i]}" stroke-width="1" opacity=".75"/>`).join("")}</svg>`;
}

/** colour of a visible wavelength in nm (an approximation for drawing the spectrum) */
export function wavelengthColor(nm: number): string {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  else return "#c0504a";
  if (nm < 380) return "#b18cff";
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}
