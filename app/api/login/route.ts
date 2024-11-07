import { NextResponse } from "next/server";
import crypto from "crypto";

// Session geçerlilik süresi: 30 dakika
const SESSION_EXPIRATION_TIME = 30 * 60 * 1000;

export async function POST(request: Request) {
  const { key } = await request.json();

  // Anahtarı doğrulamak için API'yi çağırın veya doğrulama fonksiyonunuzu kullanın
  const isValid = await verifyKey(key); // Key doğrulama fonksiyonu

  if (isValid) {
    // Session key oluştur
    const sessionKey = crypto.randomBytes(16).toString("hex");
    const expirationDate = new Date(Date.now() + SESSION_EXPIRATION_TIME);

    // Çerez olarak session key ayarla
    const response = NextResponse.json({ message: "Giriş başarılı!" });
    response.cookies.set("sessionKey", sessionKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expirationDate,
    });

    return response;
  } else {
    return NextResponse.json({ message: "Geçersiz anahtar" }, { status: 401 });
  }
}

// Anahtarı doğrulama fonksiyonu
async function verifyKey(key: string): Promise<boolean> {
  // Burada doğrulama işlemi yapılır (örneğin, key veritabanı veya JSON dosyasından kontrol edilebilir)
  return true; // Örnek olarak her zaman doğru kabul ettik
}
