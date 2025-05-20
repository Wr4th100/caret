import Logo from '@/components/logo';

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Logo className="animate-pulse" />
    </div>
  );
}
