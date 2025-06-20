import { ThemeToggle } from '@/components/ui/theme';

const Footer = () => {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 flex h-16 items-center justify-between border-t px-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div>
          <p>Caret.Inc</p>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Footer;
