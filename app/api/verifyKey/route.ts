import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// JSON dosyasının yolu
const filePath = path.join(process.cwd(), "keys.json");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verifyKey = searchParams.get("verifyKey");

  if (!verifyKey) {
    return NextResponse.json({ message: "Anahtar gerekli." }, { status: 400 });
  }

  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const keysData = JSON.parse(fileData).keys;

    // verifyKey ile öğrenci arama
    const keyEntry = keysData.find((key: { verifyKey: string; validUntil: string }) => {
      return key.verifyKey === verifyKey && new Date(key.validUntil) > new Date();
    });

    if (keyEntry) {
      return NextResponse.json({ student: keyEntry.student });
    } else {
      return NextResponse.json({ message: "Anahtar geçersiz veya süresi dolmuş." }, { status: 404 });
    }
  } catch (error) {
    console.error("Dosya hatası:", error);
    return NextResponse.json({ message: "Bir hata oluştu." }, { status: 500 });
  }
}
