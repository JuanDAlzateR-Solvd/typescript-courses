interface EBook {
  title: string;
  author: string;
  fileFormat: 'PDF' | 'MOBI' | 'EPUB';
  downloadUrl: string;
}

let book: EBook = { title: "The Time Machine", author: "H.G. Wells", fileFormat: "PDF", downloadUrl: "http://example.com" };
