import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const getActiveSession = async () => {
  const headersList = await headers();

  const session = await auth.api.getSession({ headers: headersList });
  if (!session?.user) return null;

  return session;
};
