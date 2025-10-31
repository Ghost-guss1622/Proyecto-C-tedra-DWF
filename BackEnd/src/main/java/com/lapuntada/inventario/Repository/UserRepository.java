package com.lapuntada.inventario.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lapuntada.inventario.Model.UsersModel;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UsersModel, Long> {

    Optional<UsersModel> findByUsername(String username);
}