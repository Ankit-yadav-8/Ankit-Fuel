import 'dotenv/config';
import mongoose from 'mongoose';
import Station from '../src/models/Station.js';

const stations = [
  // ─── DELHI ────────────────────────────────────────
  {
    name: 'Indian Oil Fuel Station - Connaught Place',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [77.2167, 28.6328] },
    address: 'Block A, Connaught Place, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '011-23456789',
    priceList: { petrol: 94.72, diesel: 87.62, cng: 0, evPerKwh: 0 },
    rating: 4.2,
    reviewCount: 45,
    isVerified: true
  },
  {
    name: 'BPCL Petrol Pump - Karol Bagh',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [77.1903, 28.6519] },
    address: 'Pusa Road, Karol Bagh, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110005',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'atm', 'food', 'water'],
    openingHours: { open: '06:00', close: '23:00', is24Hours: false },
    contactPhone: '011-25678901',
    priceList: { petrol: 94.72, diesel: 87.62, cng: 75.61, evPerKwh: 0 },
    rating: 4.0,
    reviewCount: 32,
    isVerified: true
  },
  {
    name: 'HP Green CNG Station - Dwarka',
    brand: 'Hindustan Petroleum (HPCL)',
    location: { type: 'Point', coordinates: [77.0421, 28.5921] },
    address: 'Sector 12, Dwarka, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110078',
    fuelTypes: ['cng', 'petrol', 'diesel'],
    amenities: ['restroom', 'air', 'parking', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '011-28901234',
    priceList: { petrol: 94.72, diesel: 87.62, cng: 75.61, evPerKwh: 0 },
    rating: 3.8,
    reviewCount: 18,
    isVerified: true
  },
  {
    name: 'Tata Power EV Charging Hub - Saket',
    brand: 'Tata Power',
    location: { type: 'Point', coordinates: [77.2177, 28.5244] },
    address: 'Select Citywalk Mall, Saket, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110017',
    fuelTypes: ['ev'],
    amenities: ['restroom', 'food', 'wifi', 'parking', 'shop'],
    openingHours: { open: '08:00', close: '22:00', is24Hours: false },
    contactPhone: '011-45678123',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 12.5 },
    rating: 4.5,
    reviewCount: 67,
    isVerified: true,
    evChargerTypes: ['CCS', 'Type2', 'CHAdeMO'],
    evChargingPower: 50
  },
  {
    name: 'Adani Total Gas Station - Rohini',
    brand: 'Adani Total',
    location: { type: 'Point', coordinates: [77.1198, 28.7321] },
    address: 'Sector 7, Rohini, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110085',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'food', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '011-27890456',
    priceList: { petrol: 94.72, diesel: 87.62, cng: 75.61, evPerKwh: 0 },
    rating: 3.9,
    reviewCount: 22,
    isVerified: true
  },

  // ─── MUMBAI ───────────────────────────────────────
  {
    name: 'BPCL Premium Station - Bandra West',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [72.8361, 19.0596] },
    address: 'S.V. Road, Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'atm', 'shop', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '022-26541234',
    priceList: { petrol: 103.44, diesel: 89.97, cng: 0, evPerKwh: 0 },
    rating: 4.3,
    reviewCount: 89,
    isVerified: true
  },
  {
    name: 'Indian Oil Station - Andheri East',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [72.8697, 19.1136] },
    address: 'Saki Vihar Road, Andheri East, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400072',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'food', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '022-28907654',
    priceList: { petrol: 103.44, diesel: 89.97, cng: 76.00, evPerKwh: 0 },
    rating: 4.1,
    reviewCount: 56,
    isVerified: true
  },
  {
    name: 'Ather Grid EV Station - Powai',
    brand: 'Ather Energy',
    location: { type: 'Point', coordinates: [72.9052, 19.1187] },
    address: 'Hiranandani Gardens, Powai, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    fuelTypes: ['ev'],
    amenities: ['wifi', 'parking', 'food'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '022-25678901',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 11.0 },
    rating: 4.6,
    reviewCount: 34,
    isVerified: true,
    evChargerTypes: ['Type2'],
    evChargingPower: 7
  },

  // ─── JAIPUR ───────────────────────────────────────
  {
    name: 'Indian Oil - MI Road',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [75.7873, 26.9124] },
    address: 'MI Road, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0141-2345678',
    priceList: { petrol: 95.14, diesel: 87.39, cng: 0, evPerKwh: 0 },
    rating: 3.7,
    reviewCount: 29,
    isVerified: true
  },
  {
    name: 'HP Station - Mansarovar',
    brand: 'Hindustan Petroleum (HPCL)',
    location: { type: 'Point', coordinates: [75.7566, 26.8652] },
    address: 'Shipra Path, Mansarovar, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302020',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'shop', 'food'],
    openingHours: { open: '06:00', close: '23:00', is24Hours: false },
    contactPhone: '0141-2789456',
    priceList: { petrol: 95.14, diesel: 87.39, cng: 74.50, evPerKwh: 0 },
    rating: 4.0,
    reviewCount: 15,
    isVerified: true
  },

  // ─── BANGALORE ────────────────────────────────────
  {
    name: 'Shell Fuel Station - Koramangala',
    brand: 'Shell',
    location: { type: 'Point', coordinates: [77.6245, 12.9352] },
    address: '80 Feet Road, Koramangala, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'shop', 'food', 'atm'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '080-41234567',
    priceList: { petrol: 101.94, diesel: 87.89, cng: 0, evPerKwh: 0 },
    rating: 4.4,
    reviewCount: 112,
    isVerified: true
  },
  {
    name: 'BPCL CNG & Fuel - Whitefield',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [77.7480, 12.9698] },
    address: 'Whitefield Main Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'parking', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '080-28901234',
    priceList: { petrol: 101.94, diesel: 87.89, cng: 73.50, evPerKwh: 0 },
    rating: 3.9,
    reviewCount: 43,
    isVerified: true
  },
  {
    name: 'ChargeZone DC Fast Charger - Indiranagar',
    brand: 'ChargeZone',
    location: { type: 'Point', coordinates: [77.6408, 12.9784] },
    address: '100 Feet Road, Indiranagar, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    fuelTypes: ['ev'],
    amenities: ['wifi', 'parking', 'food', 'restroom'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '080-45612345',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 14.0 },
    rating: 4.7,
    reviewCount: 28,
    isVerified: true,
    evChargerTypes: ['CCS', 'CHAdeMO', 'Type2'],
    evChargingPower: 60
  },

  // ─── HYDERABAD ────────────────────────────────────
  {
    name: 'Indian Oil - HITEC City',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [78.3816, 17.4486] },
    address: 'HITEC City Road, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'atm', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '040-23456789',
    priceList: { petrol: 107.41, diesel: 95.65, cng: 0, evPerKwh: 0 },
    rating: 4.1,
    reviewCount: 51,
    isVerified: true
  },
  {
    name: 'Statiq EV Charger - Gachibowli',
    brand: 'Statiq',
    location: { type: 'Point', coordinates: [78.3489, 17.4401] },
    address: 'DLF Cyber City, Gachibowli, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    fuelTypes: ['ev'],
    amenities: ['wifi', 'parking', 'food', 'restroom', 'shop'],
    openingHours: { open: '06:00', close: '23:00', is24Hours: false },
    contactPhone: '040-67890123',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 13.5 },
    rating: 4.3,
    reviewCount: 19,
    isVerified: true,
    evChargerTypes: ['CCS', 'Type2'],
    evChargingPower: 30
  },

  // ─── CHENNAI ──────────────────────────────────────
  {
    name: 'HP Station - Anna Nagar',
    brand: 'Hindustan Petroleum (HPCL)',
    location: { type: 'Point', coordinates: [80.2101, 13.0850] },
    address: '2nd Avenue, Anna Nagar, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '044-26123456',
    priceList: { petrol: 100.76, diesel: 92.13, cng: 0, evPerKwh: 0 },
    rating: 3.8,
    reviewCount: 37,
    isVerified: true
  },

  // ─── KOLKATA ──────────────────────────────────────
  {
    name: 'Indian Oil - Salt Lake',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [88.4096, 22.5808] },
    address: 'Sector V, Salt Lake, Kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '033-23456789',
    priceList: { petrol: 103.94, diesel: 90.76, cng: 0, evPerKwh: 0 },
    rating: 3.6,
    reviewCount: 21,
    isVerified: true
  },

  // ─── AHMEDABAD ────────────────────────────────────
  {
    name: 'Adani CNG Pump - SG Highway',
    brand: 'Adani Total',
    location: { type: 'Point', coordinates: [72.5024, 23.0475] },
    address: 'SG Highway, Bodakdev, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    fuelTypes: ['cng', 'petrol', 'diesel'],
    amenities: ['restroom', 'air', 'food', 'parking', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '079-26789012',
    priceList: { petrol: 94.26, diesel: 88.84, cng: 72.00, evPerKwh: 0 },
    rating: 4.2,
    reviewCount: 38,
    isVerified: true
  },
  {
    name: 'BPCL Fuel & EV Hub - Prahlad Nagar',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [72.5058, 23.0131] },
    address: 'Prahlad Nagar Road, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    fuelTypes: ['petrol', 'diesel', 'ev'],
    amenities: ['restroom', 'air', 'parking', 'wifi'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '079-40123456',
    priceList: { petrol: 94.26, diesel: 88.84, cng: 0, evPerKwh: 12.0 },
    rating: 4.4,
    reviewCount: 27,
    isVerified: true,
    evChargerTypes: ['CCS', 'Type2'],
    evChargingPower: 25
  },

  // ─── PUNE ─────────────────────────────────────────
  {
    name: 'Shell Premium - Hinjawadi',
    brand: 'Shell',
    location: { type: 'Point', coordinates: [73.7382, 18.5912] },
    address: 'Mumbai-Pune Expressway, Hinjawadi, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'food', 'atm', 'shop', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '020-67890123',
    priceList: { petrol: 103.44, diesel: 89.97, cng: 0, evPerKwh: 0 },
    rating: 4.5,
    reviewCount: 78,
    isVerified: true
  },

  // ─── LUCKNOW ──────────────────────────────────────
  {
    name: 'Indian Oil - Hazratganj',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [80.9462, 26.8467] },
    address: 'MG Marg, Hazratganj, Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0522-2345678',
    priceList: { petrol: 94.56, diesel: 87.01, cng: 73.00, evPerKwh: 0 },
    rating: 3.5,
    reviewCount: 16,
    isVerified: true
  },

  // ─── HIGHWAY STATIONS (Delhi-Jaipur Route) ───────
  {
    name: 'Indian Oil Highway Pump - Manesar',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [76.9336, 28.3569] },
    address: 'NH-48, Manesar, Haryana',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122051',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'food', 'air', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0124-4567890',
    priceList: { petrol: 94.82, diesel: 87.62, cng: 0, evPerKwh: 0 },
    rating: 3.4,
    reviewCount: 12,
    isVerified: true
  },
  {
    name: 'BPCL Highway Station - Neemrana',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [76.3843, 27.9886] },
    address: 'NH-48, Neemrana, Rajasthan',
    city: 'Neemrana',
    state: 'Rajasthan',
    pincode: '301705',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'food', 'air', 'parking', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '01494-246789',
    priceList: { petrol: 95.14, diesel: 87.39, cng: 0, evPerKwh: 0 },
    rating: 3.7,
    reviewCount: 25,
    isVerified: true
  },
  {
    name: 'Tata Power EV Supercharger - Shahpura',
    brand: 'Tata Power',
    location: { type: 'Point', coordinates: [75.9603, 27.3885] },
    address: 'NH-48, near Shahpura, Rajasthan',
    city: 'Shahpura',
    state: 'Rajasthan',
    pincode: '303103',
    fuelTypes: ['ev'],
    amenities: ['restroom', 'food', 'parking', 'wifi'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0145-2345678',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 15.0 },
    rating: 4.2,
    reviewCount: 8,
    isVerified: true,
    evChargerTypes: ['CCS', 'Type2'],
    evChargingPower: 60
  },

  // ─── CHANDIGARH ───────────────────────────────────
  {
    name: 'HP Station - Sector 17',
    brand: 'Hindustan Petroleum (HPCL)',
    location: { type: 'Point', coordinates: [76.7794, 30.7333] },
    address: 'Sector 17, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    pincode: '160017',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0172-2760123',
    priceList: { petrol: 95.41, diesel: 84.26, cng: 0, evPerKwh: 0 },
    rating: 4.0,
    reviewCount: 31,
    isVerified: true
  },

  // ─── GOA ──────────────────────────────────────────
  {
    name: 'Indian Oil - Panaji',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [73.8278, 15.4909] },
    address: '18th June Road, Panaji, Goa',
    city: 'Panaji',
    state: 'Goa',
    pincode: '403001',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water'],
    openingHours: { open: '06:00', close: '22:00', is24Hours: false },
    contactPhone: '0832-2223456',
    priceList: { petrol: 97.34, diesel: 88.67, cng: 0, evPerKwh: 0 },
    rating: 3.6,
    reviewCount: 14,
    isVerified: true
  },

  // ─── ADDITIONAL DIESEL / FLEET STATIONS ───────────
  {
    name: 'BPCL Diesel Hub - Mundra Port',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [69.7190, 22.8394] },
    address: 'Port Road, Mundra, Gujarat',
    city: 'Mundra',
    state: 'Gujarat',
    pincode: '370421',
    fuelTypes: ['diesel'],
    amenities: ['restroom', 'parking', 'food', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '02838-266789',
    priceList: { petrol: 0, diesel: 86.90, cng: 0, evPerKwh: 0 },
    rating: 3.5,
    reviewCount: 9,
    isVerified: true
  },
  {
    name: 'Indian Oil Truck Stop - NH-44 Panipat',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [76.9635, 29.3909] },
    address: 'NH-44, near Panipat, Haryana',
    city: 'Panipat',
    state: 'Haryana',
    pincode: '132103',
    fuelTypes: ['diesel', 'petrol'],
    amenities: ['restroom', 'food', 'parking', 'air', 'water'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0180-2654321',
    priceList: { petrol: 94.82, diesel: 87.62, cng: 0, evPerKwh: 0 },
    rating: 3.3,
    reviewCount: 7,
    isVerified: true
  },

  // ─── MORE EV STATIONS ────────────────────────────
  {
    name: 'ElectricPe Charging - MG Road Bangalore',
    brand: 'ElectricPe',
    location: { type: 'Point', coordinates: [77.6070, 12.9758] },
    address: 'MG Road Metro Station, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    fuelTypes: ['ev'],
    amenities: ['wifi', 'parking'],
    openingHours: { open: '06:00', close: '23:00', is24Hours: false },
    contactPhone: '080-41098765',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 10.5 },
    rating: 4.1,
    reviewCount: 15,
    isVerified: true,
    evChargerTypes: ['Type2', 'CCS'],
    evChargingPower: 22
  },
  {
    name: 'IONAGE Fast Charger - Noida',
    brand: 'IONAGE',
    location: { type: 'Point', coordinates: [77.3910, 28.5355] },
    address: 'Sector 18, Noida, UP',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    fuelTypes: ['ev'],
    amenities: ['wifi', 'parking', 'food', 'restroom'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0120-4567890',
    priceList: { petrol: 0, diesel: 0, cng: 0, evPerKwh: 13.0 },
    rating: 4.4,
    reviewCount: 22,
    isVerified: true,
    evChargerTypes: ['CCS', 'CHAdeMO', 'Type2'],
    evChargingPower: 60
  },

  // ─── CNG SPECIFIC STATIONS ───────────────────────
  {
    name: 'IGL CNG Station - Lajpat Nagar',
    brand: 'Indraprastha Gas (IGL)',
    location: { type: 'Point', coordinates: [77.2373, 28.5685] },
    address: 'Ring Road, Lajpat Nagar, Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110024',
    fuelTypes: ['cng'],
    amenities: ['air', 'water'],
    openingHours: { open: '06:00', close: '22:00', is24Hours: false },
    contactPhone: '011-29810456',
    priceList: { petrol: 0, diesel: 0, cng: 75.61, evPerKwh: 0 },
    rating: 3.4,
    reviewCount: 48,
    isVerified: true
  },
  {
    name: 'Mahanagar Gas CNG - Borivali',
    brand: 'Mahanagar Gas (MGL)',
    location: { type: 'Point', coordinates: [72.8567, 19.2288] },
    address: 'Western Express Highway, Borivali, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400066',
    fuelTypes: ['cng'],
    amenities: ['air', 'water', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '022-28901234',
    priceList: { petrol: 0, diesel: 0, cng: 76.00, evPerKwh: 0 },
    rating: 3.7,
    reviewCount: 33,
    isVerified: true
  },

  // ─── KOCHI ────────────────────────────────────────
  {
    name: 'BPCL - Marine Drive Kochi',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [76.2833, 9.9816] },
    address: 'Marine Drive, Kochi, Kerala',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682031',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'shop'],
    openingHours: { open: '06:00', close: '22:00', is24Hours: false },
    contactPhone: '0484-2345678',
    priceList: { petrol: 99.49, diesel: 93.42, cng: 0, evPerKwh: 0 },
    rating: 4.0,
    reviewCount: 19,
    isVerified: true
  },

  // ─── INDORE ───────────────────────────────────────
  {
    name: 'Indian Oil - Vijay Nagar Indore',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [75.8937, 22.7536] },
    address: 'AB Road, Vijay Nagar, Indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452010',
    fuelTypes: ['petrol', 'diesel', 'cng'],
    amenities: ['restroom', 'air', 'food', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0731-4567890',
    priceList: { petrol: 107.21, diesel: 93.42, cng: 73.50, evPerKwh: 0 },
    rating: 3.9,
    reviewCount: 24,
    isVerified: true
  },

  // ─── BHOPAL ───────────────────────────────────────
  {
    name: 'HP Station - New Market Bhopal',
    brand: 'Hindustan Petroleum (HPCL)',
    location: { type: 'Point', coordinates: [77.4126, 23.2599] },
    address: 'New Market, TT Nagar, Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462003',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water'],
    openingHours: { open: '06:00', close: '23:00', is24Hours: false },
    contactPhone: '0755-2678901',
    priceList: { petrol: 107.21, diesel: 93.42, cng: 0, evPerKwh: 0 },
    rating: 3.6,
    reviewCount: 11,
    isVerified: true
  },

  // ─── SURAT ────────────────────────────────────────
  {
    name: 'Adani CNG & Fuel - Ring Road Surat',
    brand: 'Adani Total',
    location: { type: 'Point', coordinates: [72.8311, 21.1702] },
    address: 'Ring Road, Vesu, Surat',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395007',
    fuelTypes: ['cng', 'petrol', 'diesel'],
    amenities: ['restroom', 'air', 'food', 'parking', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0261-2890123',
    priceList: { petrol: 94.26, diesel: 88.84, cng: 72.50, evPerKwh: 0 },
    rating: 4.3,
    reviewCount: 41,
    isVerified: true
  },

  // ─── VARANASI ─────────────────────────────────────
  {
    name: 'Indian Oil - Lanka Varanasi',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [83.0089, 25.2677] },
    address: 'Lanka, Near BHU, Varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221005',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air'],
    openingHours: { open: '06:00', close: '22:00', is24Hours: false },
    contactPhone: '0542-2367890',
    priceList: { petrol: 94.56, diesel: 87.01, cng: 0, evPerKwh: 0 },
    rating: 3.3,
    reviewCount: 8,
    isVerified: false
  },

  // ─── NAGPUR ───────────────────────────────────────
  {
    name: 'BPCL Station - Sitabuldi Nagpur',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [79.0882, 21.1458] },
    address: 'Sitabuldi, Nagpur',
    city: 'Nagpur',
    state: 'Maharashtra',
    pincode: '440012',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'water', 'shop'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0712-2543210',
    priceList: { petrol: 103.44, diesel: 89.97, cng: 0, evPerKwh: 0 },
    rating: 3.7,
    reviewCount: 14,
    isVerified: true
  },

  // ─── PATNA ────────────────────────────────────────
  {
    name: 'HP Station - Gandhi Maidan Patna',
    brand: 'Hindustan Petroleum (HPCL)',
    location: { type: 'Point', coordinates: [85.1376, 25.6093] },
    address: 'Near Gandhi Maidan, Patna',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air'],
    openingHours: { open: '06:00', close: '22:00', is24Hours: false },
    contactPhone: '0612-2345678',
    priceList: { petrol: 105.49, diesel: 92.41, cng: 0, evPerKwh: 0 },
    rating: 3.2,
    reviewCount: 6,
    isVerified: false
  },

  // ─── DEHRADUN ─────────────────────────────────────
  {
    name: 'Indian Oil - Rajpur Road Dehradun',
    brand: 'Indian Oil (IOCL)',
    location: { type: 'Point', coordinates: [78.0436, 30.3255] },
    address: 'Rajpur Road, Dehradun',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248001',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'food', 'parking'],
    openingHours: { open: '00:00', close: '23:59', is24Hours: true },
    contactPhone: '0135-2654321',
    priceList: { petrol: 94.19, diesel: 87.32, cng: 0, evPerKwh: 0 },
    rating: 4.0,
    reviewCount: 20,
    isVerified: true
  },

  // ─── COIMBATORE ───────────────────────────────────
  {
    name: 'BPCL - RS Puram Coimbatore',
    brand: 'Bharat Petroleum (BPCL)',
    location: { type: 'Point', coordinates: [76.9558, 11.0168] },
    address: 'DB Road, RS Puram, Coimbatore',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641002',
    fuelTypes: ['petrol', 'diesel'],
    amenities: ['restroom', 'air', 'shop'],
    openingHours: { open: '06:00', close: '22:00', is24Hours: false },
    contactPhone: '0422-2445678',
    priceList: { petrol: 100.76, diesel: 92.13, cng: 0, evPerKwh: 0 },
    rating: 4.1,
    reviewCount: 16,
    isVerified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing stations
    await Station.deleteMany({});
    console.log('🗑️  Cleared existing stations');

    // Insert seed data
    const inserted = await Station.insertMany(stations);
    console.log(`✅ Seeded ${inserted.length} stations across ${[...new Set(stations.map(s => s.city))].length} cities`);

    console.log('');
    console.log('Cities covered:');
    const cities = [...new Set(stations.map(s => s.city))].sort();
    cities.forEach(c => {
      const count = stations.filter(s => s.city === c).length;
      console.log(`  📍 ${c}: ${count} stations`);
    });

    console.log('');
    console.log('Fuel type breakdown:');
    ['petrol', 'diesel', 'cng', 'ev'].forEach(ft => {
      const count = stations.filter(s => s.fuelTypes.includes(ft)).length;
      console.log(`  ⛽ ${ft.toUpperCase()}: ${count} stations`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
