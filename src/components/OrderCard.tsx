
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import type { Order, OrderPriority } from '../types/Order';
import StatusBadge from './StatusBadge';

type Props = {
  order: Order;
  onPress: () => void;
};

const OrderCard = ({ order, onPress }: Props) => {
  const priority: OrderPriority = order.priority ?? 'Media';

  const flowerIcons: Record<string, string> = {
    Rosas: '🌹',
    Girasoles: '🌻',
    Tulipanes: '🌷',
    'Ramo mixto': '💐',
    Orquídeas: '🪻',
  };

  const flowerIcon = flowerIcons[order.flowerProduct] ?? '🌸';

  const priorityColors = {
    Alta: {
      text: '#B42318',
      background: '#FDECEC',
    },
    Media: {
      text: '#98651D',
      background: '#FFF3E0',
    },
    Baja: {
      text: '#287747',
      background: '#E8F5EC',
    },
  };

  return (
    <View style={styles.card}>
      {/* ENCABEZADO */}
      <View style={styles.header}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>PEDIDO</Text>
          <Text style={styles.orderId}>#{order.id}</Text>
        </View>

        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: priorityColors[priority].background },
          ]}
        >
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: priorityColors[priority].text },
            ]}
          />

          <Text
            style={[
              styles.priorityText,
              { color: priorityColors[priority].text },
            ]}
          >
            {priority}
          </Text>
        </View>
      </View>

      {/* PRODUCTO */}
      <View style={styles.productSection}>
        <View style={styles.flowerContainer}>
          <Text style={styles.flowerIcon}>{flowerIcon}</Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productLabel}>PRODUCTO FLORAL</Text>
          <Text style={styles.product}>
            {order.flowerProduct}
          </Text>
          <Text style={styles.customer}>
            {order.customerName}
          </Text>
        </View>
      </View>

      {/* INFORMACIÓN */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>CANTIDAD</Text>
          <Text style={styles.detailValue}>
            {order.quantity} unidades
          </Text>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>TOTAL DEL PEDIDO</Text>
          <Text style={styles.price}>
            S/ {(order.quantity * order.unitPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* PIE DE TARJETA */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.statusLabel}>ESTADO ACTUAL</Text>
          <View style={styles.statusContainer}>
            <StatusBadge status={order.status} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle del pedido ${order.id}`}
        >
          <Text style={styles.action}>Ver detalle</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0E5E2',
    elevation: 2,
    shadowColor: '#422D36',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  orderIdLabel: {
    color: '#A18A92',
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  orderId: {
    color: '#813B55',
    fontSize: 8,
    fontWeight: '600',
  },

  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginRight: 6,
  },

  priorityText: {
    fontSize: 11,
    fontWeight: '800',
  },

  productSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  flowerContainer: {
    width: 61,
    height: 61,
    borderRadius: 17,
    backgroundColor: '#FFF3F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  flowerIcon: {
    fontSize: 30,
  },

  productInfo: {
    flex: 1,
  },

  productLabel: {
    color: '#A18A92',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },

  product: {
    color: '#422D36',
    fontSize: 17,
    fontWeight: '900',
  },

  customer: {
    color: '#927D84',
    fontSize: 12,
    marginTop: 5,
  },

  detailsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF3F5',
    borderRadius: 13,
    padding: 13,
    marginBottom: 15,
    alignItems: 'center',
  },

  detailItem: {
    flex: 1,
  },

  detailDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#F0E5E2',
    marginHorizontal: 12,
  },

  detailLabel: {
    color: '#A18A92',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },

  detailValue: {
    color: '#422D36',
    fontSize: 13,
    fontWeight: '700',
  },

  price: {
    color: '#813B55',
    fontSize: 18,
    fontWeight: '900',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#F0E5E2',
  },

  statusLabel: {
    color: '#A18A92',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 7,
  },

  statusContainer: {
    alignItems: 'flex-start',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F5',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#F0E5E2',
  },

  action: {
    color: '#813B55',
    fontSize: 11,
    fontWeight: '800',
  },

  actionArrow: {
    color: '#813B55',
    fontSize: 19,
    marginLeft: 5,
    marginTop: -2,
  },
});

export default OrderCard;
