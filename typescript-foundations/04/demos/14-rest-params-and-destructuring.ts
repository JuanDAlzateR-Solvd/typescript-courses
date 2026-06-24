interface Book {
  title: string,
  author: string,
  numberOfPages: number;
}

const book1: Book = { title: "The Time Machine", author: "H.G. Wells", numberOfPages: 144 };
const book2: Book = { title: "Pride and Prejudice", author: "Jane Austen", numberOfPages: 304 };
const book3: Book = { title: "Frankenstein", author: "Mary Shelley", numberOfPages: 353 };

function printBookTitles(...books: Book[]) {
  books.forEach(book => console.log(book.title));
}

printBookTitles(book1, book2, book3);

function printBookInfo(book: Book): void {
  console.log(`${book.title} ${book.author} ${book.numberOfPages} pages`);
}

printBookInfo(book1);