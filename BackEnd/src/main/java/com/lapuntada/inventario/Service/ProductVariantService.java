package com.lapuntada.inventario.Service;

import com.lapuntada.inventario.Model.ProductVariantModel;
import com.lapuntada.inventario.Repository.ProductVariantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductVariantService {

    private final ProductVariantRepository repo;

    public ProductVariantService(ProductVariantRepository repo) {
        this.repo = repo;
    }

    public List<ProductVariantModel> listarTodos() {
        return repo.findAll();
    }

    public ProductVariantModel guardar(ProductVariantModel v) {
        return repo.save(v);
    }

    public Optional<ProductVariantModel> obtenerPorId(Long id) {
        return repo.findById(id);
    }

    public List<ProductVariantModel> listarPorProducto(Long productId) {
        return repo.findByProduct_id(productId);
    }

    public void eliminar(Long id) {
        repo.deleteById(id);
    }
}