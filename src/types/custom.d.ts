interface Date {
  /**
   * Returns a string representation of a date. The format of the string is en-US locale.
   */
  toFormattedString(options?: {includeThisYear?: boolean, includeHour?: boolean}): string;
}

interface JSON {
  isJSON: (item: any) => boolean;
}
