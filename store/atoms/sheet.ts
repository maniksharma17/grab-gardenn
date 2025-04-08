// store/atoms/ui.ts
import { atom } from "recoil";

export const sheetState = atom<"cart" | "checkout" | null>({
  key: "sheetState",
  default: null,
});
