export const parseScopes = (scopes: string) => {
  return scopes === null ? [] : scopes.split(",")
}

export const stringifyScopes = (scopes: string[]) => {
  return scopes.join(",")
}