import React from 'react';
import { useProfile } from '../contexts/ProfileContext';
import ProfileForm from '../components/ProfileForm';
import Card from '../components/Card';
import { SkillCategory } from '../types';

const getTotalSkillCount = (skills: SkillCategory): number => {
  return (Object.values(skills) as string[][]).reduce((total, categorySkills) => total + categorySkills.length, 0);
};

const Profile: React.FC = () => {
  const { profile, loading, error, updateProfile } = useProfile();

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

  if (!profile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        No profile found. Please create one.
      </div>
    );
  }

  const handleProfileUpdate = async (updatedProfile: typeof profile) => {
    await updateProfile(updatedProfile);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update your profile information to get better job recommendations.
          </p>
        </div>

        <ProfileForm
          profile={profile}
          onSubmit={handleProfileUpdate}
          isLoading={loading}
        />

        <Card variant="elevated" className="mt-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Statistics</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{profile.experience_years}</p>
                <p className="text-sm text-gray-500">Years of Experience</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{getTotalSkillCount(profile.skills)}</p>
                <p className="text-sm text-gray-500">Skills</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{profile.weekly_application_goal}</p>
                <p className="text-sm text-gray-500">Weekly Application Goal</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 