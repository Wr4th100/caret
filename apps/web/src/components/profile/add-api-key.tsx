'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/types/db';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AddAPIKeyProps {
  user: User;
}

const AddAPIKey = ({ user }: AddAPIKeyProps) => {
  const [apikey, setApiKey] = useState('');
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        {user.perplexityApiKey && (
          <p className="mb-2 text-sm text-green-500">
            <CheckCircle className="mr-1 inline h-4 w-4" />
            Your Perplexity API key is already set. You can update it if needed.
          </p>
        )}
        <CardTitle>
          {user.perplexityApiKey ? 'Update ' : 'Add '}
          Perplexity API Key
        </CardTitle>
        <CardDescription>
          To use the Perplexity API, please add your API key in the settings. If you don&apos;t have
          an API key, you can create one in Perplexity&apos;s account settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="password"
          placeholder="Enter your Perplexity API Key"
          className="w-full"
          value={apikey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-muted-foreground mt-2 text-sm">
          Your API key will be used to authenticate requests to the Perplexity API. Keep it secure
          and do not share it with anyone.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={async () => {
            if (!apikey) {
              toast.error('Please enter your Perplexity API key.');
              return;
            }
            try {
              const response = await fetch(`/api/user/${user.id}/update-api-key`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiKey: apikey }),
              });

              if (!response.ok) {
                throw new Error('Failed to update API key');
              }

              toast.success('API key updated successfully!');
              setApiKey('');
              router.refresh();
            } catch (error) {
              console.error(error);
              toast.error('Failed to update API key. Please try again.');
            }
          }}
        >
          {user.perplexityApiKey ? 'Update API Key' : 'Add API Key'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddAPIKey;
