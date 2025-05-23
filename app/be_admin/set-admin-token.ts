'use server';

import { cookies } from 'next/headers';

export default async function setAdminToken() {
  const token = process.env.ADMITOKEN;

  if (token) {
    (await cookies()).set('admin_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // سنة واحدة
    });
  }
}
