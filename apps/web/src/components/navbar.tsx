import { headers } from 'next/headers';
import Link from 'next/link';

import GoogleSignIn from '@/components/auth/google-sign-in';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';

const NavBar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <div className="bg-background/75 sticky top-0 right-0 left-0 z-10 flex h-16 w-full items-center justify-center border-b">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center">
            {session ? (
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <GoogleSignIn text="Login with Google" isLogoShown />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
