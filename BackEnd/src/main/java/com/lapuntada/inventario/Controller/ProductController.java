package com.lapuntada.inventario.Controller;

import com.lapuntada.inventario.Model.ProductModel;
import com.lapuntada.inventario.Service.ProductService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(productService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody ProductModel producto) {
        try {
            ProductModel saved = productService.guardar(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Producto registrado correctamente.",
                    "id", saved.getId(),
                    "name", saved.getName()
            ));
        } catch (DataIntegrityViolationException e) {
            String detail = e.getMostSpecificCause().getMessage();
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error de base de datos: Verifique los datos. Detalle: " + detail));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error al registrar producto: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        var productoOptional = productService.obtenerPorId(id);
        if (productoOptional.isPresent()) {
            return ResponseEntity.ok(productoOptional.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Producto no encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            productService.eliminar(id);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error al eliminar producto: " + e.getMessage()));
        }
    }
}