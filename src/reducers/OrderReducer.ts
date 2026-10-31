
import type { Order } from '../types/Order';

export type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] };

export function orderReducer(
  state: Order[],
  action: OrderAction,
): Order[] {
  switch (action.type) {
    case 'ADD_ORDER':
      return [action.payload, ...state];

    case 'UPDATE_ORDER':
      return state.map(order =>
        order.id === action.payload.id ? action.payload : order,
      );

    case 'DELETE_ORDER':
      return state.filter(order => order.id !== action.payload);

    case 'SET_ORDERS':
      return action.payload;

    default:
      return state;
  }
}
