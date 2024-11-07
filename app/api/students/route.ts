import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// 15 dakika geçerlilik süresi
const EXPIRATION_TIME = 15 * 60 * 1000;
const keysFilePath = path.join(process.cwd(), "keys.json");

// Anahtarı keys.json dosyasına kaydetme fonksiyonu
function saveKeyToFile(verifyKey: string, validUntil: string, student: object) {
  const keyData = { verifyKey, validUntil, student };
  
  let existingData;
  try {
    existingData = JSON.parse(fs.readFileSync(keysFilePath, "utf-8"));
  } catch {
    existingData = { keys: [] };
  }
  
  existingData.keys.push(keyData);
  
  fs.writeFileSync(keysFilePath, JSON.stringify(existingData, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rfid = searchParams.get("rfid");

  if (!rfid) {
    return NextResponse.json({ message: "RFID numarası gerekli" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "users.json");

  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const students = JSON.parse(fileData);

    const student = students.find((s: { rfid: string }) => s.rfid === rfid);

    if (student) {
      const verifyKey = crypto.randomBytes(16).toString("hex");
      const validUntil = new Date(Date.now() + EXPIRATION_TIME).toISOString();

      // Anahtarı keys.json dosyasına kaydet
      saveKeyToFile(verifyKey, validUntil, student);

      return NextResponse.json({ student, verifyKey, validUntil });
    } else {
      return NextResponse.json({ message: "Öğrenci bulunamadı" }, { status: 404 });
    }
  } catch (error) {
    console.error("Dosya hatası:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
