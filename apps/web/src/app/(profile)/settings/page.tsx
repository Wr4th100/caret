import { headers } from 'next/headers';

import AddAPIKey from '@/components/profile/add-api-key';
import { auth } from '@/lib/auth';
import { User } from '@/types/db';

async function fetchUser(id: string): Promise<User | null> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      cookie: (await headers()).get('cookie') || '',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div className="text-center">You need to be logged in to access settings.</div>;
  }

  const user = await fetchUser(session.user.id);

  if (!user) {
    return <div className="text-center">User not found.</div>;
  }

  return (
    <div className="flex w-full flex-col p-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500">
          Here you can manage your account settings and preferences.
        </p>
      </div>
      <div className="mt-4">
        <div>
          <AddAPIKey user={user} />
        </div>
      </div>
    </div>
  );
}
