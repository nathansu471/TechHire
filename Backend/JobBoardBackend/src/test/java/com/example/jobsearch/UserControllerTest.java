package com.example.jobsearch;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllUsers() throws Exception {
        User user2 = User.builder()
                .id(2L)
                .username("user2")
                .password("pass2")
                .build();
        
        List<User> users = Arrays.asList(testUser, user2);
        when(userService.getAllUsers()).thenReturn(users);
        
        mockMvc.perform(get("/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].username", is("testuser")))
                .andExpect(jsonPath("$[1].username", is("user2")));
        
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testGetAllUsersEmpty() throws Exception {
        when(userService.getAllUsers()).thenReturn(Arrays.asList());
        
        mockMvc.perform(get("/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testGetUserById() throws Exception {
        when(userService.getUserById(1L)).thenReturn(testUser);
        
        mockMvc.perform(get("/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.password", is("password123")))
                .andExpect(jsonPath("$.applicationTracker", is("tracker")));
        
        verify(userService, times(1)).getUserById(1L);
    }

    @Test
    void testGetUserByIdNotFound() throws Exception {
        when(userService.getUserById(anyLong())).thenReturn(null);
        
        mockMvc.perform(get("/users/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        
        verify(userService, times(1)).getUserById(999L);
    }

    @Test
    void testCreateUser() throws Exception {
        when(userService.createUser(any(User.class))).thenReturn(testUser);
        
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.password", is("password123")));
        
        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    void testCreateUserWithMinimalData() throws Exception {
        User minimalUser = User.builder()
                .username("newuser")
                .password("newpass")
                .build();
        
        User savedUser = User.builder()
                .id(2L)
                .username("newuser")
                .password("newpass")
                .build();
        
        when(userService.createUser(any(User.class))).thenReturn(savedUser);
        
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(minimalUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.username", is("newuser")));
        
        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    void testUpdateUser() throws Exception {
        User updatedUser = User.builder()
                .id(1L)
                .username("updateduser")
                .password("newpassword")
                .applicationTracker("newtracker")
                .build();
        
        when(userService.updateUser(anyLong(), any(User.class))).thenReturn(updatedUser);
        
        mockMvc.perform(put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.username", is("updateduser")))
                .andExpect(jsonPath("$.password", is("newpassword")))
                .andExpect(jsonPath("$.applicationTracker", is("newtracker")));
        
        verify(userService, times(1)).updateUser(eq(1L), any(User.class));
    }

    @Test
    void testUpdateUserNotFound() throws Exception {
        when(userService.updateUser(anyLong(), any(User.class))).thenReturn(null);
        
        mockMvc.perform(put("/users/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isOk());
        
        verify(userService, times(1)).updateUser(eq(999L), any(User.class));
    }

    @Test
    void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(1L);
        
        mockMvc.perform(delete("/users/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        
        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    void testDeleteMultipleUsers() throws Exception {
        doNothing().when(userService).deleteUser(anyLong());
        
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isOk());
        
        mockMvc.perform(delete("/users/2"))
                .andExpect(status().isOk());
        
        verify(userService, times(1)).deleteUser(1L);
        verify(userService, times(1)).deleteUser(2L);
    }

    @Test
    void testCorsConfiguration() throws Exception {
        when(userService.getAllUsers()).thenReturn(Arrays.asList(testUser));
        
        mockMvc.perform(get("/users")
                .header("Origin", "http://example.com")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }
}