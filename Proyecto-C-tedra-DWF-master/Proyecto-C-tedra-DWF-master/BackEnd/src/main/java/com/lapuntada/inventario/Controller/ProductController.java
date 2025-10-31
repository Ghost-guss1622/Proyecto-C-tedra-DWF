package com.lapuntada.inventario.Controller;

import com.lapuntada.inventario.Model.ProductModel;
import com.lapuntada.inventario.Service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Listar todos los productos
    @GetMapping
    public List<ProductModel> listar() {
        return productService.listarTodos();
    }

    // Registrar un producto
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody ProductModel producto) {
        try {
            // Guardar producto
            ProductModel saved = productService.guardar(producto);

            // DEVOLVER JSON CON EL PRODUCTO REGISTRADO
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "id", saved.getId(),
                    "name", saved.getName(),
                    "description", saved.getDescription(),
                    "category_id", saved.getCategory_id(),
                    "active", saved.getActive(),
                    "created_at", saved.getCreated_at()
            ));
        } catch (Exception e) {
            String errorMessage = "Error desconocido al registrar producto.";

            // Intenta obtener el mensaje de error de la causa principal
            Throwable rootCause = e;
            while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
                rootCause = rootCause.getCause();
            }

            // Si la causa es de SQL (Violación de Constraint/NOT NULL)
            if (rootCause instanceof java.sql.SQLException) {
                errorMessage = "Error en la Base de Datos. Posiblemente un campo (como category_id) es obligatorio o los datos son inválidos. Detalle: " + rootCause.getMessage();
            } else {
                errorMessage = "Error de Servidor: " + rootCause.getMessage();
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error al registrar producto: " + errorMessage));
        }
    }

    // Obtener un producto por ID
    @GetMapping("/{id}")
    public Optional<ProductModel> obtener(@PathVariable Long id) {
        return productService.obtenerPorId(id);
    }

    // Eliminar un producto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            productService.eliminar(id);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error al eliminar producto: " + e.getMessage()));
        }
    }
}