package com.lapuntada.inventario.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo; // ENTRADA or SALIDA
    private Integer cantidad;
    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;
}
