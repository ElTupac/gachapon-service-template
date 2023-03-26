const SEPARATOR_STRING = "-|-";

export const throwErrors: (a: string | string[]) => Error = (error) => {
  if (Array.isArray(error)) return new Error(error.join(SEPARATOR_STRING));
  else return new Error(error);
};

export const getErrors: (a: string | Error | unknown) => string[] = (error) => {
  if (error instanceof Error) return error.message.split(SEPARATOR_STRING);
  else if (typeof error === "string") return [error];
  else return [];
};
