'use client';

import React, { useState } from 'react';
import { DemographicsForm } from '../../components/DemographicsForm';
import { useRouter } from 'next/navigation';

export default function QuestionnairePage() {
  const router = useRouter();
  const [demographicsData, setDemographicsData] = useState(null);

  const handleDemographicsNext = (data: any) => {
    console.log('Demographics completed:', data);
    setDemographicsData(data);
    alert(`Demographics completed! Birth Year: ${data.birthYear}, Zipcode: ${data.zipcode}, Sex: ${data.sex}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sleep Health Assessment</h1>
          <p className="mt-2 text-gray-600">
            Please answer all questions honestly for the most accurate results.
          </p>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Step 1 of 9</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '11%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">11% Complete</p>
        </div>

        <DemographicsForm 
          onNext={handleDemographicsNext}
          isFirst={true}
        />
      </div>
    </div>
  );
}
