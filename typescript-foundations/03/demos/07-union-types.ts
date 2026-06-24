type UserId = string | number;

function lookupUser(userId: UserId): string {
  if(typeof userId == 'string') {
    return userId;
  } else {
    return `${userId}`;
  }
}

interface PhysicalBook {
  title: string;
  author: string;
  location: string;
}

interface EBook {
  title: string;
  author: string;
  fileFormat: string;
  downloadUrl: string;
}

type LibraryBook = PhysicalBook | EBook;

function whereIsTheBook(book: LibraryBook): string {
  if("location" in book) {
    return `The physical book is located at ${book.location}`;
  } else {
    return `The digital book can be downloaded here ${book.downloadUrl}`;
  }
}
