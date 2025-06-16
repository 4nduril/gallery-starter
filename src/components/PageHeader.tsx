export const PageHeader = ({ className }: { className?: string }) => (
  <header className={`${className} py-4 bg-blue-500 text-gray-200`}>
    <h1 className="text-3xl text-center font-semibold">
      {process.env.PAGE_TITLE || "Photo-Galerie"}
    </h1>
  </header>
);
