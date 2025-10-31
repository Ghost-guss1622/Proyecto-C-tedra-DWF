package com.lapuntada.inventario.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
}
