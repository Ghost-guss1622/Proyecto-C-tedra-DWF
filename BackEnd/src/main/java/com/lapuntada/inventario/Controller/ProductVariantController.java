package com.lapuntada.inventario.Controller;

import com.lapuntada.inventario.Model.ProductVariantModel;
import com.lapuntada.inventario.Service.ProductVariantService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    private final ProductVariantService service;

    public ProductVariantController(ProductVariantService service) {
        this.service = service;
    }

    // 1. Listar todas las variantes
    @GetMapping
    public ResponseEntity<List<ProductVariantModel>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // 2. Obtener una variante por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {

        var variante = service.obtenerPorId(id);

        if (variante.isPresent()) {
            return ResponseEntity.ok(variante.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Variante no encontrada"));
        }
    } // <-- ¡LLAVE DE CIERRE AGREGADA!

    // 3. Listar variantes por ID de Producto
    @GetMapping("/by-product/{productId}")
    public ResponseEntity<List<ProductVariantModel>> porProducto(@PathVariable Long productId) {
        return ResponseEntity.ok(service.listarPorProducto(productId));
    }

    // 4. Crear nueva variante
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ProductVariantModel variant) {
        try {
            ProductVariantModel saved = service.guardar(variant);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Variante creada exitosamente",
                    "id", saved.getId()
            ));

        } catch (DataIntegrityViolationException e) {
            String detail = e.getMostSpecificCause().getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Error en base de datos: " + detail));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Error al crear variante: " + e.getMessage()));
        }
    }

    // 5. Eliminar variante por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            service.eliminar(id);
            return ResponseEntity.ok(Map.of("message", "Variante eliminada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Error al eliminar: " + e.getMessage()));
        }
    }
}