import React from 'react';
import { Garden } from '../../types';
import { Sprout, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useGardenStore from '../../store/useGardenStore';

interface GardensWidgetProps {
  gardens: Garden[];
}

const GardensWidget: React.FC<GardensWidgetProps> = ({ gardens }) => {
  const plants = useGardenStore(state => state.plants);
  
  const getPlantCountInGarden = (garden: Garden) => {
    return garden.plants.length;
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Sprout className="h-5 w-5 text-primary-600" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">Your Gardens</h3>
        </div>
        <Link to="/gardens" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {gardens.map((garden) => (
            <div key={garden.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all">
              <h4 className="text-lg font-medium text-gray-900">{garden.name}</h4>
              
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{garden.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Plants</p>
                  <p className="font-medium">{getPlantCountInGarden(garden)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Size</p>
                  <p className="font-medium">{garden.size.width} × {garden.size.length} {garden.size.unit}</p>
                </div>
              </div>
              
              <div className="mt-3">
                {garden.plants.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {garden.plants.slice(0, 3).map((plantInGarden) => {
                      const plantDetails = plants.find(p => p.id === plantInGarden.plantId);
                      return plantDetails ? (
                        <div 
                          key={plantInGarden.plantId} 
                          className="bg-primary-50 text-primary-800 text-xs px-2 py-1 rounded-full"
                        >
                          {plantDetails.name}
                        </div>
                      ) : null;
                    })}
                    {garden.plants.length > 3 && (
                      <div className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{garden.plants.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No plants added yet</p>
                )}
              </div>
              
              <div className="mt-4">
                <Link to={`/gardens/${garden.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Garden
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Link to="/gardens/new" className="btn btn-outline w-full flex items-center justify-center">
            <Sprout className="h-4 w-4 mr-2" />
            Create New Garden
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GardensWidget;