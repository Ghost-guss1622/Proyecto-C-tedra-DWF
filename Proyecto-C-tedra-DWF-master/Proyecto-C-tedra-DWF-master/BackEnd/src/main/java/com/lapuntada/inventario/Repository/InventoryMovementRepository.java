package com.lapuntada.inventario.repository;

import com.lapuntada.inventario.model.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    List<InventoryMovement> findByInventoryId(Long inventoryId);
}
