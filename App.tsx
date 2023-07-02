import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import { request, PERMISSIONS, Permission } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
type Props = {};
const Google_API_key = ""
const App = (props: Props) => {
  const [hasLocationPermission, setHasLocationPermission] = React.useState('');
  const [currentLocation, setCurrentLocation] = React.useState({
    lat: 0,
    log: 0,
    isFind: false,
  });
  const [address, setAddress] = React.useState('');

  const checkLocationPermission = async (permission: Permission) => {
    try {
      request(permission).then(result => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location', result);
          setHasLocationPermission(result);
        } else {
          console.log('location permission denied');
        }
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  React.useEffect(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log('Position', position);
          setCurrentLocation({
            lat: position.coords.latitude,
            log: position.coords.longitude,
            isFind: true,
          });
        },
        error => {
          // See error code charts below.
          console.log('Error', error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  }, [hasLocationPermission]);

  React.useEffect(() => {
    var config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.lat},${currentLocation.log}\n&location_type=ROOFTOP&result_type=street_address&key=${Google_API_key}`,
      headers: {},
    };
    console.log('Config', config);
    if (currentLocation.isFind) {
      axios(config)
        .then(function (response: any) {
          console.log('Data', response.data?.results[0]?.formatted_address);
          setAddress(response.data?.results[0]?.formatted_address);
        })
        .catch(function (error) {
          console.log('Api Error', error);
        });
    }
  }, [currentLocation]);

  return (
    <View style={{ justifyContent: 'center' }}>
      <Text style={{ margin: 10, fontSize: 30, fontWeight: 'bold' }}>
        Location Access App
      </Text>
      <Text style={{ margin: 10, fontSize: 20, fontWeight: 'bold' }}>
        {address}
      </Text>
      <View>
        <TouchableOpacity style={{ margin: 20, borderRadius: 10 }}>
          <Button
            title="Find your location"
            onPress={() => {
              if (Platform.OS == 'android') {
                checkLocationPermission(
                  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                );
              }
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
