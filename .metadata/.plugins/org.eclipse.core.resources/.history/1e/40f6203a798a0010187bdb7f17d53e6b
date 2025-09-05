package com.klef.dev.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.klef.dev.entity.TravelPlace;
import com.klef.dev.repository.TravelPlaceRepository;

@Service
public class TravelPlaceServiceImpl implements TravelPlaceService {

    @Autowired
    private TravelPlaceRepository repo;

    @Override
    public TravelPlace addPlace(TravelPlace place) {
        return repo.save(place);
    }

    @Override
    public List<TravelPlace> getAllPlaces() {
        return repo.findAll();
    }

    @Override
    public TravelPlace getPlaceById(int id) {
        Optional<TravelPlace> opt = repo.findById(id);
        return opt.orElse(null);
    }

    @Override
    public TravelPlace updatePlace(TravelPlace place) {
        return repo.save(place);
    }

    @Override
    public void deletePlaceById(int id) {
        repo.deleteById(id);
    }
}
