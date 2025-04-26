import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const RecommendationsWidget: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      title: "Plant lettuce varieties now",
      description: "Based on your soil type and sun exposure, lettuce varieties would thrive in your garden.",
      confidence: 95,
    },
    {
      id: 2,
      title: "Peppers in sunny location",
      description: "Your climate is perfect for growing peppers during this season.",
      confidence: 90,
    },
    {
      id: 3,
      title: "Add marigolds with tomatoes",
      description: "Companion planting suggestion: marigolds near your tomatoes will help repel pests.",
      confidence: 85,
    },
  ];
  
  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Lightbulb className="h-5 w-5 text-primary-600" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">AI Recommendations</h3>
        </div>
        <Link href="/recommendations" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4 space-y-4">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all">
            <div className="flex items-start">
              <div className="mr-3 p-2 bg-primary-50 rounded-full">
                <Lightbulb className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-900">{recommendation.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{recommendation.description}</p>
                
                <div className="mt-2 flex items-center">
                  <div className="flex-grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-600 rounded-full" 
                      style={{ width: `${recommendation.confidence}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-700">{recommendation.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsWidget;