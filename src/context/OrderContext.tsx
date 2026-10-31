
import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';

import type { Order } from '../types/Order';
import { orderReducer } from '../reducers/OrderReducer';

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  loadOrders: (orders: Order[]) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, dispatch] = useReducer(orderReducer, []);

  const addOrder = (order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  const updateOrder = (order: Order) => {
    dispatch({ type: 'UPDATE_ORDER', payload: order });
  };

  const deleteOrder = (id: string) => {
    dispatch({ type: 'DELETE_ORDER', payload: id });
  };

  const loadOrders = (orders: Order[]) => {
    dispatch({ type: 'SET_ORDERS', payload: orders });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      'useOrders debe utilizarse dentro de OrderProvider',
    );
  }

  return context;
}
