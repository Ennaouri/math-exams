import { put, del, list } from '@vercel/blob';

export { put, del, list };

export async function uploadFile(
  filename: string,
  data: Buffer | Blob | string,
  options?: { access?: 'public' | 'private' }
) {
  return put(filename, data, {
    access: 'public',
  });
}

export async function deleteFile(url: string) {
  return del(url);
}
