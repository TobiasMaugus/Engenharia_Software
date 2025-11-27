import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface DataTableProps {
  columns: string[];
  data: any[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function DataTable({ columns, data, onView, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#39746a] text-white">
            {columns.map((col, index) => (
              <th key={index} className="text-center px-4 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row: any, index: number) => (
            <tr key={index} className="bg-[#4a5b59] text-white border-b border-[#39746a]">
              {/* células com os dados */}
              {Object.values(row).map((value: any, i: number) => (
                <td key={i} className="text-center px-4 py-2">
                  {value}
                </td>
              ))}

              {/* coluna de detalhes */}
              {onView && (
                <td className="px-4 py-2 text-center">
                  <FaEye
                    onClick={() => onView(row.id)}
                    className="inline text-[#94b1a0] cursor-pointer hover:text-white"
                    title="Ver detalhes"
                  />
                </td>
              )}

              {/* coluna de editar */}
              {onEdit && (
                <td className="px-4 py-2 text-center">
                  <FaEdit
                    onClick={() => onEdit(row.id)}
                    className="inline text-[#94b1a0] cursor-pointer hover:text-white"
                    title="Editar"
                  />
                </td>
              )}

              {/* coluna de excluir */}
              {onDelete && (
                <td className="px-4 py-2 text-center">
                  <FaTrash
                    onClick={() => onDelete(row.id)}
                    className="inline text-[#94b1a0] cursor-pointer hover:text-red-400"
                    title="Excluir"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
