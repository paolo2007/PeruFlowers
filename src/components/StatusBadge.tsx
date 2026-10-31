
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { OrderStatus } from '../types/Order';

type Props = {
  status: OrderStatus;
};

const StatusBadge = ({ status }: Props) => {
  const statusStyles = {
    Pendiente: {
      badge: styles.pending,
      text: styles.pendingText,
    },
    'En preparación': {
      badge: styles.preparing,
      text: styles.preparingText,
    },
    Entregado: {
      badge: styles.delivered,
      text: styles.deliveredText,
    },
    Cancelado: {
      badge: styles.cancelled,
      text: styles.cancelledText,
    },
  };

  const currentStyle = statusStyles[status];

  return (
    <View style={[styles.badge, currentStyle.badge]}>
      <Text style={[styles.text, currentStyle.text]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  pending: {
    backgroundColor: '#FFF3E0',
    borderColor: '#F2D8B5',
  },
  pendingText: {
    color: '#98651D',
  },
  preparing: {
    backgroundColor: '#FFF3F5',
    borderColor: '#E8C8D2',
  },
  preparingText: {
    color: '#813B55',
  },
  delivered: {
    backgroundColor: '#E8F5EC',
    borderColor: '#C8E5D1',
  },
  deliveredText: {
    color: '#287747',
  },
  cancelled: {
    backgroundColor: '#FDECEC',
    borderColor: '#F2CECE',
  },
  cancelledText: {
    color: '#B42318',
  },
});

export default StatusBadge;
