package com.netzgewitter.demoapi.users.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.netzgewitter.demoapi.users.Requests.UsersRequest;
import com.netzgewitter.demoapi.users.model.Users;
import com.netzgewitter.demoapi.users.service.UsersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@PreAuthorize(value = "hasRole('ROLE_ADMIN')")
public class UsersController {

    private final UsersService usersService;

    @GetMapping("")
    public List<Users> GetUsers() {
        return usersService.GetAllUsers();
    }

    @PostMapping("")
    public Users GetUsers(@RequestBody UsersRequest user) {
        return usersService.AddUser(user);
    }

    @GetMapping("test")
    @PreAuthorize(value = "hasRole('ROLE_USER')")
    public Map<String, Object> Principal(Principal principal) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", "Servus");
        map.put("name", principal.getName());
        return map;
    }
}
