interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={className}>
      <p className="text-primary text-2xl font-medium tracking-tighter">caret.</p>
    </div>
  );
};

export default Logo;
