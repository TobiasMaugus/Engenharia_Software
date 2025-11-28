import Navbar from "../Components/Navbar/Navbar";

export default function PageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-[#dce7dd]">
      <Navbar active={title} />
      <main className="flex-grow px-8 py-6">
        <h2 className="text-[#4a5b59] text-3xl font-bold mb-4">{title}</h2>
        {children}
      </main>
    </div>
  );
}
