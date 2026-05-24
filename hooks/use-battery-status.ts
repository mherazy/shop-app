import { useBatteryLevel } from 'expo-battery';

const LOW_BATTERY_THRESHOLD = 0.2;

export function useBatteryStatus() {
  const batteryLevel = useBatteryLevel();
  const isLowBattery =
    batteryLevel !== -1 && batteryLevel >= 0 && batteryLevel < LOW_BATTERY_THRESHOLD;
  return { batteryLevel, isLowBattery };
}
