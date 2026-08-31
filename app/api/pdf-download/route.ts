import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

/**
 * GET /api/pdf-download?url=<pdfUrl>&name=<fileName>
 *
 * Fetches the original PDF, stamps a diagonal watermark with the user's
 * name + email on every page, and streams it back as a download.
 * Requires authentication — non-logged-in users are redirected.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pdfUrl = searchParams.get('url');
  const fileName = searchParams.get('name') || 'document';

  if (!pdfUrl) {
    return NextResponse.json({ error: 'Paramètre url manquant' }, { status: 400 });
  }

  // Security: only allow relative paths or same-origin URLs to prevent SSRF
  const isSafeUrl =
    pdfUrl.startsWith('/') ||
    pdfUrl.startsWith(process.env.NEXTAUTH_URL || 'http://localhost:3000') ||
    pdfUrl.includes('vercel-storage.com') ||
    pdfUrl.includes('blob.vercel-storage.com');

  if (!isSafeUrl) {
    return NextResponse.json({ error: 'URL non autorisée' }, { status: 403 });
  }

  const userName = session.user.name || 'Étudiant';
  const userEmail = session.user.email || '';

  try {
    // Build absolute URL for fetch
    const absoluteUrl = pdfUrl.startsWith('/')
      ? `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${pdfUrl}`
      : pdfUrl;

    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF introuvable' }, { status: 404 });
    }

    const originalBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(originalBytes, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    const watermarkText = `${userName} — ${userEmail} — maths-exams.com`;

    for (const page of pages) {
      const { width, height } = page.getSize();

      // ── Diagonal watermark (large, very transparent) ──────────────────────
      page.drawText(watermarkText, {
        x: width * 0.05,
        y: height * 0.4,
        size: Math.min(width / 22, 18),
        font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.25,
        rotate: degrees(35),
      });

      // ── Footer stamp (small, opaque) ──────────────────────────────────────
      const footerText = `© Maths-Exams | ${userName} | ${new Date().toLocaleDateString('fr-FR')}`;
      const footerSize = 8;
      const footerWidth = font.widthOfTextAtSize(footerText, footerSize);

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: 18,
        color: rgb(0.95, 0.96, 0.98),
        opacity: 0.85,
      });
      page.drawText(footerText, {
        x: (width - footerWidth) / 2,
        y: 5,
        size: footerSize,
        font,
        color: rgb(0.35, 0.35, 0.45),
        opacity: 0.9,
      });
    }

    const watermarkedBytes = await pdfDoc.save();

    const safeName = fileName.replace(/[^a-z0-9\-_.]/gi, '_').replace(/\.pdf$/i, '');
    const downloadName = `${safeName}-maths-exams.pdf`;

    return new NextResponse(watermarkedBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadName}"`,
        'Content-Length': watermarkedBytes.byteLength.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('[pdf-download] Error:', err?.message);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}
