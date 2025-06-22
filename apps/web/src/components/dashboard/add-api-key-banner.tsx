import { headers } from 'next/headers';
import Link from 'next/link';

import { auth } from '@/lib/auth';
import { getTrialUsage } from '@/lib/trial-limit';
import { User } from '@/types/db';
import { Button } from '../ui/button';

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

const AddAPIKeyBanner = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = await fetchUser(session.user.id);

  if (!user) {
    return null;
  }

  const trialUsage = await getTrialUsage(user.id);

  if (user?.perplexityApiKey) return null;

  return (
    <div className="border-l-primary bg-card mb-4 rounded border border-l-8 p-4 shadow">
      <p className="font-bold">Add Perplexity API Key</p>
      <p className="text-muted-foreground text-sm">
        You are currently on the free plan and have only {trialUsage.remaining} requests left. To
        continue using the Perplexity API, you need to add your Perplexity API key.
      </p>
      <p className="text-muted-foreground text-sm">
        To use the API, please add your API key in the settings. If you don&apos;t have an API key,
        you can create one in your account settings.
      </p>
      <Button className="mt-2">
        <Link href={'/settings'}>Go to Settings</Link>
      </Button>
    </div>
  );
};

export default AddAPIKeyBanner;
