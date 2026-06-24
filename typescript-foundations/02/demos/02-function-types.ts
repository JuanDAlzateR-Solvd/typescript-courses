function daysSincePublished(publishedYear: number): number {
  const today: Date = new Date();
  const publishedDate: Date = new Date(publishedYear, 0, 1);
  const diff: number = today.getTime() - publishedDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getBookStatus(isCheckedOut: boolean): string {
  if(isCheckedOut) {
    return `Checked Out`;
  } else {
    return `Available`;
  }
}

function printBookInfo2(bookTitle: string, author: string, genre: string, publishedYear: number, pageCount: number): void {
    console.log(`Title: ${bookTitle}`);
    console.log(`Author: ${author}`);
    console.log(`Genre: ${genre}`);
    console.log(`Published Year: ${publishedYear}`);
    console.log(`Page Count: ${pageCount}`);
}

