import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const keysFilePath = path.join(process.cwd(), "keys.json");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ message: "Anahtar gerekli" }, { status: 400 });
  }

  try {
    const fileData = fs.readFileSync(keysFilePath, "utf-8");
    const { keys } = JSON.parse(fileData);

    const keyData = keys.find((k: { verifyKey: string; validUntil: string }) => k.verifyKey === key);
    if (keyData) {
      const isValid = new Date(keyData.validUntil) > new Date();

      if (isValid) {
        return NextResponse.json({ valid: true, student: keyData.student });
      } else {
        return NextResponse.json({ valid: false, message: "Anahtarın süresi dolmuş" });
      }
    } else {
      return NextResponse.json({ valid: false, message: "Anahtar bulunamadı" });
    }
  } catch (error) {
    console.error("Dosya hatası:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
