# PeruFlowers

## 1. Descripción del proyecto

**PeruFlowers** es una aplicación móvil desarrollada con React Native y TypeScript para gestionar los pedidos de una floristería.

Su finalidad es facilitar el registro, consulta, actualización y eliminación de pedidos, permitiendo organizar la información de los clientes y realizar un seguimiento del estado de cada pedido.

## 2. Core de negocio elegido

El core de negocio seleccionado es la **gestión de pedidos de una floristería**.

La aplicación permite:

- Registrar pedidos de arreglos florales.
- Visualizar el listado de pedidos.
- Consultar los detalles de cada pedido.
- Editar la información de los pedidos.
- Actualizar cantidades y precios.
- Calcular el importe total.
- Cambiar el estado de los pedidos.
- Eliminar pedidos con confirmación.
- Buscar y filtrar pedidos.

## 3. Tecnologías utilizadas

- React Native.
- TypeScript.
- JavaScript.
- React Navigation.
- SQLite para persistencia local.
- Node.js.
- Java JDK.
- Android Studio.
- Visual Studio Code.

## 4. Requisitos

Para instalar y ejecutar el proyecto se necesita:

- Node.js 20 o superior.
- JDK 17.
- Android Studio y Android SDK para Android.
- Xcode y macOS para iOS.
- Visual Studio Code (recomendado).

## 5. Instalación

Clonar el repositorio:

```bash
git clone https://github.com/paolo2007/PeruFlowers.git
```

Ingresar a la carpeta:

```bash
cd PeruFlowers
```

Instalar las dependencias:

```bash
npm install
```

## 6. Ejecución del proyecto

### Android

Conectar un dispositivo Android con la depuración USB habilitada o iniciar un emulador.

Ejecutar:

```bash
npx react-native run-android
```

### iOS

En macOS, instalar las dependencias:

```bash
cd ios
pod install
cd ..
```

Ejecutar:

```bash
npx react-native run-ios
```

## 7. Prueba del flujo CRUD

### Crear (Create)
1. Ingresar a la aplicación.
2. Acceder al formulario de pedidos.
3. Completar los datos del cliente y del pedido.
4. Guardar el pedido.
5. Verificar que aparezca en el listado.

### Leer (Read)
1. Ingresar al listado de pedidos.
2. Seleccionar un pedido.
3. Consultar su información y detalles.

### Actualizar (Update)
1. Seleccionar un pedido existente.
2. Acceder a la opción de edición.
3. Modificar los datos.
4. Guardar los cambios.
5. Verificar la actualización.

### Eliminar (Delete)
1. Seleccionar un pedido.
2. Presionar la opción de eliminar.
3. Confirmar la eliminación.
4. Verificar que desaparezca del listado.

## 8. Arquitectura del proyecto

El proyecto utiliza una arquitectura modular organizada por responsabilidades:

- **Screens:** contienen las pantallas de la aplicación.
- **Components:** contienen componentes reutilizables.
- **Context:** administra y comparte el estado de los pedidos.
- **Reducers:** centralizan las operaciones de actualización del estado.
- **Services:** gestionan la persistencia local de la información.
- **Types:** definen las estructuras y tipos de datos.

Esta organización facilita el mantenimiento y la reutilización del código.

## 9. Estructura del proyecto

```text
PeruFlowers/
│
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   └── StatusBadge.tsx
│   │
│   ├── context/
│   │   └── OrderContext.tsx
│   │
│   ├── reducers/
│   │   └── OrderReducer.ts
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   ├── OrderFormScreen.tsx
│   │   ├── OrderDetailScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── services/
│   │   └── database.ts
│   │
│   └── types/
│       └── Order.ts
│
├── App.tsx
├── package.json
├── package-lock.json
└── README.md
```

## 10. Integrantes del grupo

1. Sebastián Paolo Paredes Bueno
2. Susaya Cárdenas Vanessa
3. Cristhian Ángel Meza Cárdenas
4. Mori Sánchez, Roberto

## 11. Repositorio GitHub

[https://github.com/paolo2007/PeruFlowers](https://github.com/paolo2007/PeruFlowers)

---

**PeruFlowers — Flores con amor.**