import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { STATUS_ORDER, STATUS_CONFIG } from "@/constants/status";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/books/StatusBadge";
import type { Book, BookStatus } from "@/types/book";

interface BookTableProps {
  books: Book[];
  onStatusChange: (id: string, status: BookStatus) => void;
  onDelete: (book: Book) => void;
}

export function BookTable({ books, onStatusChange, onDelete }: BookTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-foreground/12 bg-background shadow-[0_10px_28px_-20px_rgba(5,31,32,0.35)] md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-foreground/12 bg-foreground/3 text-xs tracking-wide text-foreground/50 uppercase">
          <tr>
            <th className="px-5 py-3.5 font-medium">Title</th>
            <th className="px-5 py-3.5 font-medium">Author</th>
            <th className="px-5 py-3.5 font-medium">Tags</th>
            <th className="px-5 py-3.5 font-medium">Status</th>
            <th className="px-5 py-3.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.id}
              className="border-t border-foreground/8 transition-colors duration-300 ease-out hover:bg-accent/6 hover:shadow-[inset_3px_0_0_0_var(--color-accent)]"
            >
              <td className="px-5 py-4">
                <Link
                  href={ROUTES.editBook(book.id)}
                  className="font-serif font-medium text-foreground transition-colors duration-300 hover:text-accent"
                >
                  {book.title}
                </Link>
              </td>
              <td className="px-5 py-4 font-serif text-foreground/60 italic">
                {book.author}
              </td>
              <td className="px-5 py-4">
                {book.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {book.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground/30">—</span>
                )}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={book.status} />
                  <Select
                    size="sm"
                    value={book.status}
                    onChange={(e) =>
                      onStatusChange(book.id, e.target.value as BookStatus)
                    }
                  >
                    {STATUS_ORDER.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_CONFIG[status].label}
                      </option>
                    ))}
                  </Select>
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={ROUTES.editBook(book.id)}
                    aria-label={`Edit ${book.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-all duration-300 hover:scale-110 hover:bg-accent/12 hover:text-accent"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(book)}
                    aria-label={`Delete ${book.title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-all duration-300 hover:scale-110 hover:bg-red-500/12 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
