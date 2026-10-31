
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { database } from '../services/database';

type Props = {
  onLogin: (email: string) => void;
};

const RECOVERY_CODE = 'PF-2026';

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [recovering, setRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obligatorios', 'Ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);

      const result = await database.execute(
        `SELECT email FROM account
         WHERE email = ? AND password = ?`,
        [email.trim().toLowerCase(), password],
      );

      if (result.rows.length === 0) {
        Alert.alert(
          'Acceso denegado',
          'El correo o la contraseña son incorrectos.',
        );
        return;
      }

      const account = result.rows[0] as { email: string };
      onLogin(account.email);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'No se pudo verificar tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    if (!recoveryEmail.trim() || !recoveryCode.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'Ingresa tu correo y código de recuperación.',
      );
      return;
    }

    if (recoveryCode.trim() !== RECOVERY_CODE) {
      Alert.alert('Código incorrecto', 'Verifica tu código de recuperación.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Contraseña inválida',
        'La nueva contraseña debe tener al menos 6 caracteres.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'No coinciden',
        'Las contraseñas ingresadas son diferentes.',
      );
      return;
    }

    try {
      setLoading(true);

      const result = await database.execute(
        'SELECT id FROM account WHERE email = ?',
        [recoveryEmail.trim().toLowerCase()],
      );

      if (result.rows.length === 0) {
        Alert.alert(
          'Cuenta no encontrada',
          'No existe una cuenta registrada con ese correo.',
        );
        return;
      }

      await database.execute(
        'UPDATE account SET password = ? WHERE email = ?',
        [newPassword, recoveryEmail.trim().toLowerCase()],
      );

      Alert.alert(
        'Contraseña restablecida',
        'Ya puedes ingresar con tu nueva contraseña.',
        [
          {
            text: 'Aceptar',
            onPress: () => {
              setEmail(recoveryEmail.trim().toLowerCase());
              setPassword('');
              setRecoveryEmail('');
              setRecoveryCode('');
              setNewPassword('');
              setConfirmPassword('');
              setRecovering(false);
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      Alert.alert('Error', 'No se pudo restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.brand}>PERUFLOWERS</Text>

          <Text style={styles.title}>
            {recovering ? 'Recupera tu acceso' : 'Bienvenido'}
          </Text>

          <Text style={styles.subtitle}>
            {recovering
              ? 'Restablece tu contraseña para volver a gestionar tus pedidos.'
              : 'Gestiona tus pedidos de flores en un solo lugar.'}
          </Text>

          {!recovering ? (
            <>
              <Text style={styles.label}>Correo electrónico</Text>

              <TextInput
                style={styles.input}
                placeholder="admin@peruflowers.com"
                placeholderTextColor="#A18A92"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>Contraseña</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#A18A92"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.showPassword}>
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotButton}
                onPress={() => {
                  setRecoveryEmail(email);
                  setRecovering(true);
                }}
              >
                <Text style={styles.forgotText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Verificando...' : 'Ingresar'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.recoveryHeader}>
                <Text style={styles.recoveryIcon}>🔐</Text>
                <Text style={styles.recoveryDescription}>
                  Completa los siguientes campos para recuperar tu cuenta.
                </Text>
              </View>

              <Text style={styles.label}>Correo registrado</Text>

              <TextInput
                style={styles.input}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#A18A92"
                value={recoveryEmail}
                onChangeText={setRecoveryEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>Código de recuperación</Text>

              <TextInput
                style={styles.input}
                placeholder="Ingresa el código"
                placeholderTextColor="#A18A92"
                value={recoveryCode}
                onChangeText={setRecoveryCode}
                autoCapitalize="characters"
              />

              <Text style={styles.label}>Nueva contraseña</Text>

              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#A18A92"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.label}>Confirmar nueva contraseña</Text>

              <TextInput
                style={styles.input}
                placeholder="Repite la contraseña"
                placeholderTextColor="#A18A92"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRecovery}
                disabled={loading}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backRecovery}
                onPress={() => setRecovering(false)}
              >
                <Text style={styles.forgotText}>
                  ← Volver al inicio de sesión
                </Text>
              </TouchableOpacity>

              <View style={styles.demoContainer}>
                <Text style={styles.demoLabel}>Código de demostración</Text>
                <Text style={styles.demoCode}>{RECOVERY_CODE}</Text>
              </View>
            </>
          )}

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.note}>FLORES CON AMOR 🌸</Text>
            <Text style={styles.noteSecondary}>
              Acceso de demostración de PeruFlowers
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4F1',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0E5E2',
    elevation: 4,
    shadowColor: '#422D36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 23,
    backgroundColor: '#813B55',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brand: {
    color: '#813B55',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#422D36',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#927D84',
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 30,
    lineHeight: 21,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#422D36',
    marginBottom: 9,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#F0E5E2',
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 19,
    color: '#422D36',
    backgroundColor: '#FFFCFB',
    fontSize: 14,
  },
  passwordContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E5E2',
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 9,
    backgroundColor: '#FFFCFB',
  },
  passwordInput: {
    flex: 1,
    color: '#422D36',
    fontSize: 14,
    paddingVertical: 10,
  },
  showPassword: {
    color: '#813B55',
    fontWeight: '800',
    fontSize: 12,
    paddingLeft: 10,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 23,
    paddingVertical: 7,
  },
  forgotText: {
    color: '#813B55',
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#813B55',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    elevation: 2,
    shadowColor: '#813B55',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  recoveryHeader: {
    backgroundColor: '#FFF3F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 23,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E5E2',
  },
  recoveryIcon: {
    fontSize: 25,
    marginBottom: 7,
  },
  recoveryDescription: {
    color: '#927D84',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  backRecovery: {
    alignItems: 'center',
    marginTop: 21,
    paddingVertical: 7,
  },
  demoContainer: {
    backgroundColor: '#FFF3F5',
    borderRadius: 13,
    padding: 13,
    alignItems: 'center',
    marginTop: 20,
  },
  demoLabel: {
    color: '#927D84',
    fontSize: 11,
    marginBottom: 5,
  },
  demoCode: {
    color: '#813B55',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 27,
  },
  footerLine: {
    width: 45,
    height: 2,
    backgroundColor: '#F0E5E2',
    borderRadius: 5,
    marginBottom: 13,
  },
  note: {
    color: '#813B55',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  noteSecondary: {
    color: '#A18A92',
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
});
