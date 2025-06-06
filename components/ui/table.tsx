import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  className?: string;
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-gray-100 transition-colors hover:bg-gray-200/50 data-[state=selected]:bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
