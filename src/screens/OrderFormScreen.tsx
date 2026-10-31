
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';

import type { Order, OrderPriority, OrderStatus } from '../types/Order';

type Props = {
  initialOrder?: Order;
  onSave: (order: Order) => Promise<void>;
  onCancel: () => void;
};

const COLORS = {
  background: '#FAF4F1',
  burgundy: '#813B55',
  dark: '#422D36',
  secondary: '#927D84',
  white: '#FFFFFF',
  pink: '#FFF3F5',
  border: '#F0E5E2',
  red: '#B42318',
  green: '#287747',
  greenBg: '#E8F5EC',
  amber: '#98651D',
  amberBg: '#FFF3E0',
};

const products = [
  { name: 'Rosas', icon: '🌹', description: 'Elegancia y amor' },
  { name: 'Girasoles', icon: '🌻', description: 'Alegría y luz' },
  { name: 'Tulipanes', icon: '🌷', description: 'Belleza y delicadeza' },
  { name: 'Ramo mixto', icon: '💐', description: 'Flores variadas' },
  { name: 'Orquídeas', icon: '🪻', description: 'Distinción y belleza' },
];

const statuses: OrderStatus[] = [
  'Pendiente',
  'En preparación',
  'Entregado',
  'Cancelado',
];

const priorities: OrderPriority[] = ['Baja', 'Media', 'Alta'];

const generateOrderId = () => {
  const number = Math.floor(10000 + Math.random() * 90000);
  return `PF-${number}`;
};

const OrderFormScreen = ({ initialOrder, onSave, onCancel }: Props) => {
  const [customerName, setCustomerName] = useState(initialOrder?.customerName ?? '');
  const [phone, setPhone] = useState(initialOrder?.phone ?? '');
  const [flowerProduct, setFlowerProduct] = useState(initialOrder?.flowerProduct ?? 'Rosas');
  const [quantity, setQuantity] = useState(String(initialOrder?.quantity ?? 1));
  const [unitPrice, setUnitPrice] = useState(String(initialOrder?.unitPrice ?? ''));
  const [status, setStatus] = useState<OrderStatus>(initialOrder?.status ?? 'Pendiente');
  const [priority, setPriority] = useState<OrderPriority>(initialOrder?.priority ?? 'Media');
  const [notes, setNotes] = useState(initialOrder?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const updateError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const changeQuantity = (amount: number) => {
    const current = Number(quantity) || 0;
    setQuantity(String(Math.max(1, current + amount)));
    updateError('quantity');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (customerName.trim().length < 3) {
      newErrors.customerName = 'Ingresa un nombre de al menos 3 caracteres.';
    }

    if (!/^9\d{8}$/.test(phone.trim())) {
      newErrors.phone = 'Ingresa un celular peruano válido de 9 dígitos.';
    }

    if (!products.some(product => product.name === flowerProduct)) {
      newErrors.flowerProduct = 'Selecciona un producto válido.';
    }

    if (!/^[1-9]\d*$/.test(quantity)) {
      newErrors.quantity = 'La cantidad debe ser mayor que 0.';
    }

    if (!/^\d+(\.\d{1,2})?$/.test(unitPrice.trim()) || Number(unitPrice) <= 0) {
      newErrors.unitPrice = 'Ingresa un precio válido mayor que 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (saving) return;

    if (!validateForm()) {
      Alert.alert('Revisa tu pedido', 'Completa correctamente los campos señalados.');
      return;
    }

    const now = new Date().toISOString();

    const order: Order = {
      id: initialOrder?.id ?? generateOrderId(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      flowerProduct,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      status,
      priority,
      notes: notes.trim(),
      createdAt: initialOrder?.createdAt ?? now,
      updatedAt: now,
    };

    try {
      setSaving(true);
      await onSave(order);

      Alert.alert(
        initialOrder ? '¡Pedido actualizado!' : '¡Pedido registrado!',
        initialOrder
          ? 'Los cambios se guardaron correctamente.'
          : 'Tu nuevo pedido se registró correctamente.',
        [{ text: 'Aceptar', onPress: onCancel }],
      );
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      Alert.alert('No se pudo guardar', 'Ocurrió un problema. Inténtalo nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  const renderError = (field: string) => {
    if (!errors[field]) return null;
    return <Text style={styles.errorText}>⚠ {errors[field]}</Text>;
  };

  const renderSectionHeader = (number: string, title: string, subtitle: string) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionNumber}>
        <Text style={styles.sectionNumberText}>{number}</Text>
      </View>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>PERUFLOWERS</Text>
          <Text style={styles.title}>
            {initialOrder ? 'Editar pedido' : 'Crear nuevo pedido'}
          </Text>
          <Text style={styles.subtitle}>
            {initialOrder
              ? 'Actualiza los datos de tu pedido floral.'
              : 'Registra un pedido especial para tus clientes.'}
          </Text>
        </View>

        <View style={styles.card}>
          {renderSectionHeader('01', 'Datos del cliente', 'Información de contacto')}

          <Text style={styles.label}>Nombre completo</Text>
          <View style={[styles.inputContainer, errors.customerName && styles.inputError]}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. María López"
              placeholderTextColor="#A18A92"
              value={customerName}
              onChangeText={value => {
                setCustomerName(value);
                updateError('customerName');
              }}
            />
          </View>
          {renderError('customerName')}

          <Text style={styles.label}>Número de celular</Text>
          <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
            <Text style={styles.inputIcon}>📱</Text>
            <Text style={styles.countryCode}>+51</Text>
            <TextInput
              style={styles.input}
              placeholder="987 654 321"
              placeholderTextColor="#A18A92"
              keyboardType="number-pad"
              maxLength={9}
              value={phone}
              onChangeText={value => {
                setPhone(value.replace(/\D/g, ''));
                updateError('phone');
              }}
            />
          </View>
          {renderError('phone')}
        </View>

        <View style={styles.card}>
          {renderSectionHeader('02', 'Elige tus flores', 'Selecciona el producto del pedido')}

          <View style={styles.productGrid}>
            {products.map(product => {
              const selected = flowerProduct === product.name;

              return (
                <TouchableOpacity
                  key={product.name}
                  activeOpacity={0.75}
                  style={[
                    styles.productOption,
                    selected && styles.productSelected,
                  ]}
                  onPress={() => {
                    setFlowerProduct(product.name);
                    updateError('flowerProduct');
                  }}
                >
                  {selected && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.productIcon}>{product.icon}</Text>
                  <Text style={[styles.productName, selected && styles.selectedText]}>
                    {product.name}
                  </Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {renderError('flowerProduct')}

          <View style={styles.quantityPriceRow}>
            <View style={styles.quantityColumn}>
              <Text style={styles.label}>Cantidad</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(-1)}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityValue}
                  keyboardType="number-pad"
                  value={quantity}
                  onChangeText={value => {
                    setQuantity(value.replace(/\D/g, ''));
                    updateError('quantity');
                  }}
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              {renderError('quantity')}
            </View>

            <View style={styles.priceColumn}>
              <Text style={styles.label}>Precio por unidad</Text>
              <View style={[styles.inputContainer, errors.unitPrice && styles.inputError]}>
                <Text style={styles.currency}>S/</Text>
                <TextInput
                  style={styles.input}
                  placeholder="25.00"
                  placeholderTextColor="#A18A92"
                  keyboardType="decimal-pad"
                  value={unitPrice}
                  onChangeText={value => {
                    setUnitPrice(value);
                    updateError('unitPrice');
                  }}
                />
              </View>
              {renderError('unitPrice')}
            </View>
          </View>

          <View style={styles.totalContainer}>
            <View>
              <Text style={styles.totalLabel}>TOTAL DEL PEDIDO</Text>
              <Text style={styles.totalDescription}>
                {quantity || '0'} unidades · {flowerProduct}
              </Text>
            </View>
            <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {renderSectionHeader('03', 'Detalles del pedido', 'Organiza y personaliza la entrega')}

          <Text style={styles.label}>Estado inicial</Text>
          <View style={styles.optionsContainer}>
            {statuses.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.optionButton, status === item && styles.optionSelected]}
                onPress={() => setStatus(item)}
              >
                <Text style={[styles.optionText, status === item && styles.selectedText]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Nivel de prioridad</Text>
          <View style={styles.priorityContainer}>
            {priorities.map(item => {
              const selected = priority === item;
              const dotColor =
                item === 'Alta' ? COLORS.red :
                item === 'Media' ? COLORS.amber : COLORS.green;

              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.priorityOption, selected && styles.optionSelected]}
                  onPress={() => setPriority(item)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: dotColor }]} />
                  <Text style={[styles.optionText, selected && styles.selectedText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Observaciones (opcional)</Text>
          <TextInput
            style={[styles.notesInput]}
            placeholder="Ej. Entregar con tarjeta de felicitación..."
            placeholderTextColor="#A18A92"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.footerSummary}>
          <Text style={styles.footerSummaryIcon}>🌷</Text>
          <View style={styles.footerSummaryText}>
            <Text style={styles.footerSummaryTitle}>¡Un pedido lleno de amor!</Text>
            <Text style={styles.footerSummarySubtitle}>
              Verifica los datos antes de registrar.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonIcon}>{saving ? '⏳' : '✓'}</Text>
          <Text style={styles.saveButtonText}>
            {saving
              ? 'Guardando pedido...'
              : initialOrder
                ? 'Guardar cambios'
                : 'Registrar pedido'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>PERUFLOWERS · FLORES CON AMOR 🌸</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 35,
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 23,
  },
  headerLogo: {
    width: 65,
    height: 65,
    borderRadius: 23,
    backgroundColor: COLORS.pink,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerIcon: {
    fontSize: 35,
  },
  brand: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
    color: COLORS.burgundy,
    marginBottom: 7,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.dark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 19,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionNumber: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.pink,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  sectionNumberText: {
    color: COLORS.burgundy,
    fontSize: 12,
    fontWeight: '900',
  },
  sectionHeading: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.dark,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.dark,
    marginBottom: 7,
    marginTop: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    minHeight: 49,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 7,
    color: COLORS.dark,
    fontSize: 13,
  },
  inputIcon: {
    fontSize: 17,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 13,
    color: COLORS.burgundy,
    fontWeight: '900',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: 10,
  },
  currency: {
    fontSize: 13,
    color: COLORS.burgundy,
    fontWeight: '900',
  },
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 10,
    marginTop: 5,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 4,
  },
  productOption: {
    width: '48%',
    minHeight: 112,
    backgroundColor: '#FFFCFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productSelected: {
    backgroundColor: COLORS.pink,
    borderColor: COLORS.burgundy,
    borderWidth: 1.5,
  },
  checkCircle: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: COLORS.burgundy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
  },
  productIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  productName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.dark,
  },
  productDescription: {
    fontSize: 9,
    color: COLORS.secondary,
    marginTop: 3,
  },
  selectedText: {
    color: COLORS.burgundy,
    fontWeight: '900',
  },
  quantityPriceRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  quantityColumn: {
    flex: 0.9,
  },
  priceColumn: {
    flex: 1.1,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    height: 49,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 31,
    height: 35,
    borderRadius: 9,
    backgroundColor: COLORS.pink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.burgundy,
  },
  quantityValue: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '900',
    padding: 0,
  },
  totalContainer: {
    backgroundColor: COLORS.pink,
    borderRadius: 14,
    padding: 16,
    marginTop: 19,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5E1E7',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: COLORS.secondary,
  },
  totalDescription: {
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 5,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.burgundy,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFCFB',
  },
  optionSelected: {
    backgroundColor: COLORS.pink,
    borderColor: COLORS.burgundy,
  },
  optionText: {
    fontSize: 10,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 11,
    backgroundColor: '#FFFCFB',
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  notesInput: {
    minHeight: 90,
    backgroundColor: '#FFFCFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 13,
    color: COLORS.dark,
    fontSize: 12,
  },
  footerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 13,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerSummaryIcon: {
    fontSize: 27,
    marginRight: 11,
  },
  footerSummaryText: {
    flex: 1,
  },
  footerSummaryTitle: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '900',
  },
  footerSummarySubtitle: {
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 3,
  },
  saveButton: {
    backgroundColor: COLORS.burgundy,
    borderRadius: 14,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonIcon: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '900',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 14,
    marginTop: 3,
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontWeight: '800',
    fontSize: 12,
  },
  footer: {
    textAlign: 'center',
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 13,
  },
});

export default OrderFormScreen;