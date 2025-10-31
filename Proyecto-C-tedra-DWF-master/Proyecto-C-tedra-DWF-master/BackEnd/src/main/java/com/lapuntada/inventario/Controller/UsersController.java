package com.lapuntada.inventario.Controller;

import com.lapuntada.inventario.Model.UsersModel;
import com.lapuntada.inventario.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UsersController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UsersModel> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsersModel> getUserById(@PathVariable Long id) {
        Optional<UsersModel> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UsersModel user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El nombre de usuario ya existe");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UsersModel userDetails) {
        Optional<UsersModel> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UsersModel user = optionalUser.get();
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setUsername(userDetails.getUsername());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        user.setRole(userDetails.getRole());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }

    @GetMapping("/search")
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = userRepository
                .findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(query, query, pageable);
        return ResponseEntity.ok(result);
    }


}
