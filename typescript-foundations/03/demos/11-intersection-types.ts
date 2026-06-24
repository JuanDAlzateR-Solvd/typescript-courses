interface EBook {
  title: string;
  author: string;
  fileFormat: string;
  downloadUrl: string;
}

interface BookStatus {
  checkedOut: boolean;
  numberOfCheckouts: number;
}

type DownloadStats = EBook & BookStatus;

let stats: DownloadStats = {
  title: "The Time Machine",
  author: "H.G. Wells",
  fileFormat: "PDF",
  downloadUrl: "http://example.com",
  checkedOut: true,
  numberOfCheckouts: 400,
}
