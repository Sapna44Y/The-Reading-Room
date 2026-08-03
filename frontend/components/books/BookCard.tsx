import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { STATUS_ORDER, STATUS_CONFIG } from "@/constants/status";
import { ROUTES } from "@/constants/routes";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/books/StatusBadge";
import type { Book, BookStatus } from "@/types/book";

interface BookCardProps {
  book: Book;
  onStatusChange: (status: BookStatus) => void;
  onDelete: (book: Book) => void;
}

export function BookCard({ book, onStatusChange, onDelete }: BookCardProps) {
  return (
    <div className="shelf-card flex flex-col gap-3 rounded-lg border border-foreground/12 bg-background p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={ROUTES.editBook(book.id)}
            className="shelf-card-title font-serif text-base font-medium text-foreground"
          >
            {book.title}
          </Link>
          <p className="text-sm text-foreground/50">{book.author}</p>
        </div>
        <StatusBadge status={book.status} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Select
          size="sm"
          aria-label="Change status"
          value={book.status}
          onChange={(e) => onStatusChange(e.target.value as BookStatus)}
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status].label}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-1.5">
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
      </div>
    </div>
  );
}
