import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Profile, Project, Experience, Skill } from '@/types';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => publicApi.get('/profile').then((r) => r.data.data),
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      publicApi.get('/projects/public').then((r) =>
        (r.data.data || [])
          .sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0))
      ),
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: () =>
      publicApi.get('/experiences/public').then((r) =>
        (r.data.data || [])
          .sort((a: Experience, b: Experience) => (a.order || 0) - (b.order || 0))
      ),
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () =>
      publicApi.get('/skills/public').then((r) =>
        (r.data.data || [])
          .sort((a: Skill, b: Skill) => (a.order || 0) - (b.order || 0))
      ),
  });
}
