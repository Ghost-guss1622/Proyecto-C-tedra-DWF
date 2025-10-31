package com.lapuntada.inventario.mapper;

import com.lapuntada.inventario.model.User;
import com.lapuntada.inventario.dto.UserDTO;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setCorreo(user.getCorreo());
        dto.setRol(user.getRol());
        return dto;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserDTO>> searchUsers(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<User> usersPage = userRepository
                .findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(query, query, pageable);

        Page<UserDTO> dtoPage = usersPage.map(UserMapper::toDTO);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(UserMapper.toDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }
    
}
