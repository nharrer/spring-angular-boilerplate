package com.netzgewitter.demoapi.auth.service;

import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.netzgewitter.demoapi.users.Requests.UsersRequest;
import com.netzgewitter.demoapi.users.model.Users;
import com.netzgewitter.demoapi.users.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UsersRepository usersRepository;

    public Optional<Users> AddUser(UsersRequest user) {
        Users newUser = new Users();
        newUser.setFirst_name(user.getFirst_name());
        newUser.setLast_name(user.getLast_name());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        newUser.setRoles("ROLE_USER");
        return Optional.of(usersRepository.save(newUser));
    }
}
