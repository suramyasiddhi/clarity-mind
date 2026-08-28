package com.clarityminds.backend.game.repository;

import com.clarityminds.backend.game.entity.Game;
import com.clarityminds.backend.game.enums.GameCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByCode(String code);
    List<Game> findAllByActiveTrue();
    List<Game> findByActiveTrueOrderByDisplayOrderAsc();
    List<Game> findAllByCategoryAndActiveTrue(GameCategory category);
}
