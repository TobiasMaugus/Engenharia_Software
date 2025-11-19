interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center mt-4 text-[#4a5b59] font-semibold space-x-2">

            {/* Voltar */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="disabled:opacity-40"
            >
                ◀◀
            </button>

            {/* Números */}
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={i + 1 === currentPage ? "underline" : ""}
                >
                    {i + 1}
                </button>
            ))}

            {/* Avançar */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="disabled:opacity-40"
            >
                ▶▶
            </button>
        </div>
    );
}
