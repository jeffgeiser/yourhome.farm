import React from 'react';
import { Plant } from '../../types';
import { Droplets, Sun, Trash2, Edit, Clock } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

interface PlantCardProps {
  plant: Plant;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onEdit, onDelete }) => {
  const getGrowthStageColor = (stage: string) => {
    switch (stage) {
      case 'seed': return 'bg-gray-100 text-gray-800';
      case 'seedling': return 'bg-lime-100 text-lime-800';
      case 'vegetative': return 'bg-green-100 text-green-800';
      case 'flowering': return 'bg-purple-100 text-purple-800';
      case 'fruiting': return 'bg-orange-100 text-orange-800';
      case 'harvesting': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSunlightIcon = (requirement: string) => {
    switch (requirement) {
      case 'full-sun': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'partial-sun': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'partial-shade': return <Sun className="h-4 w-4 text-gray-400" />;
      case 'full-shade': return <Sun className="h-4 w-4 text-gray-500" />;
      default: return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getDaysPlanted = () => {
    const planted = parseISO(plant.plantedDate);
    return differenceInDays(new Date(), planted);
  };

  return (
    <div className="card hover:shadow-lg animate-grow-once">
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img 
          src={plant.imageUrl || 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg'} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getGrowthStageColor(plant.growthStage)}`}>
            {plant.growthStage.charAt(0).toUpperCase() + plant.growthStage.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 leading-tight">{plant.name}</h3>
          <span className="text-xs text-primary-800 bg-primary-50 px-2 py-1 rounded-full">
            {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
          </span>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1 text-gray-500" />
          <span>Planted {getDaysPlanted()} days ago</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <Droplets className="h-4 w-4 mr-1 text-blue-500" />
            <span>Every {plant.wateringSchedule} days</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            {getSunlightIcon(plant.sunlight)}
            <span className="ml-1">{plant.sunlight.replace('-', ' ')}</span>
          </div>
        </div>
        
        {plant.notes && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2">{plant.notes}</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-end space-x-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(plant.id)} 
              className="p-1 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100"
            >
              <Edit className="h-5 w-5" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(plant.id)} 
              className="p-1 rounded-full text-gray-500 hover:text-error-600 hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;