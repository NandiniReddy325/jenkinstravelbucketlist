package com.klef.dev.service;

import java.util.List;
import com.klef.dev.entity.TravelPlace;

public interface TravelPlaceService {
    TravelPlace addPlace(TravelPlace place);
    List<TravelPlace> getAllPlaces();
    TravelPlace getPlaceById(int id);
    TravelPlace updatePlace(TravelPlace place);
    void deletePlaceById(int id);
}
