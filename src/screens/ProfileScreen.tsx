
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  userName: string;
  email: string;
  onLogout: () => void;
  onBack: () => void;
  onUpdateCredentials: (
    currentPassword: string,
    newEmail: string,
    newPassword: string,
  ) => Promise<void>;
};

const ProfileScreen = ({
  userName,
  email,
  onLogout,
  onBack,
  onUpdateCredentials,
}: Props) => {
  const [showSecurity, setShowSecurity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleUpdate = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Campo obligatorio', 'Ingresa tu contraseña actual.');
      return;
    }

    if (!newEmail.trim()) {
      Alert.alert('Correo obligatorio', 'Ingresa tu nuevo correo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail.trim())) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      Alert.alert(
        'Contraseña débil',
        'La nueva contraseña debe tener al menos 6 caracteres.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Contraseñas diferentes',
        'La confirmación no coincide con la nueva contraseña.',
      );
      return;
    }

    try {
      setSaving(true);

      await onUpdateCredentials(
        currentPassword,
        newEmail.trim().toLowerCase(),
        newPassword,
      );

      Alert.alert(
        'Datos actualizados',
        'Tus credenciales se guardaron correctamente.',
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowSecurity(false);
    } catch (error) {
      Alert.alert(
        'No se pudo actualizar',
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al actualizar tus datos.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <Text style={styles.brand}>PERUFLOWERS</Text>
          <Text style={styles.brandIcon}>🌸</Text>
        </View>

        <Text style={styles.heading}>Mi perfil</Text>
        <Text style={styles.subtitle}>
          Administra tu información y seguridad de cuenta.
        </Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.trim().charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>

          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.accountTag}>
            <View style={styles.accountDot} />
            <Text style={styles.accountTagText}>Cuenta activa</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Aplicación</Text>
              <Text style={styles.infoValue}>PeruFlowers</Text>
            </View>
            <Text style={styles.infoIcon}>🌷</Text>
          </View>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>Versión</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <Text style={styles.versionTag}>APP</Text>
          </View>
        </View>

        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <View style={styles.securityIcon}>
              <Text style={styles.securityIconText}>🔒</Text>
            </View>

            <View style={styles.securityTitleContainer}>
              <Text style={styles.securityTitle}>
                Seguridad de la cuenta
              </Text>
              <Text style={styles.securitySubtitle}>
                Protege y actualiza tus datos de acceso.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => setShowSecurity(!showSecurity)}
            activeOpacity={0.8}
          >
            <Text style={styles.securityButtonText}>
              {showSecurity ? 'Cancelar cambios' : 'Cambiar correo y contraseña'}
            </Text>
            <Text style={styles.securityArrow}>
              {showSecurity ? '−' : '+'}
            </Text>
          </TouchableOpacity>

          {showSecurity && (
            <View style={styles.form}>
              <View style={styles.formDivider} />

              <Text style={styles.formHeading}>Actualizar credenciales</Text>

              <Text style={styles.label}>Correo actual</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
              />

              <Text style={styles.label}>Contraseña actual</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Ingresa tu contraseña actual"
                  placeholderTextColor="#A18A92"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                >
                  <Text style={styles.showPassword}>
                    {showCurrentPassword ? 'Ocultar' : 'Ver'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Nuevo correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="nuevo@correo.com"
                placeholderTextColor="#A18A92"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>
                Nueva contraseña (opcional)
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#A18A92"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Text style={styles.showPassword}>
                    {showNewPassword ? 'Ocultar' : 'Ver'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>
                Confirmar nueva contraseña
              </Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite la nueva contraseña"
                placeholderTextColor="#A18A92"
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={styles.helper}>
                Si no deseas cambiar tu contraseña, deja ambos campos de
                contraseña nueva vacíos.
              </Text>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  saving && styles.disabledButton,
                ]}
                onPress={handleUpdate}
                disabled={saving}
                activeOpacity={0.85}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Volver a pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>PERUFLOWERS · FLORES CON AMOR 🌸</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF4F1',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 23,
  },
  brand: {
    color: '#813B55',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  brandIcon: {
    fontSize: 23,
  },
  heading: {
    color: '#422D36',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#927D84',
    fontSize: 13,
    marginTop: 7,
    marginBottom: 22,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#F0E5E2',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#422D36',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: '#FFF3F5',
    borderWidth: 1,
    borderColor: '#F0E5E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#813B55',
    fontSize: 31,
    fontWeight: '900',
  },
  name: {
    color: '#422D36',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  email: {
    color: '#927D84',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  accountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 14,
  },
  accountDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4D9B70',
    marginRight: 7,
  },
  accountTagText: {
    color: '#813B55',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E5E2',
    width: '100%',
    marginVertical: 21,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 17,
  },
  infoLabel: {
    color: '#A18A92',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#422D36',
    fontSize: 14,
    fontWeight: '700',
  },
  infoIcon: {
    fontSize: 21,
  },
  versionTag: {
    color: '#813B55',
    backgroundColor: '#FFF3F5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: '800',
  },
  securityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0E5E2',
    marginTop: 18,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: '#FFF3F5',
    borderWidth: 1,
    borderColor: '#F0E5E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityIconText: {
    fontSize: 20,
  },
  securityTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    color: '#422D36',
    fontSize: 15,
    fontWeight: '800',
  },
  securitySubtitle: {
    color: '#927D84',
    fontSize: 11,
    marginTop: 5,
  },
  securityButton: {
    backgroundColor: '#FFF3F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F0E5E2',
  },
  securityButtonText: {
    color: '#813B55',
    fontSize: 12,
    fontWeight: '800',
  },
  securityArrow: {
    color: '#813B55',
    fontSize: 20,
    fontWeight: '700',
  },
  form: {
    marginTop: 18,
  },
  formDivider: {
    height: 1,
    backgroundColor: '#F0E5E2',
    marginBottom: 18,
  },
  formHeading: {
    color: '#422D36',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 7,
  },
  label: {
    color: '#422D36',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 13,
  },
  input: {
    height: 49,
    borderWidth: 1,
    borderColor: '#F0E5E2',
    borderRadius: 12,
    paddingHorizontal: 13,
    color: '#422D36',
    backgroundColor: '#FFFCFB',
    fontSize: 13,
  },
  disabledInput: {
    backgroundColor: '#F8F3F1',
    color: '#927D84',
  },
  passwordContainer: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E5E2',
    borderRadius: 12,
    paddingHorizontal: 13,
    backgroundColor: '#FFFCFB',
  },
  passwordInput: {
    flex: 1,
    color: '#422D36',
    fontSize: 13,
  },
  showPassword: {
    color: '#813B55',
    fontSize: 12,
    fontWeight: '800',
    paddingLeft: 8,
  },
  helper: {
    color: '#A18A92',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
  },
  saveButton: {
    backgroundColor: '#813B55',
    borderRadius: 13,
    padding: 16,
    alignItems: 'center',
    marginTop: 19,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E5E2',
    borderRadius: 13,
    padding: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  backButtonText: {
    color: '#813B55',
    fontSize: 13,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8C9CF',
    borderRadius: 13,
    padding: 15,
    alignItems: 'center',
    marginTop: 11,
  },
  logoutText: {
    color: '#B54755',
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    marginTop: 27,
  },
  footerText: {
    color: '#A18A92',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});

export default ProfileScreen;
