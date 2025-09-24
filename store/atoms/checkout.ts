// store/atoms/checkout.ts
import { atom } from "recoil";

export const checkoutOpenState = atom<boolean>({
  key: "checkoutOpenState",
  default: false,
});
