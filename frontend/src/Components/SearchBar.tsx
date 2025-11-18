import { FaPlus } from "react-icons/fa";

export default function SearchBar({ placeholder, onAdd }: { placeholder: string; onAdd: () => void }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-[#94b1a0] text-white placeholder-white rounded-md px-4 py-2 w-1/3 focus:outline-none"
      />
      <button type="button" onClick={onAdd} className="bg-[#94b1a0] text-[#2d3c3b] p-2 rounded-md hover:bg-[#a8b9a8] transition-colors">
        <FaPlus />
      </button>
    </div>
  );
}
