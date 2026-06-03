package com.example.jobsearch;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .applicationTracker("tracker")
                .build();
    }

    @Test
    void testGetAllUsers() {
        User user2 = User.builder()
                .id(2L)
                .username("user2")
                .password("pass2")
                .build();
        
        List<User> users = Arrays.asList(testUser, user2);
        when(userRepository.findAll()).thenReturn(users);
        
        List<User> result = userService.getAllUsers();
        
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllUsersEmpty() {
        when(userRepository.findAll()).thenReturn(Arrays.asList());
        
        List<User> result = userService.getAllUsers();
        
        assertEquals(0, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        
        User result = userService.getUserById(1L);
        
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("password123", result.getPassword());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserByIdNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        User result = userService.getUserById(999L);
        
        assertNull(result);
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void testCreateUser() {
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        User result = userService.createUser(testUser);
        
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("password123", result.getPassword());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testUpdateUser() {
        User updatedUser = User.builder()
                .username("updateduser")
                .password("newpassword")
                .applicationTracker("newtracker")
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        User result = userService.updateUser(1L, updatedUser);
        
        assertNotNull(result);
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));

        assertEquals("updateduser", testUser.getUsername());
        assertEquals("newpassword", testUser.getPassword());
        assertEquals("newtracker", testUser.getApplicationTracker());
    }

    @Test
    void testUpdateUserNotFound() {
        User updatedUser = User.builder()
                .username("updateduser")
                .password("newpassword")
                .build();
        
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        User result = userService.updateUser(999L, updatedUser);
        
        assertNull(result);
        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1L);
        
        userService.deleteUser(1L);
        
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteUserMultipleTimes() {
        doNothing().when(userRepository).deleteById(anyLong());
        
        userService.deleteUser(1L);
        userService.deleteUser(2L);
        
        verify(userRepository, times(1)).deleteById(1L);
        verify(userRepository, times(1)).deleteById(2L);
    }

    @Test
    void testUpdateUserPartialUpdate() {
        User partialUpdate = User.builder()
                .username("newusername")
                .password("password123")
                .applicationTracker("tracker")
                .build();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        User result = userService.updateUser(1L, partialUpdate);
        
        assertNotNull(result);
        assertEquals("newusername", testUser.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }
}