import { getStore } from "@netlify/blobs";

const store = () => getStore({ name: "firmencheck-reviews", region: "eu-central-1" });

function clean(value, max = 1500) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, max);
}

export default async (req) => {
  const reviews = store();

  if (req.method === "GET") {
    const listing = await reviews.list({ prefix: "reviews/" });
    const items = await Promise.all(
      listing.blobs.slice(-250).map(async ({ key }) => {
        try {
          return await reviews.get(key, { type: "json", consistency: "strong" });
        } catch {
          return null;
        }
      })
    );
    return Response.json(
      { reviews: items.filter(Boolean).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) },
      { headers: { "cache-control": "no-store" } }
    );
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); }
    catch { return Response.json({ error: "Ungültige Daten." }, { status: 400 }); }

    const firma = clean(body.firma, 120);
    const ort = clean(body.ort, 100);
    const beruf = clean(body.beruf, 120);
    const art = body.bewertungsart === "Ausbildung" ? "Ausbildung" : "Praktikum";

    if (!firma || !ort || !beruf || body.bestaetigung !== true) {
      return Response.json({ error: "Bitte Firma, Ort, Beruf und Bestätigung ausfüllen." }, { status: 400 });
    }

    const data = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "unverified",
      firma, ort, beruf, bewertungsart: art,
      zeitraum: clean(body.zeitraum, 80),
      erfahrungsbericht: clean(body.erfahrungsbericht, 2500),
    };

    const prefix = art === "Ausbildung" ? "a_q" : "p_q";
    for (let i=1; i<=12; i++) {
      data[`${prefix}${i}`] = clean(body[`${prefix}${i}`], 120);
      data[`${prefix}${i}_kommentar`] = clean(body[`${prefix}${i}_kommentar`], 800);
    }

    const key = `reviews/${Date.now()}-${data.id}.json`;
    await reviews.setJSON(key, data, { onlyIfNew: true });
    return Response.json({ ok: true, review: data }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/reviews"
};
