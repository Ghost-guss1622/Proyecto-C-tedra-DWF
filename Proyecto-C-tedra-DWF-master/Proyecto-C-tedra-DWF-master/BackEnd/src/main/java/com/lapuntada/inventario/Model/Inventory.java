package com.lapuntada.inventario.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Integer stock;
    private Double precio;

    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL)
    private List<InventoryMovement> movements;
}
