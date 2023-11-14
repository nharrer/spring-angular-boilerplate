package com.netzgewitter.demoapi.auth.service;

import java.util.Optional;

import com.netzgewitter.demoapi.users.Requests.UsersRequest;
import com.netzgewitter.demoapi.users.model.Users;

public interface AuthService {
    public Optional<Users> AddUser(UsersRequest user);
}
