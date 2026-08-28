package com.clarityminds.backend.game.dto;

import java.time.LocalDate;

public class PerformancePointResponse {
    private LocalDate date;
    private int score;
    private double accuracy;
    private double completionTime;

    public PerformancePointResponse() {
    }

    public PerformancePointResponse(LocalDate date, int score, double accuracy, double completionTime) {
        this.date = date;
        this.score = score;
        this.accuracy = accuracy;
        this.completionTime = completionTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public double getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(double completionTime) {
        this.completionTime = completionTime;
    }
}

