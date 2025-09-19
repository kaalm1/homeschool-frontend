import React, { useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import type { UserUpdate } from '@/generated-api';

// Regex for valid final zipcode (5 or 5+4 format)
const fullZipRegex = /^\d{5}(-\d{4})?$/;

// Regex for valid partial input (digits, optional dash, but not exceeding lengths)
const partialZipRegex = /^\d{0,5}(-\d{0,4})?$/;

interface LocationInputProps {
  familyProfile: UserUpdate;
  setFamilyProfile: React.Dispatch<React.SetStateAction<UserUpdate>>;
}

const LocationInput: React.FC<LocationInputProps> = ({ familyProfile, setFamilyProfile }) => {
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = async (): Promise<void> => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      // First try browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            await reverseGeocode(latitude, longitude);
          },
          async (err: GeolocationPositionError) => {
            console.warn('Geolocation failed, falling back to IP:', err.message);
            await getLocationByIP();
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        // Browser doesn't support geolocation
        console.warn('Geolocation not supported, using IP fallback');
        await getLocationByIP();
      }
    } catch (error) {
      setLocationError('Unable to get location. Please enter manually.');
      setIsGettingLocation(false);
    }
  };

  const getLocationByIP = async (): Promise<void> => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data: any = await res.json();

      if (data.latitude && data.longitude) {
        await reverseGeocode(data.latitude, data.longitude);
      } else {
        throw new Error('Invalid IP location data');
      }
    } catch (err) {
      setLocationError('Could not get location automatically. Please enter manually.');
      setIsGettingLocation(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<void> => {
    try {
      // Using a free reverse geocoding service
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data: any = await res.json();
      let locationString = '';
      if (data.city && data.principalSubdivision) {
        locationString = `${data.city}, ${data.principalSubdivision}`;
      } else if (data.locality && data.principalSubdivision) {
        locationString = `${data.locality}, ${data.principalSubdivision}`;
      } else if (data.principalSubdivision) {
        locationString = data.principalSubdivision;
      }

      setFamilyProfile((prev) => ({
        ...prev,
        address: locationString,
        latitude: lat,
        longitude: lng,
        city: data.city,
        state: data.principalSubdivision,
        zipcode: data.postcode,
      }));

      setIsGettingLocation(false);
    } catch (err) {
      // Fallback to coordinates if reverse geocoding fails
      setFamilyProfile((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      setIsGettingLocation(false);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        <MapPin className="mr-2 inline h-4 w-4" />
        Location
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={familyProfile.zipcode || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            setFamilyProfile((prev) => ({ ...prev, zipcode: value }));
          }}
          placeholder="Enter your zipcode"
          title="Please enter a valid ZIP code (e.g. 12345 or 12345-6789)"
          className={`flex-1 rounded-md border px-3 py-2 focus:outline-none ${
            !familyProfile.zipcode || partialZipRegex.test(familyProfile.zipcode)
              ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              : 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          }`}
        />

        <button
          type="button"
          onClick={getLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isGettingLocation ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting...
            </>
          ) : (
            <>
              <Crosshair className="h-4 w-4" />
              Use My Location
            </>
          )}
        </button>
      </div>

      {locationError && <p className="mt-1 text-sm text-red-600">{locationError}</p>}

      <p className="mt-1 text-sm text-gray-500">We'll use this to find activities near you</p>
    </div>
  );
};

export default LocationInput;
