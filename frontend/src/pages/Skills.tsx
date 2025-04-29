import React, { useState } from 'react';
import { Code2, Wrench, Award, Cpu, Plus, X } from 'lucide-react';
import Button from '../components/Button';
import { useProfile } from '../contexts/ProfileContext';
import { SkillCategory } from '../types';

type CategoryConfig = {
  label: string;
  icon: React.ComponentType<any>;
  colorClass: string;
};

const categoryConfigs: Record<keyof SkillCategory, CategoryConfig> = {
  programming_languages: {
    label: 'Programming Languages',
    icon: Code2,
    colorClass: 'text-blue-500'
  },
  frameworks_and_tools: {
    label: 'Frameworks & Tools',
    icon: Wrench,
    colorClass: 'text-green-500'
  },
  certifications: {
    label: 'Certifications',
    icon: Award,
    colorClass: 'text-purple-500'
  },
  technologies: {
    label: 'Technologies',
    icon: Cpu,
    colorClass: 'text-orange-500'
  }
};

const Skills: React.FC = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof SkillCategory>('programming_languages');
  const [showAddSkill, setShowAddSkill] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !profile) return;
    
    const updatedProfile = {
      ...profile,
      skills: {
        ...profile.skills,
        [selectedCategory]: [...profile.skills[selectedCategory], newSkill.trim()]
      }
    };
    
    await updateProfile(updatedProfile);
    setNewSkill('');
    setShowAddSkill(false);
  };

  const handleRemoveSkill = async (category: keyof SkillCategory, skillToRemove: string) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      skills: {
        ...profile.skills,
        [category]: profile.skills[category].filter(skill => skill !== skillToRemove)
      }
    };
    
    await updateProfile(updatedProfile);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
        <Button
          onClick={() => setShowAddSkill(true)}
          className="flex items-center"
          variant="primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Skill
        </Button>
      </div>

      {showAddSkill && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col space-y-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as keyof SkillCategory)}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
            >
              {Object.entries(categoryConfigs).map(([value, config]) => (
                <option key={value} value={value}>{config.label}</option>
              ))}
            </select>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter skill name"
                className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900"
              />
              <Button onClick={handleAddSkill} variant="primary">
                Add
              </Button>
              <Button onClick={() => setShowAddSkill(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {Object.entries(categoryConfigs).map(([category, config]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {config.label}
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {profile?.skills[category as keyof SkillCategory].map((skill) => (
              <div
                key={skill}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <config.icon className={`h-5 w-5 ${config.colorClass}`} />
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {skill}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(category as keyof SkillCategory, skill)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills; 