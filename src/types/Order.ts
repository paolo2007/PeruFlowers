export type OrderStatus =
  | 'Pendiente'
  | 'En preparación'
  | 'Entregado'
  | 'Cancelado';

export type OrderPriority = 'Baja' | 'Media' | 'Alta';

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  flowerProduct: string;
  quantity: number;
  unitPrice: number;
  status: OrderStatus;
  priority: OrderPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
