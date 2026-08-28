package com.clarityminds.backend.user.dto;

import jakarta.validation.constraints.Email;

public class UpdateProfileRequest {
    private String displayName;

    @Email(message = "Email must be valid")
    private String email;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String displayName, String email) {
        this.displayName = displayName;
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
