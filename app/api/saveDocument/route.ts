import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const dataPath = path.join(process.cwd(), "data.json");

  try {
    const newData = await request.json();
    let existingData = [];

    // Mevcut JSON verilerini yükle
    if (fs.existsSync(dataPath)) {
      const fileData = fs.readFileSync(dataPath, "utf8");
      existingData = JSON.parse(fileData);
    }

    // Yeni veriyi ekle
    existingData.push(newData);
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ message: "Daten erfolgreich gespeichert" });
  } catch (error) {
    console.error("Daten konnten nicht gespeichert werden:", error);
    return NextResponse.json({ message: "Daten konnten nicht gespeichert werden" }, { status: 500 });
  }
}
