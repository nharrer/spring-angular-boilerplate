package com.netzgewitter.demoapi.users.service;

import java.util.List;

import com.netzgewitter.demoapi.users.Requests.UsersRequest;
import com.netzgewitter.demoapi.users.model.Users;

public interface UsersService {
    public List<Users> GetAllUsers();

    public Users AddUser(UsersRequest user);
}
