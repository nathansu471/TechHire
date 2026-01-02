package com.example.jobsearch;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .password("password123")
                .applicationTracker("tracker")
                .build();
    }

    @Test
    void testSaveUser() {
        User savedUser = userRepository.save(testUser);
        
        assertNotNull(savedUser.getId());
        assertEquals("testuser", savedUser.getUsername());
        assertEquals("password123", savedUser.getPassword());
    }

    @Test
    void testFindById() {
        User savedUser = entityManager.persistAndFlush(testUser);
        
        Optional<User> foundUser = userRepository.findById(savedUser.getId());
        
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
    }

    @Test
    void testFindByUsername() {
        entityManager.persistAndFlush(testUser);
        
        Optional<User> foundUser = userRepository.findByUsername("testuser");
        
        assertTrue(foundUser.isPresent());
        assertEquals("testuser", foundUser.get().getUsername());
        assertEquals("password123", foundUser.get().getPassword());
    }

    @Test
    void testFindByUsernameNotFound() {
        Optional<User> foundUser = userRepository.findByUsername("nonexistent");
        
        assertFalse(foundUser.isPresent());
    }

    @Test
    void testFindAll() {
        User user1 = User.builder()
                .username("user1")
                .password("pass1")
                .build();
        
        User user2 = User.builder()
                .username("user2")
                .password("pass2")
                .build();
        
        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.flush();
        
        assertEquals(2, userRepository.findAll().size());
    }

    @Test
    void testUpdateUser() {
        User savedUser = entityManager.persistAndFlush(testUser);
        
        savedUser.setUsername("updateduser");
        savedUser.setPassword("newpassword");
        User updatedUser = userRepository.save(savedUser);
        
        assertEquals("updateduser", updatedUser.getUsername());
        assertEquals("newpassword", updatedUser.getPassword());
    }

    @Test
    void testDeleteUser() {
        User savedUser = entityManager.persistAndFlush(testUser);
        Long userId = savedUser.getId();
        
        userRepository.deleteById(userId);
        
        Optional<User> deletedUser = userRepository.findById(userId);
        assertFalse(deletedUser.isPresent());
    }

    @Test
    void testUsernameUniqueness() {
        entityManager.persistAndFlush(testUser);
        
        User duplicateUser = User.builder()
                .username("testuser")
                .password("differentpassword")
                .build();
        
        assertThrows(Exception.class, () -> {
            userRepository.save(duplicateUser);
            entityManager.flush();
        });
    }

    @Test
    void testUsernameNotNull() {
        User invalidUser = User.builder()
                .username(null)
                .password("password123")
                .build();
        
        assertThrows(Exception.class, () -> {
            userRepository.save(invalidUser);
            entityManager.flush();
        });
    }

    @Test
    void testPasswordNotNull() {
        User invalidUser = User.builder()
                .username("testuser")
                .password(null)
                .build();
        
        assertThrows(Exception.class, () -> {
            userRepository.save(invalidUser);
            entityManager.flush();
        });
    }
}