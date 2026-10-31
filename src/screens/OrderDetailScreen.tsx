
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { Order } from '../types/Order';
import StatusBadge from '../components/StatusBadge';

type Props = {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

const COLORS = {
  burgundy: '#813B55',
  burgundyDark: '#6D3047',
  background: '#FAF4F1',
  white: '#FFFFFF',
  softPink: '#FFF3F5',
  border: '#F0E5E2',
  text: '#422D36',
  secondary: '#927D84',
  muted: '#A18A92',
  high: '#B42318',
  highBg: '#FDECEC',
  medium: '#98651D',
  mediumBg: '#FFF3E0',
  low: '#287747',
  lowBg: '#E8F5EC',
};

const FLOWERS: Record<string, string> = {
  Rosas: '🌹',
  Girasoles: '🌻',
  Tulipanes: '🌷',
  'Ramo mixto': '💐',
  Orquídeas: '🪻',
};

const OrderDetailScreen = ({
  order,
  onEdit,
  onDelete,
  onBack,
}: Props) => {
  const total = order.quantity * order.unitPrice;
  const priority = order.priority ?? 'Media';

  const flowerIcon = FLOWERS[order.flowerProduct] ?? '🌸';

  const priorityStyles =
    priority === 'Alta'
      ? {
          color: COLORS.high,
          backgroundColor: COLORS.highBg,
        }
      : priority === 'Media'
        ? {
            color: COLORS.medium,
            backgroundColor: COLORS.mediumBg,
          }
        : {
            color: COLORS.low,
            backgroundColor: COLORS.lowBg,
          };

  const formatDate = (value?: string) => {
    if (!value) return 'Fecha no disponible';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const InfoItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: string;
  }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Text style={styles.infoEmoji}>{icon}</Text>
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={onBack}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Volver a los pedidos"
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <Text style={styles.brand}>PERUFLOWERS</Text>
            <Text style={styles.brandSubtitle}>
              FLORES CON AMOR
            </Text>
          </View>

          <View style={styles.topSpacer} />
        </View>

        {/* TÍTULO */}
        <View style={styles.headingContainer}>
          <Text style={styles.eyebrow}>
            INFORMACIÓN DEL PEDIDO
          </Text>

          <Text style={styles.heading}>
            Detalle del pedido
          </Text>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Código</Text>
            <Text style={styles.orderId}>{order.id}</Text>
          </View>
        </View>

        {/* PRODUCTO */}
        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <View style={styles.flowerContainer}>
              <Text style={styles.flowerIcon}>
                {flowerIcon}
              </Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productLabel}>
                PRODUCTO FLORAL
              </Text>

              <Text style={styles.productName}>
                {order.flowerProduct}
              </Text>

              <Text style={styles.quantityText}>
                {order.quantity} unidad(es)
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.badgesRow}>
            <View style={styles.badgeColumn}>
              <Text style={styles.badgeLabel}>ESTADO DEL PEDIDO</Text>
              <StatusBadge status={order.status} />
            </View>

            <View style={styles.badgeColumn}>
              <Text style={styles.badgeLabel}>PRIORIDAD</Text>

              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: priorityStyles.backgroundColor },
                ]}
              >
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priorityStyles.color },
                  ]}
                />

                <Text
                  style={[
                    styles.priorityText,
                    { color: priorityStyles.color },
                  ]}
                >
                  {priority}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* RESUMEN ECONÓMICO */}
        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <View style={styles.totalIcon}>
              <Text style={styles.totalEmoji}>🧾</Text>
            </View>

            <View>
              <Text style={styles.totalCardTitle}>
                Resumen del pedido
              </Text>
              <Text style={styles.totalCardSubtitle}>
                Detalle del importe
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Cantidad</Text>
            <Text style={styles.priceValue}>
              {order.quantity} unidad(es)
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Precio por unidad
            </Text>

            <Text style={styles.priceValue}>
              S/ {order.unitPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.totalDivider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>
                Total a pagar
              </Text>

              <Text style={styles.totalSubtitle}>
                Importe total del pedido
              </Text>
            </View>

            <Text style={styles.totalValue}>
              S/ {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* DATOS DEL CLIENTE */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionEmoji}>👤</Text>
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Datos del cliente
              </Text>

              <Text style={styles.sectionSubtitle}>
                Información de contacto
              </Text>
            </View>
          </View>

          <InfoItem
            label="Nombre completo"
            value={order.customerName}
            icon="👤"
          />

          <View style={styles.infoDivider} />

          <InfoItem
            label="Teléfono"
            value={order.phone}
            icon="📱"
          />

          <View style={styles.infoDivider} />

          <InfoItem
            label="Notas adicionales"
            value={order.notes?.trim() || 'Sin notas adicionales'}
            icon="📝"
          />
        </View>

        {/* HISTORIAL */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionEmoji}>🕒</Text>
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Historial del pedido
              </Text>

              <Text style={styles.sectionSubtitle}>
                Registro de actividad
              </Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyTimeline}>
              <View style={styles.historyDot} />
              <View style={styles.historyLine} />
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>
                Pedido creado
              </Text>

              <Text style={styles.historyDate}>
                {formatDate(order.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <View style={styles.historyTimeline}>
              <View style={styles.historyDotUpdated} />
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>
                Última modificación
              </Text>

              <Text style={styles.historyDate}>
                {formatDate(order.updatedAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* ACCIONES */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>
            Acciones del pedido
          </Text>

          <Text style={styles.actionsSubtitle}>
            Administra la información de este pedido.
          </Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Editar pedido"
          >
            <Text style={styles.editIcon}>✎</Text>

            <Text style={styles.editButtonText}>
              Editar pedido
            </Text>

            <Text style={styles.buttonArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Eliminar pedido"
          >
            <Text style={styles.deleteIcon}>🗑</Text>

            <Text style={styles.deleteButtonText}>
              Eliminar pedido
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Volver a la lista de pedidos"
          >
            <Text style={styles.backButtonText}>
              Volver a los pedidos
            </Text>
          </TouchableOpacity>
        </View>

        {/* PIE DE PÁGINA */}
        <Text style={styles.footer}>
          PERUFLOWERS · FLORES CON AMOR 🌸
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 19,
    paddingTop: 12,
    paddingBottom: 35,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 27,
  },

  backIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: COLORS.burgundy,
    fontSize: 32,
    lineHeight: 36,
    marginTop: -4,
  },

  brandContainer: {
    alignItems: 'center',
  },

  brand: {
    color: COLORS.burgundy,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  brandSubtitle: {
    color: '#B49BA3',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
  },

  topSpacer: {
    width: 42,
  },

  headingContainer: {
    marginBottom: 20,
  },

  eyebrow: {
    color: '#A66B7D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  heading: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.6,
  },

  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.softPink,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
    marginTop: 10,
  },

  codeLabel: {
    color: COLORS.secondary,
    fontSize: 11,
    marginRight: 5,
  },

  orderId: {
    color: COLORS.burgundy,
    fontSize: 11,
    fontWeight: '900',
  },

  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    elevation: 2,
    shadowColor: COLORS.text,
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  flowerContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: COLORS.softPink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  flowerIcon: {
    fontSize: 35,
  },

  productInfo: {
    flex: 1,
  },

  productLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  productName: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '900',
  },

  quantityText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 17,
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 24,
  },

  badgeColumn: {
    alignItems: 'flex-start',
  },

  badgeLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
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
    fontWeight: '900',
  },

  totalCard: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 20,
    padding: 19,
    marginBottom: 15,
    elevation: 3,
    shadowColor: COLORS.burgundy,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  totalIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  totalEmoji: {
    fontSize: 19,
  },

  totalCardTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },

  totalCardSubtitle: {
    color: '#E8CDD5',
    fontSize: 10,
    marginTop: 3,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  priceLabel: {
    color: '#E8CDD5',
    fontSize: 12,
  },

  priceValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },

  totalDivider: {
    height: 1,
    backgroundColor: '#A96F83',
    marginVertical: 7,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },

  totalLabel: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },

  totalSubtitle: {
    color: '#E8CDD5',
    fontSize: 10,
    marginTop: 4,
  },

  totalValue: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: '900',
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 19,
  },

  sectionIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: COLORS.softPink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionEmoji: {
    fontSize: 18,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 3,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.softPink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  infoEmoji: {
    fontSize: 15,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },

  infoValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },

  infoDivider: {
    height: 1,
    backgroundColor: '#F6EFED',
    marginVertical: 12,
  },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 55,
  },

  historyTimeline: {
    width: 22,
    alignItems: 'center',
  },

  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.burgundy,
    marginTop: 3,
  },

  historyDotUpdated: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D6A3B5',
    marginTop: 3,
  },

  historyLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: 4,
    marginBottom: -3,
  },

  historyInfo: {
    flex: 1,
    paddingLeft: 9,
    paddingBottom: 17,
  },

  historyTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },

  historyDate: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 17,
  },

  actionsContainer: {
    marginTop: 7,
  },

  actionsTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },

  actionsSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    marginBottom: 15,
  },

  editButton: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
    elevation: 2,
    shadowColor: COLORS.burgundy,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  editIcon: {
    color: COLORS.white,
    fontSize: 20,
    marginRight: 12,
  },

  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },

  buttonArrow: {
    color: COLORS.white,
    fontSize: 24,
  },

  deleteButton: {
    backgroundColor: COLORS.white,
    borderColor: '#EBD5D9',
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  deleteIcon: {
    fontSize: 15,
    marginRight: 9,
  },

  deleteButtonText: {
    color: COLORS.high,
    fontSize: 13,
    fontWeight: '900',
  },

  backButton: {
    padding: 14,
    alignItems: 'center',
  },

  backButtonText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '800',
  },

  footer: {
    color: '#B9A6AC',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default OrderDetailScreen;
