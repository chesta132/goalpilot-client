interface Date {
  /**
   * Returns a string representation of a date. The format of the string is en-US locale.
   */
  toFormattedString(options?: { includeThisYear?: boolean; includeHour?: boolean }): string;
}

interface ObjectConstructor {
  /**
   * Returns a boolean from comparing all the objects
   */
  compare<T extends object>(...objects: T[]): boolean;
}

interface JSON {
  isJSON: (item: any) => boolean;
}
