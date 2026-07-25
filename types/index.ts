export * from './database';

export type AdminSection =
  | 'dashboard'
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'certificates'
  | 'hackathons'
  | 'resume'
  | 'seo'
  | 'settings';

export interface FormErrorState {
  message: string;
}
