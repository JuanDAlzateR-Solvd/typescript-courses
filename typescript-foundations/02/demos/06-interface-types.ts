interface Book {
  title: string;
  author: string;
  publishedYear: number;
  numberOfPages: number;
}

let book: Book = {
  title: "The Time Machine",
  author: "H.G. Wells",
  publishedYear: 1895,
  numberOfPages: 144,
}

function printBookInfo(book: Book): void {
  console.log(`Title: ${book.title}`);
  console.log(`Author: ${book.author}`);
  console.log(`Published Year: ${book.publishedYear}`);
  console.log(`Page Count: ${book.numberOfPages}`);
}

let book1: Book = { title: "The Time Machine", author: "H.G. Wells", publishedYear: 1895, numberOfPages: 144 };
let book2: Book = { title: "Pride and Prejudice", author: "Jane Austen", publishedYear: 1813, numberOfPages: 304 };
let book3: Book = { title: "Frankenstein", author: "Mary Shelley", publishedYear: 1818, numberOfPages: 353 };

let books: Book[] = [book1, book2, book3];

interface User {
  id: number;
  username: string;
  password: string;
}

interface Role extends User {
  role: string;
  expiration: Date;
}

let user: Role = {
  id: 1,
  username: "jon",
  password: "123456",
  role: "admin",
  expiration: new Date()
}