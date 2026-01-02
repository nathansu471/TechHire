package com.example.jobsearch;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
    }

    @Test
    void testUserCreationWithNoArgsConstructor() {
        assertNotNull(user);
        assertNull(user.getId());
        assertNull(user.getUsername());
        assertNull(user.getPassword());
    }

    @Test
    void testUserCreationWithAllArgsConstructor() {
        List<SearchHistory> searchHistory = new ArrayList<>();
        User user = new User(1L, "testuser", "password123", searchHistory, "tracker");
        
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("password123", user.getPassword());
        assertEquals(searchHistory, user.getSearchHistory());
        assertEquals("tracker", user.getApplicationTracker());
    }

    @Test
    void testUserBuilder() {
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .applicationTracker("tracker")
                .build();
        
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("password123", user.getPassword());
        assertEquals("tracker", user.getApplicationTracker());
    }

    @Test
    void testSettersAndGetters() {
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setApplicationTracker("tracker");
        
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("password123", user.getPassword());
        assertEquals("tracker", user.getApplicationTracker());
    }

    @Test
    void testSearchHistoryRelationship() {
        List<SearchHistory> searchHistory = new ArrayList<>();
        user.setSearchHistory(searchHistory);
        
        assertNotNull(user.getSearchHistory());
        assertEquals(0, user.getSearchHistory().size());
    }

    @Test
    void testEqualsAndHashCode() {
        User user1 = User.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .build();
        
        User user2 = User.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .build();
        
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());
    }

    @Test
    void testToString() {
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        
        String userString = user.toString();
        assertNotNull(userString);
        assertTrue(userString.contains("testuser"));
    }
}