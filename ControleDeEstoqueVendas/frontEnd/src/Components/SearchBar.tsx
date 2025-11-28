import { FaPlus } from "react-icons/fa";
import { useState } from "react";

interface SearchBarProps {
    placeholder: string;
    onAdd: () => void;
    onSearch?: (value: string) => void;
}

export default function SearchBar({ placeholder, onAdd, onSearch }: SearchBarProps) {
    const [value, setValue] = useState("");

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && onSearch) {
            onSearch(value);
        }
    }

    return (
        <div className="flex justify-between items-center mb-4">
            <input
                id={"searchbar"}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    if (onSearch) onSearch(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="bg-[#94b1a0] text-white placeholder-white rounded-md px-4 py-2 w-1/3 focus:outline-none"
            />

            <button
                type="button"
                onClick={onAdd}
                className="bg-[#94b1a0] text-[#2d3c3b] p-2 rounded-md hover:bg-[#a8b9a8] transition-colors"
            >
                <FaPlus />
            </button>
        </div>
    );
}
