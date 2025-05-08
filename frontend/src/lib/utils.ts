import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const PROGRAMMING_LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C#",
  "Go",
  "Ruby",
  "Swift",
  "Kotlin",
  "Rust",
  "Dart",
  "Scala",
  "Elixir",
  "Haskell",
  "Lua",
  "C",
  "C++"
];

