import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode");
  const dataPath = path.join(process.cwd(), "data.json");

  if (!barcode) {
    return NextResponse.json({ message: "Zertifikatsnummer erforderlich" }, { status: 400 });
  }

  try {
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ message: "Zertifikat nicht gefunden" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dataPath, "utf8");
    const documents = JSON.parse(fileData);
    const document = documents.find((doc: { barcode: string }) => doc.barcode === barcode);

    if (!document) {
      return NextResponse.json({ message: "Zertifikat nicht gefunden" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Zertifikat konnte nicht gefunden werden:", error);
    return NextResponse.json({ message: "Ein Fehler ist aufgetreten" }, { status: 500 });
  }
}
