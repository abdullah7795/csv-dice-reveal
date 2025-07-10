
import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Dice3D from '@/components/Dice3D';

interface TeamMember {
  name: string;
  team_name: string;
}

const Index = () => {
  const [csvData, setCsvData] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [isDiceSpinning, setIsDiceSpinning] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Handle CSV file upload and parsing
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.trim().split('\n');
        
        if (lines.length < 2) {
          toast.error('CSV file must contain at least a header row and one data row');
          return;
        }

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
        
        // Validate headers
        if (!headers.includes('name') || !headers.includes('team_name')) {
          toast.error('CSV must contain exactly "name" and "team_name" columns');
          return;
        }

        const nameIndex = headers.indexOf('name');
        const teamIndex = headers.indexOf('team_name');

        const data: TeamMember[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          if (values.length >= 2 && values[nameIndex] && values[teamIndex]) {
            data.push({
              name: values[nameIndex],
              team_name: values[teamIndex]
            });
          }
        }

        if (data.length === 0) {
          toast.error('No valid data rows found in CSV');
          return;
        }

        setCsvData(data);
        setIsUploaded(true);
        toast.success(`Successfully loaded ${data.length} team members!`);
      } catch (error) {
        toast.error('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  // Start the animation sequence for current team member
  const startSequence = () => {
    if (currentIndex >= csvData.length) {
      setIsComplete(true);
      return;
    }

    // Reset all states
    setShowName(false);
    setShowDice(false);
    setShowTeam(false);
    setShowNext(false);
    setIsDiceSpinning(false);

    // Start name animation
    setTimeout(() => setShowName(true), 300);
    
    // Start dice animation
    setTimeout(() => {
      setShowDice(true);
      setIsDiceSpinning(true);
    }, 800);

    // Stop dice spinning and show team
    setTimeout(() => {
      setIsDiceSpinning(false);
      setTimeout(() => {
        setShowTeam(true);
        setTimeout(() => setShowNext(true), 500);
      }, 200);
    }, 2300); // 800ms delay + 1500ms spin
  };

  // Handle next button click
  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  // Start sequence when index changes
  useEffect(() => {
    if (isUploaded && currentIndex < csvData.length) {
      startSequence();
    } else if (currentIndex >= csvData.length && csvData.length > 0) {
      setIsComplete(true);
    }
  }, [currentIndex, isUploaded, csvData.length]);

  const currentMember = csvData[currentIndex];

  if (!isUploaded) {
    return (
      <div className="min-h-screen bg-[#222] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-gray-800 border-gray-700">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Team Randomizer</h1>
              <p className="text-gray-400">Upload a CSV file with "name" and "team_name" columns</p>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="block w-full py-3 px-4 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg cursor-pointer transition-colors duration-200"
              >
                Choose CSV File
              </label>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• CSV must contain "name" and "team_name" columns</p>
                <p>• First row should be the header</p>
                <p>• Each subsequent row is a team member</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#222] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-gray-800 border-gray-700 text-center">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">All Done! 🎉</h1>
              <p className="text-gray-400">
                Successfully assigned {csvData.length} team members to their teams!
              </p>
            </div>

            <Button
              onClick={() => {
                setCurrentIndex(0);
                setIsComplete(false);
                setIsUploaded(false);
                setCsvData([]);
              }}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
            >
              Upload New File
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222] flex flex-col items-center justify-center p-4 space-y-8">
      {/* Progress indicator */}
      <div className="text-center text-gray-400 text-sm">
        {currentIndex + 1} of {csvData.length}
      </div>

      {/* Name display with typewriter animation */}
      <div className="text-center min-h-[80px] flex items-center">
        {showName && currentMember && (
          <h1 className={`text-4xl md:text-6xl font-bold text-white transition-all duration-1000 ${
            showName ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            {currentMember.name}
          </h1>
        )}
      </div>

      {/* Dice animation */}
      <div className="relative">
        {showDice && (
          <div className={`transition-all duration-500 ${
            showDice ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <Dice3D isSpinning={isDiceSpinning} />
          </div>
        )}
      </div>

      {/* Team name display with dramatic entrance */}
      <div className="text-center min-h-[100px] flex items-center">
        {showTeam && currentMember && (
          <div className={`transition-all duration-800 ${
            showTeam ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-50'
          }`}>
            <div className="bg-[#4CAF50] text-white px-8 py-4 rounded-lg shadow-lg">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-1">Team</p>
              <h2 className="text-2xl md:text-3xl font-bold">{currentMember.team_name}</h2>
            </div>
          </div>
        )}
      </div>

      {/* Next button */}
      <div className="min-h-[60px] flex items-center">
        {showNext && (
          <Button
            onClick={handleNext}
            className={`px-8 py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-all duration-500 ${
              showNext ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default Index;
