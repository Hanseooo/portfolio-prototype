export type ProjectInfo = {
  id: string;
  name: string;
  description: string;
  github?: string | null;
  hostedUrl?: string | null;
  images: string[]; 
  tech: string[]; 
};
