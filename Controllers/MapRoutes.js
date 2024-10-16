import axios from "axios";
export const placeSuggestions = async(req,res)=>{
    try {
        const {location} = req.params;
        const {data} = await axios.get(`https://api.olamaps.io/places/v1/autocomplete?input=${location}&api_key=${process.env.OLA_MAP_KEY}`);
       
        res.status(200).json({suggestions:data.predictions.map(location => ({
            description: location.description,
            geometry: location.geometry
          }))});
    } catch (error) {
        res.status(400).json(error);
        
    }
}