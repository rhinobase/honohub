import axios from "axios";

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

export function createEndpoint(baseURL: string) {
  return axios.create({
    baseURL,
    // withCredentials: true,
  });
}
