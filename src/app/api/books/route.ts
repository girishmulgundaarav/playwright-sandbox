import { NextResponse } from "next/server";

interface Book {
  id: number;
  title: string;
  author: string;
}

// In-memory data store using let to allow updates and deletions
export let books: Book[] = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald" }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const limitStr = searchParams.get("limit");
  const limit = limitStr ? parseInt(limitStr, 10) : null;

  let filteredBooks = [...books];

  if (search) {
    filteredBooks = filteredBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
    );
  }

  if (limit !== null && !isNaN(limit)) {
    filteredBooks = filteredBooks.slice(0, limit);
  }

  return NextResponse.json(filteredBooks);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

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

export async function PUT(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== "Bearer mock-token") {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid token" },
      { status: 401 }
    );
  }

  try {
    const { id, title, author } = await request.json();

    if (!id || !title || !author) {
      return NextResponse.json(
        { error: "Bad Request: ID, Title, and Author are required" },
        { status: 400 }
      );
    }

    const bookIndex = books.findIndex((b) => b.id === Number(id));
    if (bookIndex === -1) {
      return NextResponse.json(
        { error: `Not Found: Book with ID ${id} does not exist` },
        { status: 404 }
      );
    }

    books[bookIndex] = {
      id: Number(id),
      title: String(title).trim(),
      author: String(author).trim()
    };

    return NextResponse.json(books[bookIndex]);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Invalid JSON body";
    return NextResponse.json(
      { error: `Internal Server Error: ${errMsg}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== "Bearer mock-token") {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid token" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    let idStr = searchParams.get("id");

    if (!idStr) {
      // Fallback to JSON body if not in query params
      try {
        const body = await request.clone().json();
        idStr = body.id;
      } catch (e) {
        // Ignored
      }
    }

    if (!idStr) {
      return NextResponse.json(
        { error: "Bad Request: ID is required to delete a book" },
        { status: 400 }
      );
    }

    const targetId = Number(idStr);
    const bookIndex = books.findIndex((b) => b.id === targetId);

    if (bookIndex === -1) {
      return NextResponse.json(
        { error: `Not Found: Book with ID ${targetId} does not exist` },
        { status: 404 }
      );
    }

    const deletedBook = books[bookIndex];
    books.splice(bookIndex, 1);

    return NextResponse.json({
      message: `Book successfully deleted`,
      book: deletedBook
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Error handling request";
    return NextResponse.json(
      { error: `Internal Server Error: ${errMsg}` },
      { status: 500 }
    );
  }
}
