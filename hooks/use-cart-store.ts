"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  isOpen: boolean;
  items: CartItem[];
  deliveryFeeEnabled: boolean;
  setOpen: (isOpen: boolean) => void;
  setDeliveryFeeEnabled: (deliveryFeeEnabled: boolean) => void;
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
      deliveryFeeEnabled: false,
      setOpen: (isOpen) => set({ isOpen }),
      setDeliveryFeeEnabled: (deliveryFeeEnabled) => set({ deliveryFeeEnabled }),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id && cartItem.type === item.type,
          );

          if (existingItem) {
            return {
              deliveryFeeEnabled: state.deliveryFeeEnabled,
              isOpen: true,
              items: state.items.map((cartItem) =>
                cartItem.id === item.id && cartItem.type === item.type
                  ? { ...cartItem, qty: cartItem.qty + quantity }
                  : cartItem,
              ),
            };
          }

          return {
            deliveryFeeEnabled: state.deliveryFeeEnabled,
            isOpen: true,
            items: [...state.items, { ...item, qty: quantity }],
          };
        }),
      updateQuantity: (type, id, quantity) =>
        set((state) => {
          const items = state.items
            .map((item) =>
              item.id === id && item.type === type
                ? { ...item, qty: Math.max(1, quantity) }
                : item,
            )
            .filter((item) => item.qty > 0);

          return {
            deliveryFeeEnabled: items.length > 0 ? state.deliveryFeeEnabled : false,
            items,
          };
        }),
      removeItem: (type, id) =>
        set((state) => {
          const items = state.items.filter(
            (item) => !(item.id === id && item.type === type),
          );

          return {
            deliveryFeeEnabled: items.length > 0 ? state.deliveryFeeEnabled : false,
            items,
          };
        }),
      clearCart: () => set({ items: [], isOpen: false, deliveryFeeEnabled: false }),
    }),
    {
      name: "chayou-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
