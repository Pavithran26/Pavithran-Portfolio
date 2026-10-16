export type ClassValue = string | false | null | undefined;

/** Small class-name helper compatible with shadcn-style component imports. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
