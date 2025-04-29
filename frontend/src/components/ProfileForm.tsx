import React from 'react';
import { UserProfile, SkillCategory } from '../types';
import Button from './Button';
import Card from './Card';

interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  isLoading?: boolean;
}

const flattenSkills = (skills: SkillCategory): string => {
  return [
    ...skills.programming_languages,
    ...skills.frameworks_and_tools,
    ...skills.certifications,
    ...skills.technologies
  ].join(', ');
};

const categorizeSkills = (skillsString: string): SkillCategory => {
  const skills = skillsString.split(',').map(s => s.trim()).filter(s => s);
  // For simplicity, we'll put all skills in programming_languages category
  // In a real app, you might want to let users choose categories or use AI to categorize
  return {
    programming_languages: skills,
    frameworks_and_tools: [],
    certifications: [],
    technologies: []
  };
};

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = React.useState<UserProfile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skills' 
        ? categorizeSkills(value)
        : name === 'preferred_roles' || name === 'preferred_locations' || name === 'preferred_industries'
        ? value.split(',').map(item => item.trim())
        : name === 'experience_years' || name === 'weekly_application_goal'
        ? Number(value)
        : name === 'remote_preference'
        ? value === 'true'
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              id="skills"
              value={flattenSkills(formData.skills)}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience_years"
              id="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              min="0"
              step="0.5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="weekly_application_goal" className="block text-sm font-medium text-gray-700">
              Weekly Application Goal
            </label>
            <input
              type="number"
              name="weekly_application_goal"
              id="weekly_application_goal"
              value={formData.weekly_application_goal}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="preferred_roles" className="block text-sm font-medium text-gray-700">
              Preferred Roles (comma-separated)
            </label>
            <input
              type="text"
              name="preferred_roles"
              id="preferred_roles"
              value={formData.preferred_roles.join(', ')}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="preferred_locations" className="block text-sm font-medium text-gray-700">
              Preferred Locations (comma-separated)
            </label>
            <input
              type="text"
              name="preferred_locations"
              id="preferred_locations"
              value={formData.preferred_locations.join(', ')}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="preferred_industries" className="block text-sm font-medium text-gray-700">
              Preferred Industries (comma-separated)
            </label>
            <input
              type="text"
              name="preferred_industries"
              id="preferred_industries"
              value={formData.preferred_industries.join(', ')}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="remote_preference" className="block text-sm font-medium text-gray-700">
              Remote Preference
            </label>
            <select
              name="remote_preference"
              id="remote_preference"
              value={formData.remote_preference.toString()}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm; 