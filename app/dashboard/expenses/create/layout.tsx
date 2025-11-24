export default function SpendNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        min-h-screen 
        flex flex-col 
        overflow-x-hidden 
        bg-white 
      "
    >
      <div
        className="
          flex-1 
          overflow-y-auto 
          scroll-smooth
          pb-32 
          [-webkit-overflow-scrolling:touch]
        "
      >
        {children}
      </div>
    </div>
  );
}
