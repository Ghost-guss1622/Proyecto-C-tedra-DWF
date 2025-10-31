package com.lapuntada.inventario.Controller;


import com.lapuntada.inventario.Config.JwtService;
import com.lapuntada.inventario.DTO.LoginRequest;
import com.lapuntada.inventario.Model.UsersModel;
import com.lapuntada.inventario.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        // Log 1: Qué usuario se está intentando buscar
        System.out.println("--- Intento de Login ---");
        System.out.println("Buscando usuario: " + loginRequest.getUsername());

        Optional<UsersModel> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isEmpty()) {
            // Log 2A: Error si el usuario no existe
            System.out.println("FALLO: Usuario NO encontrado en la base de datos.");
            return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
        }

        UsersModel user = userOptional.get();

        // Log 2B: Muestra qué contraseñas se van a comparar
        System.out.println("Usuario encontrado. ID: " + user.getId());
        System.out.println("Contraseña ingresada (desde el formulario): [" + loginRequest.getPassword() + "]");
        System.out.println("Contraseña en BD (campo 'password'): [" + user.getPassword() + "]");

        // *** LA COMPARACIÓN TEMPORAL ***
        boolean passwordMatches = loginRequest.getPassword().equals(user.getPassword());

        if (!passwordMatches) {
            // Log 3: Error si la contraseña no coincide
            System.out.println("FALLO: Las contraseñas en texto plano NO coinciden.");
            return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
        }

        // Log 4: Login exitoso
        System.out.println("ÉXITO: Login Correcto. Generando Token.");
        // ... el resto del código es igual para generar el token ...

        String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getRol().getNombre() != null ? new java.util.ArrayList<>() : new java.util.ArrayList<>()
        ));

        String role = user.getRol().getNombre().toUpperCase();
        System.out.println("Rol del usuario: " + role);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", role
        ));
    }
}