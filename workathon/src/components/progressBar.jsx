import React, { useEffect, useRef } from 'react';
import './ProgressBar.css';

const ProgressBar = ({
  totalPoints,
  currentPoints = 0,
  milestones = [],
  onMilestoneHit
}) => {
  const triggeredMilestonesRef = useRef(new Set());

  // Check milestones whenever currentPoints changes
  useEffect(() => {
    milestones.forEach(({ value, label }) => {
      if (currentPoints >= value && !triggeredMilestonesRef.current.has(value)) {
        triggeredMilestonesRef.current.add(value);
        onMilestoneHit && onMilestoneHit({ value, label });
      }
    });
  }, [currentPoints, milestones, onMilestoneHit]);

  // Convert currentPoints to a percentage
  const progressPercent = Math.min(
    (currentPoints / totalPoints) * 100,
    100
  ).toFixed(2);

  return (
    <div className="reward-progress-bar-container">
      <div className="reward-progress-bar-info">
        <span>{`Points: ${currentPoints} / ${totalPoints}`}</span>
      </div>

      <div className="reward-progress-bar-track">
        <div
          className="reward-progress-bar-fill"
          style={{ height: `${progressPercent}%` }}
        />
        {milestones.map((milestone) => {
          let milestonePercent = (milestone.value / totalPoints) * 100;
          if (milestonePercent <= 0) {milestonePercent = 1};
          if (milestonePercent >= 100) {milestonePercent = 99};
          return (
            <div
              key={milestone.value}
              className="reward-progress-bar-milestone"
              style={{ bottom: `${milestonePercent}%` }}
            >
              <span className="milestone-label">{milestone.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
