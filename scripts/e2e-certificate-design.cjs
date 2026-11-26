/* Müvəqqəti E2E skript: aktiv sertifikat proqramı yaradır. */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function readUri() {
  const file = path.join(process.cwd(), ".env.local");
  const content = fs.readFileSync(file, "utf8");
  const match = /^MONGODB_URI=(.+)$/m.exec(content);
  if (!match) throw new Error("MONGODB_URI tapılmadı");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

(async () => {
  await mongoose.connect(readUri());
  const programs = mongoose.connection.collection("certificateprograms");
  const certificates = mongoose.connection.collection("certificates");

  await programs.deleteMany({ id: "cert-e2e-design" });
  await certificates.deleteMany({ programId: "cert-e2e-design" });

  await programs.insertOne({
    id: "cert-e2e-design",
    slug: "e2e-dizayn-test",
    title: "Məqalə Saatları IV",
    date: "2026-11-20",
    guests: ["Ayan Əhmədova"],
    active: true,
    theme: "classic",
    frameColor: "#1D3B66",
    accentColor: "#2F5F9E",
    logoUrl: "",
    elements: [],
    ts: Date.now(),
    updatedAt: Date.now(),
  });

  const count = await programs.countDocuments({ id: "cert-e2e-design" });
  console.log("seeded:", count);
  await mongoose.disconnect();
})().catch(async (error) => {
  console.error("seed error:", error.message);
  process.exit(1);
});
