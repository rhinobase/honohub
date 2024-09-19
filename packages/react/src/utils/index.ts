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

export function paramsSerializer(params: Record<string, unknown>) {
  return Object.entries(params)
    .reduce<string[]>((prev, [key, value]) => {
      if (value) {
        if (Array.isArray(value))
          prev.push(...value.map((val) => `${key}=${val}`));
        else if (typeof value === "object")
          prev.push(
            ...Object.entries(value).map(
              ([_key, _value]) => `${_key}=${_value}`,
            ),
          );
        else prev.push(`${key}=${value}`);
      }

      return prev;
    }, [])
    .join("&");
}
