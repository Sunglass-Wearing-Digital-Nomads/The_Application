package com.itvitae.swdn.repository;

import com.itvitae.swdn.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmailAndDeleted(String email, boolean deleted);

    Optional<User> findByEmail(String email);

    List<User> findAllByEmail(String email);
}
