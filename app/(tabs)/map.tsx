import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStores, type Store } from '@/hooks/use-stores';
import { useThemeColor } from '@/hooks/use-theme-color';

type Coords = { latitude: number; longitude: number };

export default function MapScreen() {
  const [permission, requestPermission] = Location.useForegroundPermissions();
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const mapRef = useRef<MapView>(null);
  const { stores, loading } = useStores();

  const primary = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'inputBorder');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    if (permission?.granted) {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).then((loc) => {
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      });
    }
  }, [permission?.granted]);

  if (!permission) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={primary} />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.center}>
        <Ionicons name="location-outline" size={52} color={iconColor} />
        <ThemedText type="defaultSemiBold" style={styles.permissionTitle}>
          Location Access Needed
        </ThemedText>
        <ThemedText style={[styles.permissionText, { color: iconColor }]}>
          Enable location so we can show nearby store locations on the map.
        </ThemedText>
        <Pressable
          style={[styles.grantBtn, { backgroundColor: primary }]}
          onPress={requestPermission}
        >
          <ThemedText style={styles.grantLabel}>Enable Location</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (!userLocation) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={primary} />
        <ThemedText style={[styles.permissionText, { color: iconColor }]}>
          Getting your location…
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            onPress={() => setSelectedStore(store)}
          >
            <View style={[styles.markerPin, { backgroundColor: primary }]}>
              <Ionicons name="storefront" size={14} color="#fff" />
            </View>
          </Marker>
        ))}
      </MapView>

      <Pressable
        style={[styles.locateBtn, { backgroundColor, borderColor }]}
        onPress={() => {
          mapRef.current?.animateToRegion({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }}
      >
        <Ionicons name="locate" size={22} color={primary} />
      </Pressable>

      {loading && (
        <View style={[styles.loadingBadge, { backgroundColor }]}>
          <ActivityIndicator size="small" color={primary} />
        </View>
      )}

      {selectedStore && (
        <View style={[styles.infoCard, { backgroundColor, borderColor }]}>
          <View style={styles.infoContent}>
            <View style={[styles.storeIcon, { backgroundColor: primary }]}>
              <Ionicons name="storefront" size={18} color="#fff" />
            </View>
            <View style={styles.infoText}>
              <ThemedText type="defaultSemiBold" style={styles.storeName}>
                {selectedStore.name}
              </ThemedText>
              {selectedStore.address ? (
                <ThemedText style={[styles.storeAddress, { color: iconColor }]}>
                  {selectedStore.address}
                </ThemedText>
              ) : null}
            </View>
          </View>
          <Pressable onPress={() => setSelectedStore(null)} hitSlop={12}>
            <Ionicons name="close" size={22} color={iconColor} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 36,
  },
  permissionTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  grantBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  grantLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 140,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingBadge: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  infoCard: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  storeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    gap: 3,
  },
  storeName: {
    fontSize: 15,
  },
  storeAddress: {
    fontSize: 13,
    lineHeight: 18,
  },
});
