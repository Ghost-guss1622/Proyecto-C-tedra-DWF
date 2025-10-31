package com.lapuntada.inventario.repository;

import com.lapuntada.inventario.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {}
