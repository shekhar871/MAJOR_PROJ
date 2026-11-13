import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { apiRequest } from '../services/api';

export default function PairingScreen({ onPaired }) {
  const [code, setCode] = useState('');
  const [deviceName, setDeviceName] = useState('Android Mobile');
  const [loading, setLoading] = useState(false);

  const handleManualPair = async () => {
    if (!code) {
      Alert.alert('Required', 'Enter pairing code shown on desktop');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/pairings/consume', {
        method: 'POST',
        body: JSON.stringify({ code, deviceName, platform: 'android' })
      });
      Alert.alert('Success', 'Device paired successfully!');
      onPaired(data.token);
    } catch (err) {
      Alert.alert('Pairing Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair with Desktop</Text>
      <Text style={styles.desc}>Scan QR code on desktop or enter pairing code below:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 32-char code or QR text"
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.btn} onPress={handleManualPair} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Pairing...' : 'Confirm Pairing'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  desc: { color: '#64748b', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', padding: 12, borderRadius: 8, marginBottom: 16 },
  btn: { backgroundColor: '#10b981', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
