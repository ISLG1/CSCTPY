'use client';
import QRCode from 'react-qr-code';

export default function UpiQrCode() {
  const upiLink = `upi://pay?pa=prabudulasi90@oksbi&pn=Prabu%Dandapani&am=100&cu=INR`;
  const upiId = "prabudulasi90@oksbi";

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Scan to Pay</h1>
      <QRCode value={upiLink} />
      <div className="mt-4 p-2 border border-gray-400 rounded">
        <p className="text-sm text-gray-600">UPI ID: {upiId}</p>
      </div>
    </div>
  );
}