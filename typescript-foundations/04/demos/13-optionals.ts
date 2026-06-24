function lookupBook(title: string, isbn?: number): boolean {
  if(isbn == undefined) {
    // we know isbn doesn't exist in this block
    return true
  } else {
    // we know isbn does exist in this block
    return true
  }
}

lookupBook("The Time Machine");
lookupBook("The Time Machine", 12345);

interface Book {
  title: string,
  author: string,
  numberOfPages: number;
  publishedYear?: number;
}

let book1: Book = {
  title: "title",
  author: "author",
  numberOfPages: 1,
}

let book2: Book = {
  title: "title",
  author: "author",
  numberOfPages: 1,
  publishedYear: 1900, // publishedYear is the optional parameter
}