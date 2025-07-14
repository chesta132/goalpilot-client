interface Date {
  toFormattedString(): string;
}

interface JSON {
  isJSON: (item: any) => boolean;
}
