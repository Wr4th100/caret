'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '../ui/button';

export default function SignOutButton() {
  return (
    <Button
      onClick={async () => {
        await authClient.signOut();
      }}
    >
      Sign out
    </Button>
  );
}
