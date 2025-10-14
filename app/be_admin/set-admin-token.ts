// app/[your-path]/set-admin-token.ts
'use server';

import { cookies } from 'next/headers';

export default async function setAdminToken(formData: FormData) {
  const token = process.env.ADMITOKEN;
  const invite_token = formData.get('invite_token') as string;

  if (token) {
    (await cookies()).set('admin_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365 * 5, // سنة
    });
  }
}
