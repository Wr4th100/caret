import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  return (
    <div className="flex w-full flex-col p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Separator className="my-4" />
      <div>
        <p className="text-lg">This is the profile page.</p>
        <p className="mt-2 text-sm text-gray-500">
          Here you can view and edit your profile information.
        </p>
      </div>
    </div>
  );
}
