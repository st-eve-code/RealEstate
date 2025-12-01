import { Unit } from "@/lib/types";

const rooms: Unit[] = [
    {
      id: "1",
      name: "Cozy 2-Bedroom Apartment",
      location: "Yaounde, Center Region",
      type: "apartment",
      price: 150000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/modern-apartment-building-exterior-sunny.jpg"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: [],
      rating: {
        value: 3,
        total: 1
      },
      tags: []
      // beds: 2,
    },
    {
      id: "2",
      name: "Modern Studio Loft",
      location: "Douala, Littoral",
      type: "studio",
      price: 85000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/luxury-studio-apartment-interior.jpg"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "A good room",
      rooms: ["2 bedrooms", "1 toilet"],
      features: ["Wifi", "water"],
      rating: {
        value: 5,
        total: 2
      },
      tags: []
    },
    {
      id: "3",
      name: "Luxury Villa with Pool",
      location: "Kribi, South",
      type: "resort",
      price: 450000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/tropical-villa-with-pool.jpg"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: ["4 beds"],
      rating: {
        value: 5,
        total: 1
      },
      tags: []
    },
    {
      id: "4",
      name: "City Center Condo",
      location: "Yaounde, Bastos",
      type: "apartment",
      price: 200000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/modern-city-condo-building.jpg"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: [],
      rating: {
        value: 3,
        total: 1
      },
      tags: []
    },
    {
      id: "5",
      name: "Seaside Bungalow",
      location: "Limbe, South West",
      type: "resort",
      price: 120000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/beach-bungalow-exterior.jpg"],
      available: false,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: [],
      rating: {
        value: 3,
        total: 1
      },
      tags: []
    },
    {
      id: "6",
      name: "Executive Suite",
      location: "Douala, Bonapriso",
      type: "hotel",
      price: 300000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/luxury-hotel-room.png"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: [],
      rating: {
        value: 3,
        total: 1
      },
      tags: []
    },
    {
      id: "7",
      name: "Family Home Garden",
      location: "Buea, South West",
      type: "apartment",
      price: 95000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/suburban-house-garden.png"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: [],
      rating: {
        value: 3,
        total: 1
      },
      tags: []
    },
    {
      id: "8",
      name: "Downtown Penthouse",
      location: "Yaounde, Center",
      type: "apartment",
      price: 550000,
      currency: "XAF",
      period: "Month",
      imageUrl: ["/luxury-penthouse-living-room.png"],
      available: true,
      building: {
        id: "1",
        name: "sa"
      },
      description: "",
      rooms: [],
      rating: {
        value: 3,
        total: 1
      },
      tags: []
    },
];

export default rooms;