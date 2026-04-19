"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  isOpen: boolean;
  items: CartItem[];
  setOpen: (isOpen: boolean) => void;
  addItem: (item: Omit<CartItem, "qty">, quantity?: number) => void;
  updateQuantity: (type: CartItem["type"], id: number, quantity: number) => void;
  removeItem: (type: CartItem["type"], id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      items: [],
      setOpen: (isOpen) => set({ isOpen }),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id && cartItem.type === item.type,
          );

          if (existingItem) {
            return {
              isOpen: true,
              items: state.items.map((cartItem) =>
                cartItem.id === item.id && cartItem.type === item.type
                  ? { ...cartItem, qty: cartItem.qty + quantity }
                  : cartItem,
              ),
            };
          }

          return {
            isOpen: true,
            items: [...state.items, { ...item, qty: quantity }],
          };
        }),
      updateQuantity: (type, id, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id && item.type === type
                ? { ...item, qty: Math.max(1, quantity) }
                : item,
            )
            .filter((item) => item.qty > 0),
        })),
      removeItem: (type, id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.type === type),
          ),
        })),
      clearCart: () => set({ items: [], isOpen: false }),
    }),
    {
      name: "chayou-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
