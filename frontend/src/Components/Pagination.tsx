export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <div className="flex justify-center mt-4 text-[#4a5b59] font-semibold space-x-2">
      <span>◀◀</span>
      {[...Array(totalPages)].map((_, i) => (
        <span key={i} className={i + 1 === currentPage ? "underline" : ""}>{i + 1}</span>
      ))}
      <span>▶▶</span>
    </div>
  );
}