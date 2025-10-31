package com.lapuntada.inventario.Model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@JsonIgnore
@Entity
@Table(name = "app_user")
public class UsersModel {

    private String password;

    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private RolesModel rol;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public RolesModel getRol() { return rol; }
    public void setRol(RolesModel rol) { this.rol = rol; }
}
