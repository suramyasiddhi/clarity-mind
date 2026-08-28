package com.clarityminds.backend.game.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class CompleteSessionRequest {

    @NotNull(message = "score is required")
    @Min(value = 0, message = "score cannot be negative")
    private Integer score;

    @NotNull(message = "accuracy is required")
    @DecimalMin(value = "0.0", message = "accuracy cannot be less than 0")
    @DecimalMax(value = "100.0", message = "accuracy cannot be greater than 100")
    private Double accuracy;

    @NotNull(message = "completionTime is required")
    @DecimalMin(value = "0.0", message = "completionTime cannot be negative")
    private Double completionTime;

    private Map<String, Object> metrics;

    public CompleteSessionRequest() {
    }

    public CompleteSessionRequest(Integer score, Double accuracy, Double completionTime, Map<String, Object> metrics) {
        this.score = score;
        this.accuracy = accuracy;
        this.completionTime = completionTime;
        this.metrics = metrics;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Double getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(Double completionTime) {
        this.completionTime = completionTime;
    }

    public Map<String, Object> getMetrics() {
        return metrics;
    }

    public void setMetrics(Map<String, Object> metrics) {
        this.metrics = metrics;
    }
}

