package com.clarityminds.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class DatabaseConfig {

    static {
        // Ensure data directory exists early before datasource initialization
        File dataDir = new File("./data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
    }

    @PostConstruct
    public void init() {
        File dataDir = new File("./data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
    }
}
