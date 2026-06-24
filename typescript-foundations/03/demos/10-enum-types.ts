enum FileType {
  PDF,
  MOBI,
  EPUB,
}

interface EBook {
  title: string;
  author: string;
  fileFormat: FileType;
  downloadUrl: string;
}

let book: EBook = { title: "The Time Machine", author: "H.G. Wells", fileFormat: FileType.PDF, downloadUrl: "http://example.com" };

function whichFormat(book: EBook): string {
  switch(book.fileFormat) {
    case FileType.PDF:
      return `type is PDF`;
      break;
    case FileType.MOBI:
      return `type is MOBI`;
      break;
    case FileType.EPUB:
      return `type is EPUB`;
      break;
    default:
      const _exhaustiveCheck: never = book.fileFormat;
      return _exhaustiveCheck;
  }
}
