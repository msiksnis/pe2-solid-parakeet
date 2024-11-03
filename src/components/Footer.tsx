export default function Footer() {
  return (
    <div className="">
      <div
        className="relative -z-10 h-[600px] w-full bg-cover bg-bottom"
        style={{
          backgroundImage: `url(${"../../mountain-cropped.webp"})`,
        }}
      >
        <div className="absolute bottom-0 left-0 h-[600px] w-full bg-gradient-to-b from-white to-white/80" />
      </div>
    </div>
  );
}
