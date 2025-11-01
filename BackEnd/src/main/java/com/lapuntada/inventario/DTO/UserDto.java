package com.lapuntada.inventario.DTO;

import lombok.Data;

@Data
public class UserDto{
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private String rol;
}
