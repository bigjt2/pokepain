interface INamedItem {
  name: string;
}

export function capitalize(word: string) {
  return word[0].toUpperCase() + word.slice(1);
}

export function sortByNameAZ(items: INamedItem[]) {
  items.sort((a, b) => a.name.localeCompare(b.name));
}
