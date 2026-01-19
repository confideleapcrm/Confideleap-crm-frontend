// src/components/Header.tsx
import React from 'react';
import { Search, Bell, Plus, Download } from 'lucide-react';

interface HeaderProps {
  searchValue?: string;
  onSearch?: (v: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchValue = "", onSearch }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor Targeting</h1>
            <p className="text-sm text-gray-500 mt-1">
              Find and engage with the right investors for your portfolio
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search investors..."
                value={searchValue}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;