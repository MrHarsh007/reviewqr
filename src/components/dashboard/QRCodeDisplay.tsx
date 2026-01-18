'use client';

import { User } from '@/lib/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, FileText, QrCode } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LABELS } from '@/lib/constants';

interface QRCodeDisplayProps {
    userProfile: User;
}

export function QRCodeDisplay({ userProfile }: QRCodeDisplayProps) {
    const qrRef = useRef<HTMLDivElement>(null);
    const posterCanvasRef = useRef<HTMLCanvasElement>(null);
    const [posterGenerated, setPosterGenerated] = useState(false);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const reviewUrl = `${appUrl}/review/${userProfile.uid}`;

    useEffect(() => {
        const timer = setTimeout(() => {
            generatePosterPreview();
        }, 500);
        return () => clearTimeout(timer);
    }, [reviewUrl, userProfile.displayName, userProfile.companyName]);

    const drawPoster = (canvas: HTMLCanvasElement, qrCanvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Poster size (A4 ratio-ish high quality)
        canvas.width = 1200;
        canvas.height = 1600;

        // 1. White Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Decorative Circles (Google Colors)
        ctx.beginPath();
        ctx.arc(0, 0, 300, 0, 2 * Math.PI);
        ctx.fillStyle = '#34A853'; // Green
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvas.width, 100, 250, 0, 2 * Math.PI);
        ctx.fillStyle = '#FBBC05'; // Yellow
        ctx.fill();

        ctx.beginPath();
        ctx.arc(100, canvas.height, 200, 0, 2 * Math.PI);
        ctx.fillStyle = '#EA4335'; // Red
        ctx.fill();

        ctx.beginPath();
        ctx.arc(canvas.width, canvas.height, 350, 0, 2 * Math.PI);
        ctx.fillStyle = '#4285F4'; // Blue
        ctx.fill();

        // 3. Header Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#202124';

        ctx.font = '900 80px Inter, sans-serif';
        ctx.fillText('HOW WAS YOUR', canvas.width / 2, 350);
        ctx.fillText('EXPERIENCE?', canvas.width / 2, 450);

        // 4. Subtitle
        ctx.font = '500 36px Inter, sans-serif';
        ctx.fillStyle = '#5F6368';
        ctx.fillText('Scan the QR code to leave a review', canvas.width / 2, 530);
        ctx.fillText('and let us know.', canvas.width / 2, 580);

        // 5. Draw Arrow (Removed)
        /*
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 50, 620);
        ctx.quadraticCurveTo(canvas.width / 2 - 100, 700, canvas.width / 2, 740);
        ctx.lineTo(canvas.width / 2 - 15, 715);
        ctx.moveTo(canvas.width / 2, 740);
        ctx.lineTo(canvas.width / 2 + 15, 725);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#202124';
        ctx.stroke();
        */

        // 6. QR Code Container (Rounded White Box, No Border)
        const qrSize = 450;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = 680; // Moved up from 780 to remove arrow space
        const padding = 40;
        const containerWidth = qrSize + padding * 2;
        const containerHeight = qrSize + padding * 2;
        const containerX = qrX - padding;
        const containerY = qrY - padding;
        const cornerRadius = 40;

        // ... (white box drawing code remains same, skipping for brevity in replacement if possible, but replace_file_content wants contiguous block)
        // I will include the white box drawing again to be safe and simple.

        // White Box with Rounded Corners
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;

        ctx.beginPath();
        ctx.moveTo(containerX + cornerRadius, containerY);
        ctx.lineTo(containerX + containerWidth - cornerRadius, containerY);
        ctx.arcTo(containerX + containerWidth, containerY, containerX + containerWidth, containerY + containerHeight, cornerRadius);
        ctx.lineTo(containerX + containerWidth, containerY + containerHeight);
        ctx.arcTo(containerX + containerWidth, containerY + containerHeight, containerX, containerY + containerHeight, cornerRadius);
        ctx.arcTo(containerX, containerY + containerHeight, containerX, containerY, cornerRadius);
        ctx.arcTo(containerX, containerY, containerX + containerWidth, containerY, cornerRadius);
        ctx.closePath();
        ctx.fill();

        // Reset Shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Draw Actual QR Code
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // 7. "Scan Me" Badge (Red Background with White Text)
        const badgeHeight = 100;
        const badgeY = containerY + containerHeight - 20;

        // Draw Red Badge
        ctx.fillStyle = '#EA4335';
        ctx.beginPath();
        ctx.moveTo(containerX, badgeY);
        ctx.lineTo(containerX + containerWidth, badgeY);
        ctx.arcTo(containerX + containerWidth, badgeY + badgeHeight, containerX, badgeY + badgeHeight, cornerRadius);
        ctx.arcTo(containerX, badgeY + badgeHeight, containerX, badgeY, cornerRadius);
        ctx.lineTo(containerX, badgeY);
        ctx.fill();

        // Little Triangle pointing up
        ctx.beginPath();
        const triangleSize = 25;
        ctx.moveTo(canvas.width / 2 - triangleSize, badgeY);
        ctx.lineTo(canvas.width / 2, badgeY - triangleSize);
        ctx.lineTo(canvas.width / 2 + triangleSize, badgeY);
        ctx.fill();

        // Text "Scan Me"
        ctx.font = 'bold 55px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scan Me', canvas.width / 2, badgeY + badgeHeight / 2);

        // 8. Footer Info
        const footerY = 1350; // Moved up from 1450

        ctx.textAlign = 'center';
        ctx.font = 'bold 50px Inter, sans-serif';
        ctx.fillStyle = '#202124';
        ctx.fillText(userProfile.displayName, canvas.width / 2, footerY);

        ctx.font = '500 32px Inter, sans-serif';
        ctx.fillStyle = '#5F6368';
        ctx.fillText(userProfile.companyName, canvas.width / 2, footerY + 50);

        // 9. Watermark (Centered)
        ctx.textAlign = 'center';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillStyle = '#7a7373ff';
        ctx.fillText(`Powered by ${LABELS.APP_NAME}`, canvas.width / 2, canvas.height - 30);
    };

    const generatePosterPreview = () => {
        const qrCanvas = qrRef.current?.querySelector('canvas');
        if (!qrCanvas || !posterCanvasRef.current) return;

        drawPoster(posterCanvasRef.current, qrCanvas);
        setPosterGenerated(true);
    };

    const downloadPoster = () => {
        // Create a temporary canvas for download to ensure high quality independent of preview
        const canvas = document.createElement('canvas');
        const qrCanvas = qrRef.current?.querySelector('canvas');
        if (!qrCanvas) return;

        drawPoster(canvas, qrCanvas);

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${userProfile.displayName}-review-poster.png`;
        link.href = url;
        link.click();
    };

    const downloadQRCode = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${userProfile.displayName}-qr-code.png`;
            link.href = url;
            link.click();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Share Your Profile</CardTitle>
                <CardDescription>
                    Choose between a styled poster or a standard QR code
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="poster" className="w-full" onValueChange={(value) => {
                    if (value === 'poster') {
                        setPosterGenerated(false);
                        setTimeout(() => generatePosterPreview(), 100);
                    }
                }}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="poster">
                            <FileText className="mr-2 h-4 w-4" />
                            Review Poster
                        </TabsTrigger>
                        <TabsTrigger value="qr">
                            <QrCode className="mr-2 h-4 w-4" />
                            QR Code Only
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="poster" className="space-y-6">
                        <div className="flex justify-center bg-muted/20 rounded-lg p-4 overflow-hidden items-center min-h-[400px]">
                            <canvas
                                ref={posterCanvasRef}
                                className={`w-full max-w-sm h-auto shadow-lg rounded-sm border ${posterGenerated ? 'block' : 'opacity-0'}`}
                            />
                            {!posterGenerated && (
                                <div className="absolute flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                    <p className="text-sm text-muted-foreground">Generating Poster...</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={downloadPoster} className="w-full" size="lg" disabled={!posterGenerated}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Poster (PNG)
                        </Button>
                    </TabsContent>

                    <TabsContent value="qr" className="space-y-6">
                        <div className="flex justify-center p-8 bg-white rounded-lg border">
                            <QRCodeCanvas
                                value={reviewUrl}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Review URL:</p>
                            <p className="text-xs text-muted-foreground break-all">{reviewUrl}</p>
                        </div>
                        <Button onClick={downloadQRCode} className="w-full" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download QR Code (PNG)
                        </Button>
                    </TabsContent>
                </Tabs>

                {/* Hidden Source QR Code - Crucial for generation */}
                <div ref={qrRef} className="fixed left-[-9999px] top-[-9999px] opacity-0 pointer-events-none">
                    <QRCodeCanvas
                        value={reviewUrl}
                        size={450} // High res for poster
                        level="H"
                        includeMargin={true}
                    />
                </div>

                {/* Instructions Footer */}
                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">How to use:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Choose your preferred format above</li>
                        <li>Download and print/share it</li>
                        <li>Customers scan to get AI-assisted review help</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}
