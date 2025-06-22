import ProfileNavbar from '@/components/profile/profile-navbar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-[80vh] w-full flex-col items-center justify-center">
      <div className="flex h-full w-full max-w-6xl flex-row border">
        <ProfileNavbar />
        {children}
      </div>
    </div>
  );
}
