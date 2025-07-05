import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  SafeAreaView, 
  Alert, 
  TouchableOpacity, 
  Modal,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import { locationAPI } from '../../services/api';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Type for a location entry from backend
interface UserLocation {
  id?: string;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const MapScreen = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [locations, setLocations] = useState<UserLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [showPastLocations, setShowPastLocations] = useState(false);
  const [pastLocationsLoading, setPastLocationsLoading] = useState(false);
  const [pastLocations, setPastLocations] = useState<UserLocation[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreLocations, setHasMoreLocations] = useState(true);
  const mapRef = useRef<MapView>(null);

  const LOCATIONS_PER_PAGE = 10;

  // Function to animate map to a specific location
  const animateToLocation = (location: UserLocation) => {
    if (mapRef.current) {
      setSelectedLocation(location);
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000); // 1 second animation
    }
  };

  // Function to clear selected location and return to current location
  const clearSelectedLocation = () => {
    setSelectedLocation(null);
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);
    }
  };

  // Function to load past locations with pagination
  const loadPastLocations = async (page: number = 0, append: boolean = false) => {
    if (!user?.id) return;
    
    try {
      setPastLocationsLoading(true);
      const data = await locationAPI.getLocations(user.id, page, LOCATIONS_PER_PAGE);
      
      if (append) {
        setPastLocations(prev => [...prev, ...data]);
      } else {
        setPastLocations(data);
      }
      
      setHasMoreLocations(data && data.length === LOCATIONS_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading past locations:', error);
      Alert.alert('Error', 'Failed to load past locations');
    } finally {
      setPastLocationsLoading(false);
    }
  };

  // Function to open past locations modal
  const openPastLocations = async () => {
    setShowPastLocations(true);
    await loadPastLocations(0, false);
  };

  // Function to load more locations (pagination)
  const loadMoreLocations = async () => {
    if (!pastLocationsLoading && hasMoreLocations) {
      await loadPastLocations(currentPage + 1, true);
    }
  };

  // Fetch current location and send to backend
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          setLoading(false);
          return;
        }
        
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        setCurrentLocation(loc.coords);
        
        if (user?.id) {
          await locationAPI.createLocation({
            userId: user.id,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        Alert.alert('Location Error', 'Failed to get your current location');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Periodically send location to backend (every 5 seconds for testing)
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCurrentLocation(loc.coords);
        await locationAPI.createLocation({
          userId: user.id,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error in periodic location update:', error);
      }
    }, 5 * 60 * 1000); // 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  // Center map on current location when it changes
  useEffect(() => {
    if (currentLocation && mapRef.current && !selectedLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [currentLocation, selectedLocation]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Getting your location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={
            currentLocation
              ? {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }
              : {
                  latitude: 37.7749,
                  longitude: -122.4194,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }
          }
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={!selectedLocation}
        >
          {/* Only show selected past location as green marker */}
          {selectedLocation && (
            <Marker
              coordinate={{ 
                latitude: selectedLocation.latitude, 
                longitude: selectedLocation.longitude 
              }}
              title={new Date(selectedLocation.timestamp).toLocaleString()}
              description={`Past Location: ${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)}`}
              pinColor="green"
            />
          )}
        </MapView>

        {/* Control buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={openPastLocations}
          >
            <Text style={styles.buttonText}>Show Past Locations</Text>
          </TouchableOpacity>
          
          {selectedLocation && (
            <TouchableOpacity 
              style={[styles.button, styles.clearButton]} 
              onPress={clearSelectedLocation}
            >
              <Text style={styles.buttonText}>Clear Selection</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Past Locations Modal */}
        <Modal
          visible={showPastLocations}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Past Locations</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowPastLocations(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={pastLocations}
              keyExtractor={item => item.id || item.timestamp}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.locationItem,
                    selectedLocation?.id === item.id && styles.selectedLocationItem
                  ]}
                  onPress={() => {
                    animateToLocation(item);
                    setShowPastLocations(false);
                  }}
                >
                  <Text style={[
                    styles.locationText,
                    selectedLocation?.id === item.id && styles.selectedLocationText
                  ]}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                  <Text style={[
                    styles.coordinatesText,
                    selectedLocation?.id === item.id && styles.selectedLocationText
                  ]}>
                    ({item.latitude.toFixed(5)}, {item.longitude.toFixed(5)})
                  </Text>
                </TouchableOpacity>
              )}
              onEndReached={loadMoreLocations}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                pastLocationsLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading more...</Text>
                  </View>
                ) : null
              }
              ListEmptyComponent={
                !pastLocationsLoading ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No past locations found</Text>
                  </View>
                ) : null
              }
            />
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedLocationItem: {
    backgroundColor: '#007AFF',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
  },
  selectedLocationText: {
    color: '#fff',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});

export default MapScreen; 