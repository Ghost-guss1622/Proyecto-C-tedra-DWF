package com.lapuntada.inventario.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class RolesModel {

    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}