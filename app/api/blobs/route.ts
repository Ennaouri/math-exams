import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const blobs = await list();
    
    let usedUrls = new Set<string>();
    let blobUsage: Record<string, string> = {};
    
    try {
      const postsResult = await pool.query('SELECT id, name, thumbnail FROM "Post"');
      const postDetailsResult = await pool.query(`
        SELECT pd.id, pd.name, pd.thumbnail, p.name as post_name 
        FROM "PostDetails" pd 
        JOIN "Post" p ON p.id = pd.post_id
      `);
      
      const getFileName = (url: string): string => {
        if (!url) return '';
        try {
          const decoded = decodeURIComponent(url);
          const parts = decoded.split('/');
          return parts[parts.length - 1].toLowerCase();
        } catch {
          return '';
        }
      };
      
      const blobFileNames = new Set<string>();
      for (const blob of blobs.blobs) {
        const fileName = getFileName(blob.pathname || blob.url);
        if (fileName) blobFileNames.add(fileName);
      }
      
      for (const p of postsResult.rows) {
        if (p.thumbnail && p.name) {
          const fileName = getFileName(p.thumbnail);
          if (blobFileNames.has(fileName)) {
            usedUrls.add(p.thumbnail);
            blobUsage[p.thumbnail] = `Post: ${p.name}`;
            
            for (const blob of blobs.blobs) {
              const blobFileName = getFileName(blob.pathname || blob.url);
              if (blobFileName === fileName) {
                usedUrls.add(blob.url);
                blobUsage[blob.url] = `Post: ${p.name}`;
              }
            }
          }
        }
      }
      for (const pd of postDetailsResult.rows) {
        if (pd.thumbnail && pd.name) {
          const fileName = getFileName(pd.thumbnail);
          if (blobFileNames.has(fileName)) {
            usedUrls.add(pd.thumbnail);
            blobUsage[pd.thumbnail] = `PostDetails: ${pd.name} (${pd.post_name})`;
            
            for (const blob of blobs.blobs) {
              const blobFileName = getFileName(blob.pathname || blob.url);
              if (blobFileName === fileName) {
                usedUrls.add(blob.url);
                blobUsage[blob.url] = `PostDetails: ${pd.name} (${pd.post_name})`;
              }
            }
          }
        }
      }
    } catch (dbError: any) {
      console.log('Database query skipped:', dbError.message);
    }

    const blobsWithMeta = blobs.blobs.map((blob: any) => ({
      ...blob,
      isUsed: usedUrls.has(blob.url),
      usedIn: blobUsage[blob.url] || null,
    }));

    return NextResponse.json(blobsWithMeta);
  } catch (error: any) {
    console.error('Blobs API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}