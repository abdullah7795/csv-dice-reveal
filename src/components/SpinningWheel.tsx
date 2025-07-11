import React, { useRef, useEffect } from 'react';

interface SpinningWheelProps {
  isSpinning: boolean;
  teams: string[];
  selectedTeam: string;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ isSpinning, teams, selectedTeam }) => {
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wheelRef.current || !isSpinning) return;

    const selectedIndex = teams.indexOf(selectedTeam);
    const segmentAngle = 360 / teams.length;
    
    // Calculate final angle to land on selected team (center of segment)
    const targetAngle = -(selectedIndex * segmentAngle) - (segmentAngle / 2);
    
    // Add multiple full rotations for dramatic effect
    const fullRotations = 10 + Math.random() * 5; // 10-15 full rotations
    const finalAngle = targetAngle + (fullRotations * 360);

    // Apply the spinning animation
    wheelRef.current.style.transition = 'transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

    // Reset after animation
    const timeout = setTimeout(() => {
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none';
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isSpinning, teams, selectedTeam]);

  // Generate colors for each team
  const getSegmentColor = (index: number) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="relative w-80 h-80">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
      </div>
      
      {/* Wheel */}
      <div 
        ref={wheelRef}
        className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden"
        style={{ 
          background: `conic-gradient(${teams.map((_, index) => 
            `${getSegmentColor(index)} ${(index / teams.length) * 360}deg ${((index + 1) / teams.length) * 360}deg`
          ).join(', ')})`
        }}
      >
        {teams.map((team, index) => {
          const angle = (360 / teams.length) * index;
          const textAngle = angle + (360 / teams.length) / 2;
          
          return (
            <div
              key={team}
              className="absolute w-full h-full flex items-center justify-center"
              style={{
                transform: `rotate(${textAngle}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <div 
                className="text-white font-bold text-lg px-2 py-1 rounded"
                style={{
                  transform: 'translateY(-120px)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}
              >
                {team}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-400 shadow-lg"></div>
    </div>
  );
};

export default SpinningWheel;