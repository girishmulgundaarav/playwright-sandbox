import { NextResponse } from "next/server";

interface Book {
  id: number;
  title: string;
  author: string;
}

// In-memory data store
const books: Book[] = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" }
];

export async function GET() {
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  // Validate Authorization Bearer token header
  if (authHeader !== "Bearer mock-token") {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid token" },
      { status: 401 }
    );
  }

  try {
    const { title, author } = await request.json();

    if (!title || !author) {
      return NextResponse.json(
        { error: "Bad Request: Title and Author are required" },
        { status: 400 }
      );
    }

    const newBook: Book = {
      id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
      title: String(title).trim(),
      author: String(author).trim()
    };

    books.push(newBook);

    return NextResponse.json(newBook, { status: 201 });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Invalid JSON body";
    return NextResponse.json(
      { error: `Internal Server Error: ${errMsg}` },
      { status: 500 }
    );
  }
}
