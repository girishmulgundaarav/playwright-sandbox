import { NextResponse } from "next/server";
import { books } from "../route";

export async function GET() {
  // Generate CSV format data from current books array
  let csv = "ID,Title,Author\n";
  books.forEach((b) => {
    // Escape double quotes by doubling them
    const escapedTitle = b.title.replace(/"/g, '""');
    const escapedAuthor = b.author.replace(/"/g, '""');
    csv += `${b.id},"${escapedTitle}","${escapedAuthor}"\n`;
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="books_export.csv"',
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}
