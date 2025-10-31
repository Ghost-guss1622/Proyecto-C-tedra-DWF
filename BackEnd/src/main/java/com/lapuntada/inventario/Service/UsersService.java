package com.lapuntada.inventario.Service;

import com.lapuntada.inventario.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersService {

    private final UserRepository repo;

    public UsersService(UserRepository repo) {
        this.repo = repo;
    }

    public Optional<String> login(String username, String password) {
        return repo.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .map(user -> user.getRol().getNombre());
    }
}
