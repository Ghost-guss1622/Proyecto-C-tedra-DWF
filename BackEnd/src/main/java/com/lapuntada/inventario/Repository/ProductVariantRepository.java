package com.lapuntada.inventario.Repository;

import com.lapuntada.inventario.Model.ProductVariantModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariantModel, Long> {
    List<ProductVariantModel> findByProduct_id(Long product_id);
}