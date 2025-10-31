package com.lapuntada.inventario.Repository;

import com.lapuntada.inventario.Model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductModel, Long> {
}
