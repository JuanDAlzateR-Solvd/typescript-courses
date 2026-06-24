interface Book {
  title: string;
  author: string;
  numberOfPages: number;
  dueDate: Date | undefined;
}

function isBookCheckedOut(book: Book): boolean {
  if(book.dueDate == undefined) {
    return false;
  } else {
    return true;
  }
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
}

function getFullName(user: User): string {
  if(user.middleName == null) {
    return `${user.firstName} ${user.lastName}`;
  } else {
    return `${user.firstName} ${user.middleName} ${user.lastName}`;
  }
}
