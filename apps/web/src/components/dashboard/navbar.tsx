import UserProfile from '@/components/dashboard/user-profile';
import Logo from '@/components/logo';

const DashboardNavbar = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between p-4">
      <div className="flex w-full items-center justify-between border-b p-4">
        <div className="flex items-center space-x-4">
          <Logo />
          <span className="text-muted-foreground self-end pb-1 text-sm"> / </span>
          <p className="self-end pb-0.5">Dashboard</p>
        </div>
        <div className="flex space-x-4">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
