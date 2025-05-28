import { headers } from 'next/headers';
import Link from 'next/link';

import GoogleSignIn from '@/components/auth/google-sign-in';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';

const HeroSection = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <p className="text-center text-6xl font-bold tracking-tighter">Effortlessly Do Documents.</p>
      <p className="mt-4 text-center text-2xl">
        A Cursor-like editor for Documents. Powered by Perplexity AI.
      </p>
      <div className="mt-8 flex w-full max-w-2xl items-center justify-center gap-4">
        {session ? (
          <Link href={`/dashboard`}>
            <Button variant={'default'} size={'lg'}>
              {session ? 'Continue Writing' : 'Start Writing'}
            </Button>
          </Link>
        ) : (
          <GoogleSignIn text="Get Started" variant="default" size={'lg'} className="w-fit" />
        )}
        <Button variant={'secondary'} size={'lg'}>
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
