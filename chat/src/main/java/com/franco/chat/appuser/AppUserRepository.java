package com.franco.chat.appuser;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
	boolean existsByUsernameIgnoreCase(String username);
	Optional<AppUser> findByUsernameIgnoreCase(String username);
}
