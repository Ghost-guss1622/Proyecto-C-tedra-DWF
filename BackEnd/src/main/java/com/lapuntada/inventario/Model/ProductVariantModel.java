package com.lapuntada.inventario.Model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variant")
public class ProductVariantModel implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Producto (Clave Foránea)
    // Usamos @JsonProperty para que el JSON entrante use "product_id"
    @Column(name = "product_id", nullable = false)
    @JsonProperty("product_id")
    private Long product_id;

    @Column(nullable = false, length = 50, unique = true)
    private String sku; // Stock Keeping Unit

    @Column(length = 20)
    private String size;

    @Column(length = 50)
    private String color;

    // Se recomienda usar BigDecimal para manejar precios y costos
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(length = 100)
    private String barcode;

    @Column(nullable = false)
    private Boolean active = true;

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProduct_id() { return product_id; }
    public void setProduct_id(Long product_id) { this.product_id = product_id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}