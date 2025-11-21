import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useGameSessionStore } from '../../stores/gameSessionStore';
import { COMPLETE_GAME } from '../../graphql/mutations/completeGame';
import { GET_LEADERBOARD } from '../../graphql/queries/getLeaderboard';
import { GET_PLAYER_STATS } from '../../graphql/queries/getPlayerStats';
import styles from './GameSummary.module.scss';

export const GameSummary: React.FC = () => {
  const navigate = useNavigate();
  const { session, clearSession } = useGameSessionStore();
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [completeGame] = useMutation(COMPLETE_GAME);
  
  const { data: leaderboardData } = useQuery(GET_LEADERBOARD, {
    variables: { 
      region: session?.region, 
      mode: session?.mode, 
      limit: 10 
    },
    skip: !session
  });

  const { data: statsData } = useQuery(GET_PLAYER_STATS);

  if (!session) {
    navigate('/');
    return null;
  }

  const handleSubmitScore = async () => {
    if (!username.trim()) return;
    
    try {
      await completeGame({
        variables: {
          sessionId: session.id,
          username: username.trim()
        },
        refetchQueries: ['GetLeaderboard', 'GetPlayerStats']
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  const handlePlayAgain = () => {
    clearSession();
    navigate(`/game?region=${session.region}&mode=${session.mode}`);
  };

  const handleMainMenu = () => {
    clearSession();
    navigate('/');
  };

  const completedRounds = session.rounds.filter(r => r.points !== null);
  const averageDistance = completedRounds.length > 0
    ? completedRounds.reduce((sum, r) => sum + (r.distance || 0), 0) / completedRounds.length
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <h1 className={styles.title}>Game Complete!</h1>
        
        <div className={styles.scoreSection}>
          <div className={styles.totalScore}>
            <span className={styles.label}>Total Score</span>
            <span className={styles.value}>{session.totalScore.toLocaleString()}</span>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Avg Distance</span>
              <span className={styles.statValue}>{averageDistance.toFixed(1)} km</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Region</span>
              <span className={styles.statValue}>{session.region}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Mode</span>
              <span className={styles.statValue}>{session.mode}</span>
            </div>
          </div>
        </div>

        <div className={styles.roundsSection}>
          <h2>Round Breakdown</h2>
          <div className={styles.roundsList}>
            {session.rounds.map((round) => (
              <div key={round.roundNumber} className={styles.roundItem}>
                <span className={styles.roundNumber}>Round {round.roundNumber}</span>
                <span className={styles.roundLocation}>{round.locationName || 'Unknown'}</span>
                <span className={styles.roundDistance}>
                  {round.distance ? `${round.distance.toFixed(1)} km` : '-'}
                </span>
                <span className={styles.roundPoints}>
                  {round.points !== null ? `${round.points} pts` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {!submitted && (
          <div className={styles.usernameSection}>
            <h3>Save to Leaderboard</h3>
            <div className={styles.usernameInput}>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
              />
              <button onClick={handleSubmitScore} disabled={!username.trim()}>
                Submit
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <div className={styles.submittedMessage}>
            ✓ Score submitted to leaderboard!
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={handlePlayAgain}>
            Play Again
          </button>
          <button className={styles.secondaryButton} onClick={handleMainMenu}>
            Main Menu
          </button>
        </div>
      </div>

      <div className={styles.sidebar}>
        {statsData?.playerStats && (
          <div className={styles.statsCard}>
            <h2>Your Stats</h2>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <span>Total Games</span>
                <span>{statsData.playerStats.totalGames}</span>
              </div>
              <div className={styles.statItem}>
                <span>Best Score</span>
                <span>{statsData.playerStats.bestScore.toLocaleString()}</span>
              </div>
              <div className={styles.statItem}>
                <span>Avg Score</span>
                <span>{Math.round(statsData.playerStats.averageScore).toLocaleString()}</span>
              </div>
              <div className={styles.statItem}>
                <span>Avg Distance</span>
                <span>{statsData.playerStats.averageDistance.toFixed(1)} km</span>
              </div>
            </div>
          </div>
        )}

        {leaderboardData?.leaderboard && (
          <div className={styles.leaderboardCard}>
            <h2>Leaderboard</h2>
            <div className={styles.leaderboardList}>
              {leaderboardData.leaderboard.map((entry: any, index: number) => (
                <div key={entry.id} className={styles.leaderboardItem}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.username}>{entry.username}</span>
                  <span className={styles.score}>{entry.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
