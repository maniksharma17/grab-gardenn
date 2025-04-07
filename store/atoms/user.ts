import { localStorageEffect } from "@/lib/utils";
import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: [
      {
        street: "",
        streetOptional: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    ],
    primaryAddress: 0,
    token: null,
    isLoggedIn: false,
    createdAt: "",
    updatedAt: "",
  },
  effects: [localStorageEffect("user")],
}, 
);

export const cartRefreshState = atom({
  key: "cartRefreshState",
  default: 0,
})