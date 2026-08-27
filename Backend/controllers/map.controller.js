const mapService = require('../services/map.service');
const {validationResult} = require('express-validator');

module.exports.getCoordinates = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const address = req.query;

    try{
        console.log("Address received:", address);
        const coordinates = await mapService.getAddressCoordinate(address.address);
        console.log("Coordinates fetched:", coordinates);
        res.status(200).json(coordinates);
    }catch(err){
        res.status(500).json({msg: 'Internal Server Error'});
    }
};

module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {origin, destination} = req.query;
    try{
        const result = await mapService.getDistanceAndTime(origin, destination);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({msg: 'Internal Server Error'});
    }

}

module.exports.getAutoCompleteSuggestion = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { text } = req.query;
        const suggestion = await mapService.autocompleteSuggestion(text);
        res.status(200).json(suggestion);
    } catch (err) {
        console.error("Error in autocomplete controller:", err);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports.getRoute = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { origin, destination } = req.query;
        const route = await mapService.getRoute(origin, destination);
        res.status(200).json(route);
    } catch (err) {
        console.error("Error in getRoute controller:", err);
        res.status(500).json({ msg: err.message || 'Internal server error' });
    }
};