package com.lapuntada.inventario.Service;

import com.lapuntada.inventario.Model.ProductModel;
import com.lapuntada.inventario.Repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductModel> listarTodos() {
        return productRepository.findAll();
    }

    public ProductModel guardar(ProductModel producto) {
        return productRepository.save(producto);
    }

    public Optional<ProductModel> obtenerPorId(Long id) {
        return productRepository.findById(id);
    }

    public void eliminar(Long id) {
        productRepository.deleteById(id);
    }

    public List<ProductModel> listarHistorial() {
        return productRepository.findAll(); // podrías filtrar por fecha o active=false
    }
}