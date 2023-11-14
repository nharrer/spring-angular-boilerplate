package com.netzgewitter.demoapi.auth.controller;

import java.security.Principal;
import java.util.ArrayList;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.netzgewitter.demoapi.UserSecurity.dao.JpaUserDetailsService;
import com.netzgewitter.demoapi.UserSecurity.model.UserSecurity;
import com.netzgewitter.demoapi.auth.request.AuthenticationRequest;
import com.netzgewitter.demoapi.auth.service.AuthService;
import com.netzgewitter.demoapi.config.JwtUtils;
import com.netzgewitter.demoapi.users.Requests.UsersRequest;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final JpaUserDetailsService jpaUserDetailsService;

    private final JwtUtils jwtUtils;

    private final AuthService authService;

    @PostMapping(value = "/authenticate", produces = "text/plain")
    public ResponseEntity<String> authenticate(@RequestBody AuthenticationRequest request,
            HttpServletResponse response) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword(), new ArrayList<>()));

            final UserDetails user = jpaUserDetailsService.loadUserByUsername(request.getEmail());
            if (user != null) {
                String jwt = jwtUtils.generateToken(user);
                Cookie cookie = new Cookie("jwt", jwt);
                cookie.setMaxAge(7 * 24 * 60 * 60); // expires in 7 days
                // cookie.setSecure(true);
                cookie.setHttpOnly(true);
                cookie.setPath("/"); // Global
                response.addCookie(cookie);
                return ResponseEntity.ok(jwt);
            }
            return ResponseEntity.status(400).body("Error authenticating");
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(400).body("" + e.getMessage());
        }
    }

    // @PreAuthorize(value = "hasRole('ROLE_ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<UserSecurity> register(@RequestBody UsersRequest user) throws Exception {
        return ResponseEntity.ok(authService.AddUser(user).map(UserSecurity::new)
                .orElseThrow(() -> new Exception("Unknown")));
    }

    @GetMapping(value = "/user", produces = "text/plain")
    public ResponseEntity<String> user(Principal principal) throws Exception {
        if (principal != null) {
            return ResponseEntity.ok(principal.getName());
        }
        return ResponseEntity.status(400).body("No Principal");
    }
}
