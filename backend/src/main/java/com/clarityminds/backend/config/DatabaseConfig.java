package com.clarityminds.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    static {
        // Ensure local data directory exists early before SQLite datasource connects
        File dataDir = new File("./data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
    }

    @PostConstruct
    public void init() {
        File dbFile = new File("./data/clarity-minds.db");
        log.info("===============================================================================");
        log.info(" SQLite Local File Database connected at: {}", dbFile.getAbsolutePath());
        log.info("===============================================================================");
    }
}
