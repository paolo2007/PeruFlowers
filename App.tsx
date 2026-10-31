
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { Order } from './src/types/Order';
import { database, initializeDatabase } from './src/services/database';

import { OrderProvider, useOrders } from './src/context/OrderContext';

import LoginScreen from './src/screens/LoginScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderFormScreen from './src/screens/OrderFormScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

type RootStackParamList = {
  Login: undefined;
  Orders: undefined;
  OrderForm: { order?: Order } | undefined;
  OrderDetail: { order: Order };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <OrderProvider>
      <AppNavigator />
    </OrderProvider>
  );
}

function AppNavigator() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    loadOrders,
  } = useOrders();

  const [dbReady, setDbReady] = useState(false);

  // INICIALIZAR BASE DE DATOS Y CARGAR PEDIDOS
  useEffect(() => {
    async function loadInitialOrders() {
      try {
        await initializeDatabase();

        const result = await database.execute(
          'SELECT * FROM orders ORDER BY createdAt DESC',
        );

        loadOrders(result.rows as Order[]);
        setDbReady(true);
      } catch (error) {
        console.error('Error al iniciar SQLite:', error);

        Alert.alert(
          'Error de base de datos',
          'No se pudieron cargar los pedidos. Cierra y vuelve a abrir la aplicación.',
        );
      }
    }

    loadInitialOrders();
  }, []);

  // ACTUALIZAR CORREO Y CONTRASEÑA
  const handleUpdateCredentials = async (
    currentPassword: string,
    newEmail: string,
    newPassword: string,
  ): Promise<void> => {
    if (!user) {
      throw new Error('No hay una sesión activa.');
    }

    const result = await database.execute(
      `SELECT id FROM account
       WHERE id = 1 AND email = ? AND password = ?`,
      [user.email, currentPassword],
    );

    if (result.rows.length === 0) {
      throw new Error('La contraseña actual es incorrecta.');
    }

    const email = newEmail.trim().toLowerCase();

    if (newPassword.trim()) {
      await database.execute(
        `UPDATE account
         SET email = ?, password = ?
         WHERE id = 1`,
        [email, newPassword],
      );
    } else {
      await database.execute(
        `UPDATE account
         SET email = ?
         WHERE id = 1`,
        [email],
      );
    }

    setUser({
      ...user,
      email,
    });
  };

  // GUARDAR O ACTUALIZAR PEDIDO
  const saveOrder = async (order: Order): Promise<void> => {
    try {
      await database.execute(
        `INSERT OR REPLACE INTO orders (
          id,
          customerName,
          phone,
          flowerProduct,
          quantity,
          unitPrice,
          status,
          priority,
          notes,
          createdAt,
          updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id,
          order.customerName,
          order.phone,
          order.flowerProduct,
          order.quantity,
          order.unitPrice,
          order.status,
          order.priority,
          order.notes ?? null,
          order.createdAt,
          order.updatedAt,
        ],
      );

      const exists = orders.some(item => item.id === order.id);

      if (exists) {
        updateOrder(order);
      } else {
        addOrder(order);
      }
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      throw error;
    }
  };

  // ELIMINAR PEDIDO
  const handleDeleteOrder = async (id: string): Promise<void> => {
    try {
      await database.execute(
        'DELETE FROM orders WHERE id = ?',
        [id],
      );

      deleteOrder(id);
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      Alert.alert('Error', 'No se pudo eliminar el pedido.');
      throw error;
    }
  };

  // PANTALLA DE CARGA
  if (!dbReady) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingLogo}>🌸</Text>

        <ActivityIndicator
          size="large"
          color="#813B55"
        />

        <Text style={styles.loadingText}>
          Preparando PeruFlowers...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          <Stack.Screen name="Login">
            {() => (
              <LoginScreen
                onLogin={email => {
                  setUser({
                    name: 'Administrador',
                    email,
                  });
                }}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            {/* LISTA DE PEDIDOS */}
            <Stack.Screen name="Orders">
              {({ navigation }) => (
                <OrdersScreen
                  orders={orders}
                  onCreateOrder={() =>
                    navigation.navigate('OrderForm')
                  }
                  onSelectOrder={order =>
                    navigation.navigate('OrderDetail', { order })
                  }
                  onProfile={() =>
                    navigation.navigate('Profile')
                  }
                />
              )}
            </Stack.Screen>

            {/* FORMULARIO DE PEDIDOS */}
            <Stack.Screen name="OrderForm">
              {({ navigation, route }) => (
                <OrderFormScreen
                  initialOrder={route.params?.order}
                  onCancel={() => navigation.goBack()}
                  onSave={async order => {
                    await saveOrder(order);
                  }}
                />
              )}
            </Stack.Screen>

            {/* DETALLE DEL PEDIDO */}
            <Stack.Screen name="OrderDetail">
              {({ navigation, route }) => {
                const order =
                  orders.find(
                    item => item.id === route.params.order.id,
                  ) ?? route.params.order;

                return (
                  <OrderDetailScreen
                    order={order}
                    onBack={() => navigation.goBack()}
                    onEdit={() =>
                      navigation.navigate('OrderForm', { order })
                    }
                    onDelete={() => {
                      Alert.alert(
                        'Eliminar pedido',
                        '¿Seguro que deseas eliminar este pedido?',
                        [
                          {
                            text: 'Cancelar',
                            style: 'cancel',
                          },
                          {
                            text: 'Eliminar',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await handleDeleteOrder(order.id);
                                navigation.navigate('Orders');
                              } catch {
                                // El error ya fue registrado.
                              }
                            },
                          },
                        ],
                      );
                    }}
                  />
                );
              }}
            </Stack.Screen>

            {/* PERFIL */}
            <Stack.Screen name="Profile">
              {({ navigation }) => (
                <ProfileScreen
                  userName={user.name}
                  email={user.email}
                  onBack={() => navigation.goBack()}
                  onLogout={() => {
                    setUser(null);
                  }}
                  onUpdateCredentials={handleUpdateCredentials}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF4F1',
  },
  loadingLogo: {
    fontSize: 48,
    marginBottom: 18,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#813B55',
  },
});
