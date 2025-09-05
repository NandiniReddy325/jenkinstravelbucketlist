package com.klef.dev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "travel_places")
public class TravelPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String destination;
    private String country;
    private String notes;
    private String visited;

    public TravelPlace() {
        // ✅ required default constructor
    }

    // Getters & setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getVisited() { return visited; }
    public void setVisited(String visited) { this.visited = visited; }
}
