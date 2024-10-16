import { parseISO } from 'date-fns'; // for handling date parsing if needed
import Ride from '../Models/Ride.js';

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
