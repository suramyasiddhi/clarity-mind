package com.clarityminds.backend.common.exception;

public class InvalidGameResultException extends RuntimeException {
    public InvalidGameResultException(String message) {
        super(message);
    }
}
