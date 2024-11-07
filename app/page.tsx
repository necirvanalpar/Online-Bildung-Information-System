"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { TextField, Button, Typography, Container, Paper, Box, AppBar, Toolbar } from "@mui/material";

export default function HomePage() {
  const [verifyKey, setVerifyKey] = useState("");
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    try {
      // verifyKey'i kullanarak API çağrısı yap
      const response = await fetch(`/api/verifyKey?verifyKey=${verifyKey}`);
      const data = await response.json();

      if (!response.ok) {
        setMessage("Das Key ist nicht gültig.");
        return;
      }

      const { studentName, birthDate, id, class: studentClass, rfid } = data.student;

      // PDF oluştur
      const doc = new jsPDF();
      const barcode = uuidv4();
      doc.setFontSize(22);
      doc.text("Schülerbescheinigung", 20, 20);
      doc.setFontSize(16);
      doc.text(`Name des Schülers: ${studentName}`, 20, 40);
      doc.text(`Geburtsdatum: ${birthDate}`, 20, 50);
      doc.text(`Schüler ID: ${id}`, 20, 60);
      doc.text(`Zertifikatsnummer: ${barcode}`, 20, 70);
      doc.text(`Klasse: ${studentClass}`, 20, 80);

      // QR kod oluştur
      const qrData = `${barcode};id:${id};rfid:${rfid}`;
      const qrCodeImage = await QRCode.toDataURL(qrData);
      doc.addImage(qrCodeImage, "PNG", 20, 90, 50, 50);

      // PDF'yi indir
      doc.save("schuelerbescheinigung.pdf");

      setMessage("PDF erfolgreich heruntergeladen.");
    } catch (error) {
      console.error("Error:", error);
      setMessage("PDF konnte nicht erstellt werden.");
    }
  };

  return (
    <>
    <AppBar position="static">
        <Toolbar>
          <img src="/logo.png" alt="Logo" style={{ height: 40, marginRight: "1rem" }} />
          <Typography variant="h6" component="div">
            Schülerbescheinigung Generator
          </Typography>
        </Toolbar>
      </AppBar>

    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Schülerbescheinigung Generator
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Verifikationsschlüssel"
              placeholder="Verifikationsschlüssel eingeben"
              value={verifyKey}
              onChange={(e) => setVerifyKey(e.target.value)}
              required
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDownload}
          >
            PDF erstellen und herunterladen
          </Button>
        </form>
        {message && (
          <Typography
            variant="body1"
            align="center"
            color={message.includes("erfolgreich") ? "success.main" : "error.main"}
            style={{ marginTop: "1rem" }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
    </>
  );
}
