import { parseISO } from 'date-fns'; // for handling date parsing if needed
import Ride from '../Models/Ride.js';
import haversine from 'haversine'; // Install this package to calculate distance between coordinates
import { response } from 'express';

// Helper function to calculate distance between two coordinates
const calculateDistance = (coord1, coord2) => {
  // Adjust to use objects with `latitude` and `longitude`
  const distance = haversine(
    { latitude: coord1.lat, longitude: coord1.lng },
    { latitude: coord2.lat, longitude: coord2.lng },
    { unit: 'km' }
  );
  return distance;
};

// Helper function to check if any point in the path is within 1 km radius
const isPointInRange = (coordinates, path, radius = 1) => {
  return path.some(point => calculateDistance(coordinates, { lng: point[0], lat: point[1] }) <= radius);
};

export const createRide = async (req, res) => {

  try {
    const {
      from,
      to,
      stopovers,
      availableSeats,
      peopleAlreadyTraveling,
      date,
      time,
      allowPets,
      allowSmoking,
      allowChildren,
      genderRestriction,
      basePrice,
      usePricePerStopover,
      stopoverPrices,
      isVerified,
      path,
      carType,
      USER
    } = req.body;

    // Create a new ride object based on the incoming data
    const newRide = new Ride({
      createdBy: USER._id,
      from: {
        description: from.description,
        location: {
          lat: from.geometry.location.lat,
          lng: from.geometry.location.lng
        }
      },
      to: {
        description: to.description,
        location: {
          lat: to.geometry.location.lat,
          lng: to.geometry.location.lng
        }
      },
      stopovers: stopovers.map(stopover => ({
        description: stopover.description,
        location: {
          lat: stopover.geometry.location.lat,
          lng: stopover.geometry.location.lng
        }
      })),
      availableSeats,
      alreadyOccupiedSeats: peopleAlreadyTraveling,
      when: parseISO(`${date}T${time}`), // Combine date and time
      petsAllowed: allowPets,
      smokingAllowed: allowSmoking,
      childrenAllowed: allowChildren,
      preference: genderRestriction === 'men' ? 'only men' : 'any', // Adjust based on frontend data
      basePrice,
      usePricePerStopover,
      stopoverPrices,
      isVerified,
      carType,
      path
    });

    // Save the new ride to the database
    const savedRide = await newRide.save();
    
    res.status(201).json({
      success: true,
      message: 'Ride created successfully!',
      data: savedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating ride',
      error: error.message
    });
  }
};


export const findRides = async (req, res) => {
  try {
    const { fromCoordinates, toCoordinates, dateTime, passengers } = req.body;
    console.log(fromCoordinates, toCoordinates, dateTime, passengers)
    const userSearchDate = new Date(dateTime);
    const twelveHoursBefore = new Date(userSearchDate.getTime() - 12 * 60 * 60 * 1000);
    const twelveHoursAfter = new Date(userSearchDate.getTime() + 12 * 60 * 60 * 1000);

    // Query the database to find matching rides
    const rides = await Ride.find({
      when: { $gte: twelveHoursBefore, $lte: twelveHoursAfter },
      availableSeats: { $gte: passengers }
    }).populate('createdBy');
    const filteredRides = rides.filter(ride => {
      // Check if the 'from' location or any path point is within 1 km radius
      const fromDistance = calculateDistance(fromCoordinates, ride.from.location);
      const toDistance = calculateDistance(toCoordinates, ride.to.location);
      
      const fromInPath = isPointInRange(fromCoordinates, ride.path);
      const toInPath = isPointInRange(toCoordinates, ride.path);
      
      return (
        (fromDistance <= 1 || fromInPath) && // Starting point or path match within 1 km
        (toDistance <= 1 || toInPath) // Ending point or path match within 1 km
      );
    });
    
    // Sort the results based on feasibility (closer rides, closer time, seat availability)
    const sortedRides = filteredRides.sort((rideA, rideB) => {
      const distanceAFrom = calculateDistance(fromCoordinates, rideA.from.location);
      const distanceATo = calculateDistance(toCoordinates, rideA.to.location);
      const distanceBFrom = calculateDistance(fromCoordinates, rideB.from.location);
      const distanceBTo = calculateDistance(toCoordinates, rideB.to.location);

      const timeDifferenceA = Math.abs(new Date(rideA.when) - userSearchDate);
      const timeDifferenceB = Math.abs(new Date(rideB.when) - userSearchDate);

      if (distanceAFrom !== distanceBFrom) {
        return distanceAFrom - distanceBFrom; // Closer 'from' distance comes first
      } else if (distanceATo !== distanceBTo) {
        return distanceATo - distanceBTo; // Closer 'to' distance comes first
      } else if (timeDifferenceA !== timeDifferenceB) {
        return timeDifferenceA - timeDifferenceB; // Closer time to search time comes first
      } else {
        return rideB.availableSeats - rideA.availableSeats; // More seats available comes first
      }
    });

    return res.status(200).json({ rides: sortedRides });
  } catch (error) {
    console.error('Error finding rides:', error);
    return res.status(500).json({ error: 'An error occurred while finding rides' });
  }
};

export const searchRide = async(req,res) => {
  try {
    const {id} = req.params;
    const ride = await Ride.findById(id).populate('createdBy');
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json(error);
  }
}