import React, { useRef, useEffect } from 'react';

interface SpinningWheelProps {
  isSpinning: boolean;
  teams: string[];
  selectedTeam: string;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ isSpinning, teams, selectedTeam }) => {
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wheelRef.current) return;

    if (isSpinning) {
      const selectedIndex = teams.indexOf(selectedTeam);
      const segmentAngle = 360 / teams.length;
      
      // Calculate final angle to land on selected team (pointing at top)
      const targetAngle = -(selectedIndex * segmentAngle) + (segmentAngle / 2);
      
      // Add multiple full rotations for dramatic effect
      const fullRotations = 10 + Math.random() * 5; // 10-15 full rotations
      const finalAngle = targetAngle + (fullRotations * 360);

      // Reset initial position
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = 'rotate(0deg)';
      
      // Force reflow
      wheelRef.current.offsetHeight;

      // Apply the spinning animation
      wheelRef.current.style.transition = 'transform 10s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;
    }
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

  const segmentAngle = 360 / teams.length;

  return (
    <div className="relative w-80 h-80">
      {/* Pointer - Fixed triangular pointer at top */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-red-600 filter drop-shadow-lg"></div>
      </div>
      
      {/* Wheel */}
      <div 
        ref={wheelRef}
        className="w-full h-full rounded-full border-4 border-white shadow-2xl relative"
        style={{ 
          background: 'white'
        }}
      >
        {/* Individual segments */}
        {teams.map((team, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const color = getSegmentColor(index);
          
          return (
            <div
              key={team}
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                clipPath: `polygon(50% 50%, 
                  ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, 
                  ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`
              }}
            >
              <div 
                className="w-full h-full"
                style={{ backgroundColor: color }}
              >
                {/* Team name */}
                <div
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    transform: `rotate(${startAngle + segmentAngle / 2}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div 
                    className="text-white font-bold text-lg px-2 py-1 rounded whitespace-nowrap"
                    style={{
                      transform: 'translateY(-100px) rotate(0deg)',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {team}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-400 shadow-lg z-10"></div>
    </div>
  );
};

export default SpinningWheel;