function toCapitalize(inputString: string, scissors?: string) {
  // @ts-expect-error lib error
  const lowerCaseString = inputString.toLowerCase().replaceAll(scissors ?? " ", " ");

  const words = lowerCaseString.split(" ");

  const capitalizedWords = words.map((word: string) => {
    if (word.length === 0) {
      return "";
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return firstLetter + restOfWord;
  });

  const resultString = capitalizedWords.join(" ");

  return resultString;
}

export default toCapitalize;
