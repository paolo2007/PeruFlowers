import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from 'react-native';

import type {
  Order,
  OrderStatus,
  OrderPriority,
} from '../types/Order';

import OrderCard from '../components/OrderCard';

type Props = {
  orders: Order[];
  onCreateOrder: () => void;
  onSelectOrder: (order: Order) => void;
  onProfile: () => void;
};

const COLORS = {
  background: '#FAF4F1',
  burgundy: '#813B55',
  dark: '#422D36',
  secondary: '#927D84',
  white: '#FFFFFF',
  pink: '#FFF3F5',
  border: '#F0E5E2',
  muted: '#A18A92',
  green: '#287747',
  greenBg: '#E8F5EC',
  amber: '#98651D',
  amberBg: '#FFF3E0',
  red: '#B42318',
  redBg: '#FDECEC',
};

const filters: Array<'Todos' | OrderStatus> = [
  'Todos',
  'Pendiente',
  'En preparación',
  'Entregado',
  'Cancelado',
];

const priorityFilters: Array<'Todas' | OrderPriority> = [
  'Todas',
  'Alta',
  'Media',
  'Baja',
];

const OrdersScreen = ({
  orders,
  onCreateOrder,
  onSelectOrder,
  onProfile,
}: Props) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Todos' | OrderStatus>('Todos');
  const [priorityFilter, setPriorityFilter] =
    useState<'Todas' | OrderPriority>('Todas');
  const [showSummary, setShowSummary] = useState(false);

  const summary = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pendiente').length,
    preparing: orders.filter(o => o.status === 'En preparación').length,
    delivered: orders.filter(o => o.status === 'Entregado').length,
    cancelled: orders.filter(o => o.status === 'Cancelado').length,
    highPriority: orders.filter(
      o => (o.priority ?? 'Media') === 'Alta',
    ).length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter(order => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(term) ||
        order.flowerProduct.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term) ||
        order.phone.includes(term);

      const matchesStatus =
        filter === 'Todos' || order.status === filter;

      const matchesPriority =
        priorityFilter === 'Todas' ||
        (order.priority ?? 'Media') === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, search, filter, priorityFilter]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    filter !== 'Todos' ||
    priorityFilter !== 'Todas';

  const clearFilters = () => {
    setSearch('');
    setFilter('Todos');
    setPriorityFilter('Todas');
  };

  const renderFilter = (
    item: string,
    selected: boolean,
    onPress: () => void,
    label?: string,
  ) => (
    <TouchableOpacity
      key={item}
      style={[
        styles.filterButton,
        selected && styles.filterActive,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        style={[
          styles.filterText,
          selected && styles.filterTextActive,
        ]}
      >
        {label ?? item}
      </Text>
    </TouchableOpacity>
  );

  const renderStat = (
    icon: string,
    value: number,
    label: string,
    color: string,
    background: string,
  ) => (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIconContainer,
          { backgroundColor: background },
        ]}
      >
        <Text style={styles.statIcon}>{icon}</Text>
      </View>

      <Text style={[styles.statNumber, { color }]}>
        {value}
      </Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => onSelectOrder(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => (
          <View style={styles.cardSeparator} />
        )}

        ListHeaderComponent={
          <View>
            {/* ENCABEZADO */}
            <View style={styles.topBar}>
              <View>
                <View style={styles.brandRow}>
                  <Text style={styles.brand}>
                    Peru<Text style={styles.brandHighlight}>Flowers</Text>
                  </Text>
                  <Text style={styles.brandFlower}>🌸</Text>
                </View>

                <Text style={styles.brandSubtitle}>
                  GESTIÓN FLORAL
                </Text>
              </View>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={onProfile}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Abrir mi perfil"
              >
                <Text style={styles.profileIcon}>👤</Text>
              </TouchableOpacity>
            </View>

            {/* TÍTULO */}
            <View style={styles.headingContainer}>
              <Text style={styles.eyebrow}>
                PANEL PRINCIPAL
              </Text>

              <Text style={styles.heading}>
                Gestión de pedidos
              </Text>

              <Text style={styles.subtitle}>
                Organiza y supervisa todos tus pedidos florales
                desde un solo lugar.
              </Text>
            </View>

            {/* RESUMEN */}
            <TouchableOpacity
              style={styles.summaryBanner}
              onPress={() => setShowSummary(!showSummary)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ expanded: showSummary }}
            >
              <View style={styles.summaryBannerLeft}>
                <View style={styles.summaryIconContainer}>
                  <Text style={styles.summaryIcon}>📊</Text>
                </View>

                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryBannerTitle}>
                    Resumen general
                  </Text>

                  <Text style={styles.summaryBannerSubtitle}>
                    {summary.total} pedidos registrados
                  </Text>
                </View>
              </View>

              <View style={styles.summaryBannerRight}>
                <Text style={styles.summaryBannerAction}>
                  {showSummary ? 'Ocultar' : 'Ver resumen'}
                </Text>

                <Text style={styles.summaryArrow}>
                  {showSummary ? '⌃' : '⌄'}
                </Text>
              </View>
            </TouchableOpacity>

            {showSummary && (
              <View style={styles.dashboard}>
                {renderStat(
                  '📦',
                  summary.total,
                  'Total pedidos',
                  COLORS.dark,
                  COLORS.pink,
                )}

                {renderStat(
                  '⏳',
                  summary.pending,
                  'Pendientes',
                  COLORS.amber,
                  COLORS.amberBg,
                )}

                {renderStat(
                  '🌷',
                  summary.preparing,
                  'En preparación',
                  COLORS.burgundy,
                  COLORS.pink,
                )}

                {renderStat(
                  '✅',
                  summary.delivered,
                  'Entregados',
                  COLORS.green,
                  COLORS.greenBg,
                )}

                {renderStat(
                  '🔴',
                  summary.highPriority,
                  'Prioridad alta',
                  COLORS.red,
                  COLORS.redBg,
                )}

                {renderStat(
                  '✕',
                  summary.cancelled,
                  'Cancelados',
                  COLORS.secondary,
                  COLORS.background,
                )}
              </View>
            )}

            {/* NUEVO PEDIDO */}
            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateOrder}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Crear nuevo pedido"
            >
              <View style={styles.createIconContainer}>
                <Text style={styles.createIcon}>＋</Text>
              </View>

              <View style={styles.createTextContainer}>
                <Text style={styles.createButtonText}>
                  Nuevo pedido
                </Text>

                <Text style={styles.createButtonSubtitle}>
                  Registrar un pedido floral
                </Text>
              </View>

              <Text style={styles.createArrow}>›</Text>
            </TouchableOpacity>

            {/* BUSCADOR */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Buscar pedidos
              </Text>

              <Text style={styles.sectionDescription}>
                Encuentra un pedido rápidamente
              </Text>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                style={styles.search}
                placeholder="Cliente, flor, teléfono o código..."
                placeholderTextColor={COLORS.muted}
                value={search}
                onChangeText={setSearch}
                accessibilityLabel="Buscar pedidos"
                returnKeyType="search"
                autoCorrect={false}
              />

              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch('')}
                  style={styles.clearSearch}
                  accessibilityRole="button"
                  accessibilityLabel="Limpiar búsqueda"
                >
                  <Text style={styles.clearSearchText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* FILTRO DE ESTADO */}
            <View style={styles.filterHeading}>
              <Text style={styles.sectionTitle}>
                Estado del pedido
              </Text>

              <Text style={styles.filterHint}>
                {filter === 'Todos' ? 'Todos los estados' : filter}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {filters.map(item =>
                renderFilter(
                  item,
                  filter === item,
                  () => setFilter(item),
                ),
              )}
            </ScrollView>

            {/* FILTRO DE PRIORIDAD */}
            <View style={styles.filterHeading}>
              <Text style={styles.sectionTitle}>
                Prioridad
              </Text>

              <Text style={styles.filterHint}>
                Nivel de atención
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {priorityFilters.map(item =>
                renderFilter(
                  item,
                  priorityFilter === item,
                  () => setPriorityFilter(item),
                  item === 'Todas'
                    ? 'Todas'
                    : item === 'Alta'
                      ? '🔴 Alta'
                      : item === 'Media'
                        ? '🟡 Media'
                        : '🟢 Baja',
                ),
              )}
            </ScrollView>

            {/* LISTADO */}
            <View style={styles.listHeading}>
              <View>
                <Text style={styles.sectionTitle}>
                  Tus pedidos
                </Text>

                <Text style={styles.listSubtitle}>
                  {hasActiveFilters
                    ? 'Resultados según tu búsqueda y filtros'
                    : 'Todos los pedidos registrados'}
                </Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {filteredOrders.length}
                </Text>
              </View>
            </View>

            {hasActiveFilters && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
                activeOpacity={0.7}
              >
                <Text style={styles.clearFiltersText}>
                  ✕ Limpiar búsqueda y filtros
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }

        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>💐</Text>
            </View>

            <Text style={styles.emptyTitle}>
              {orders.length === 0
                ? 'Aún no tienes pedidos'
                : 'No encontramos coincidencias'}
            </Text>

            <Text style={styles.emptySubtitle}>
              {orders.length === 0
                ? 'Comienza registrando tu primer pedido floral.'
                : 'Prueba con otra búsqueda o modifica los filtros seleccionados.'}
            </Text>

            {orders.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={onCreateOrder}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyButtonText}>
                  ＋ Crear primer pedido
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={clearFilters}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyButtonText}>
                  Limpiar filtros
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }

        ListFooterComponent={
          filteredOrders.length > 0 ? (
            <Text style={styles.footer}>
              PERUFLOWERS · FLORES CON AMOR 🌸
            </Text>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    flexGrow: 1,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  brand: {
    color: COLORS.dark,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  brandHighlight: {
    color: COLORS.burgundy,
  },

  brandFlower: {
    fontSize: 15,
  },

  brandSubtitle: {
    color: COLORS.secondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 2,
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  profileIcon: {
    fontSize: 18,
  },

  headingContainer: {
    marginBottom: 14,
  },

  eyebrow: {
    color: COLORS.burgundy,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 5,
  },

  heading: {
    color: COLORS.dark,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  subtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  summaryBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 9,
  },

  summaryBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },

  summaryIconContainer: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.pink,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIcon: {
    fontSize: 14,
  },

  summaryTextContainer: {
    flex: 1,
  },

  summaryBannerTitle: {
    color: COLORS.dark,
    fontSize: 11,
    fontWeight: '900',
  },

  summaryBannerSubtitle: {
    color: COLORS.secondary,
    fontSize: 9,
    marginTop: 2,
  },

  summaryBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  summaryBannerAction: {
    color: COLORS.burgundy,
    fontSize: 9,
    fontWeight: '800',
  },

  summaryArrow: {
    color: COLORS.burgundy,
    fontSize: 14,
    fontWeight: '800',
  },

  dashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },

  statCard: {
    width: '31%',
    minHeight: 70,
    backgroundColor: COLORS.white,
    borderRadius: 11,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },

  statIconContainer: {
    width: 23,
    height: 23,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },

  statIcon: {
    fontSize: 11,
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '900',
  },

  statLabel: {
    color: COLORS.secondary,
    fontSize: 8,
    marginTop: 1,
    fontWeight: '700',
  },

  createButton: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 19,
    elevation: 2,
    shadowColor: COLORS.burgundy,
    shadowOpacity: 0.14,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  createIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  createIcon: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '400',
  },

  createTextContainer: {
    flex: 1,
  },

  createButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900',
  },

  createButtonSubtitle: {
    color: '#F9E8EE',
    fontSize: 9,
    marginTop: 2,
  },

  createArrow: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: '300',
  },

  sectionHeader: {
    marginBottom: 8,
  },

  sectionTitle: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '900',
  },

  sectionDescription: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 3,
  },

  searchContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 17,
    height: 43,
  },

  searchIcon: {
    color: COLORS.burgundy,
    fontSize: 23,
    marginRight: 6,
  },

  search: {
    flex: 1,
    color: COLORS.dark,
    fontSize: 11,
    paddingVertical: 8,
  },

  clearSearch: {
    padding: 6,
  },

  clearSearchText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '800',
  },

  filterHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  filterHint: {
    color: COLORS.muted,
    fontSize: 9,
  },

  filters: {
    gap: 6,
    paddingBottom: 15,
    paddingRight: 5,
  },

  filterButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  filterActive: {
    backgroundColor: COLORS.burgundy,
    borderColor: COLORS.burgundy,
  },

  filterText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },

  filterTextActive: {
    color: COLORS.white,
    fontWeight: '900',
  },

  listHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 11,
  },

  listSubtitle: {
    color: COLORS.secondary,
    fontSize: 9,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 7,
    borderRadius: 10,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: COLORS.burgundy,
    fontSize: 11,
    fontWeight: '900',
  },

  clearFiltersButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.pink,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: -3,
    marginBottom: 10,
  },

  clearFiltersText: {
    color: COLORS.burgundy,
    fontSize: 10,
    fontWeight: '800',
  },

  cardSeparator: {
    height: 10,
  },

  empty: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginTop: 3,
  },

  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  emptyIcon: {
    fontSize: 29,
  },

  emptyTitle: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  emptySubtitle: {
    color: COLORS.secondary,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
  },

  emptyButton: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 14,
  },

  emptyButtonText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },

  footer: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 6,
  },
});

export default OrdersScreen;