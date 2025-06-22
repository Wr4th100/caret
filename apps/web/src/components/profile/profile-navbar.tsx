import Link from 'next/link';

import Logo from '@/components/logo';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ProfileNavbar = () => {
  return (
    <div className="w-48 border-r">
      <div className="flex h-full w-full flex-col p-4">
        <div className="flex items-center justify-center">
          <Link href={'/dashboard'}>
            <Logo />
          </Link>
        </div>
        <Separator className="my-4" />
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li className={buttonVariants({ variant: 'ghost', className: 'w-full' })}>
              <Link href="/profile">Profile</Link>
            </li>
            <li className={buttonVariants({ variant: 'ghost', className: 'w-full' })}>
              <Link href="/billing">Billing</Link>
            </li>
            <li className={buttonVariants({ variant: 'ghost', className: 'w-full' })}>
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
