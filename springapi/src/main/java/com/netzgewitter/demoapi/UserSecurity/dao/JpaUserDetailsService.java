package com.netzgewitter.demoapi.UserSecurity.dao;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import com.netzgewitter.demoapi.UserSecurity.model.UserSecurity;
import com.netzgewitter.demoapi.users.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Repository
public class JpaUserDetailsService implements UserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usersRepository.findByEmail(email).map(UserSecurity::new)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found!"));
    }
}
