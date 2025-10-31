package com.lapuntada.inventario.service;

import com.lapuntada.inventario.model.Inventory;
import com.lapuntada.inventario.model.InventoryMovement;
import com.lapuntada.inventario.repository.InventoryRepository;
import com.lapuntada.inventario.repository.InventoryMovementRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepo;
    private final InventoryMovementRepository movementRepo;

    public InventoryService(InventoryRepository inventoryRepo, InventoryMovementRepository movementRepo) {
        this.inventoryRepo = inventoryRepo;
        this.movementRepo = movementRepo;
    }

    public Inventory saveInventory(Inventory inventory) {
        if (inventory.getStock() == null) inventory.setStock(0);
        return inventoryRepo.save(inventory);
    }

    public void deleteInventory(Long id) {
        inventoryRepo.deleteById(id);
    }

    public List<Inventory> findAll() {
        return inventoryRepo.findAll();
    }

    public Inventory findById(Long id) {
        return inventoryRepo.findById(id).orElse(null);
    }

    public InventoryMovement addMovement(Long inventoryId, InventoryMovement movement) {
        Inventory inventory = findById(inventoryId);

        movement.setFecha(LocalDateTime.now());
        movement.setInventory(inventory);

        if (movement.getTipo().equalsIgnoreCase("ENTRADA")) {
            inventory.setStock(inventory.getStock() + movement.getCantidad());
        } else {
            inventory.setStock(inventory.getStock() - movement.getCantidad());
        }

        inventoryRepo.save(inventory);
        return movementRepo.save(movement);
    }

    public List<InventoryMovement> getMovements(Long inventoryId) {
        return movementRepo.findByInventoryId(inventoryId);
    }
}
