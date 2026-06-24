function printFirstItem(arr: unknown): void {
  if(Array.isArray(arr) && typeof arr[0] == 'string') {
    console.log(arr[0].toUpperCase());
  } else if(Array.isArray(arr) && typeof arr[0] == 'number') {
    console.log(arr[0]);
  } else {
    console.log(`can't print`);
  }
}

printFirstItem(["one", "two", "three"]);