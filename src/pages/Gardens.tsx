import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import useGardenStore from '../store/useGardenStore';
import PlantCard from '../components/garden/PlantCard';

const Gardens: React.FC = () => {
  const plants = useGardenStore(state => state.plants);
  const gardens = useGardenStore(state => state.gardens);
  const selectedGardenId = useGardenStore(state => state.selectedGardenId);
  const selectGarden = useGardenStore(state => state.selectGarden);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const plantTypes = ['vegetable', 'fruit', 'herb', 'flower', 'shrub', 'tree'];
  
  // Get plants for the selected garden
  const gardenPlants = selectedGardenId 
    ? plants.filter(plant => 
        gardens.find(g => g.id === selectedGardenId)?.plants.some(p => p.plantId === plant.id)
      )
    : plants;
    
  // Filter plants based on search and type
  const filteredPlants = gardenPlants.filter(plant => {
    const matchesSearch = searchTerm.trim() === '' || 
      plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === null || plant.type === filterType;
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-primary-900">Your Gardens</h1>
          <p className="text-gray-600 mt-2">
            Manage your garden spaces and plants
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/gardens/new" className="btn btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Garden
          </Link>
        </div>
      </div>
      
      {/* Garden Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Garden</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => selectGarden(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedGardenId === null
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Plants
          </button>
          {gardens.map(garden => (
            <button
              key={garden.id}
              onClick={() => selectGarden(garden.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGardenId === garden.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {garden.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="relative inline-block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterType || ''}
            onChange={(e) => setFilterType(e.target.value || null)}
            className="input pl-10 appearance-none pr-10"
          >
            <option value="">All Types</option>
            {plantTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Plant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onEdit={(id) => console.log('Edit plant', id)}
            onDelete={(id) => console.log('Delete plant', id)}
          />
        ))}
        
        {/* Add Plant Card */}
        <Link href="/plants/new" className="flex items-center justify-center h-full min-h-[15rem] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="text-center p-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-3 text-sm font-medium text-gray-900">Add Plant</h3>
            <p className="mt-1 text-xs text-gray-500">
              Create a new plant in your garden
            </p>
          </div>
        </Link>
      </div>
      
      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Sprout className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No plants found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding a new plant to your garden"}
          </p>
          <div className="mt-6">
            <Link href="/plants/new" className="btn btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Add New Plant
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gardens;