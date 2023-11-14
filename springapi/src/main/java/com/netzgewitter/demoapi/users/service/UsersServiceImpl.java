package com.netzgewitter.demoapi.users.service;

import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.netzgewitter.demoapi.users.Requests.UsersRequest;
import com.netzgewitter.demoapi.users.model.Users;
import com.netzgewitter.demoapi.users.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UsersServiceImpl implements UsersService {
    private final UsersRepository usersRepository;

    public List<Users> GetAllUsers() {
        return usersRepository.findAll();
    }

    public Users AddUser(UsersRequest user) {
        Users newUser = new Users();
        newUser.setFirst_name(user.getFirst_name());
        newUser.setLast_name(user.getLast_name());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        newUser.setRoles(user.getRoles());
        return usersRepository.save(newUser);
    }
}
