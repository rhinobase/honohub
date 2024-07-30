export function getSingularLabel(
  label: string | { singular: string; plural: string },
) {
  if (typeof label === "string") return label;
  return label.singular;
}

export function getPluralLabel(
  label: string | { singular: string; plural: string },
) {
  if (typeof label === "string") return label;
  return label.plural;
}

export function paramsSerializer(params: Record<string, any>) {
  return Object.entries(params)
    .map(([key, value]) => {
      if (!value) return undefined;
      // if (key === "fields") return `fields=${value.join("&fields=")}`;
      // if (key === "filters")
      //   return Object.keys(value)
      //     .map((_k) => `${_k}=${value[_k]}`)
      //     .join("&");
      return `${key}=${value}`;
    })
    .filter((item) => item)
    .join("&");
}
