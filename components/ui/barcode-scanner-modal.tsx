import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

type BarcodeScannerModalProps = {
  visible: boolean;
  onScanned: (barcode: string) => void;
  onClose: () => void;
};

export function BarcodeScannerModal({ visible, onScanned, onClose }: BarcodeScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (visible) {
      scannedRef.current = false;
      setReady(false);
      if (!permission?.granted) {
        requestPermission();
      }
    }
  }, [visible]);

  const handleScanned = ({ data }: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    onScanned(data);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            onCameraReady={() => setReady(true)}
            onBarcodeScanned={ready ? handleScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: [
                'ean13', 'ean8', 'upc_a', 'upc_e',
                'code128', 'code39', 'qr',
              ],
            }}
          />
        ) : (
          <View style={styles.permissionBox}>
            <ThemedText style={styles.permissionText}>
              Camera permission is required to scan barcodes.
            </ThemedText>
            <Pressable style={styles.grantBtn} onPress={requestPermission}>
              <ThemedText style={styles.grantLabel}>Grant Permission</ThemedText>
            </Pressable>
          </View>
        )}

        <View style={styles.overlay}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>

          <View style={styles.reticle} />

          <ThemedText style={styles.hint}>Point at a barcode</ThemedText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    padding: 8,
  },
  reticle: {
    width: 240,
    height: 160,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  hint: {
    marginTop: 24,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  grantBtn: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  grantLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
