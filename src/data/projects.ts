export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  problem: string
  solution: string
  features: string[]
  architecture: string
  challenges: string
  results: string
  category: string
  year: string
  technologies: string[]
  image: string
  github: string
  live: string
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'blogit',
    title: 'Blogit — Full-Stack Blogging Platform',
    description: 'A full-stack blogging platform with JWT auth, AI-assisted drafting, and CDN-backed image delivery.',
    longDescription:
      'Blogit is a full-stack blogging platform built with React, Node.js, Express, and MongoDB. It supports complete CRUD for posts and comments behind JWT-based authentication, and uses the Google Gemini API to auto-generate blog drafts from a prompt, cutting content-creation time significantly.',
    problem: 'Writers needed a fast, secure place to publish and manage posts without the overhead of a heavyweight CMS, and content creation itself was slow to start from a blank page.',
    solution: 'Built a lightweight MERN-stack platform with JWT auth for secure sessions, Mongoose schemas tuned for scale, and a Gemini-powered draft generator so writers start from AI-generated scaffolding instead of a blank editor.',
    features: [
      'JWT-based authentication with full CRUD for posts and comments',
      'AI-generated blog drafts via the Google Gemini API',
      'MongoDB/Mongoose schemas supporting 10,000+ blog entries with optimized queries',
      'ImageKit-powered image uploads with real-time optimization and CDN delivery',
    ],
    architecture: 'React frontend, Express/Node.js REST API, MongoDB via Mongoose for persistence, ImageKit for media, deployed on Vercel with CI.',
    challenges: 'Designing Mongoose schemas and query patterns that stayed fast and validated correctly at 10,000+ blog entries while keeping the API layer simple.',
    results: 'Trimmed content-creation time by 40% with AI-assisted drafting and streamlined the dev-to-deployment cycle by 30% with a Vercel CI pipeline.',
    category: 'Full Stack',
    year: '2025',
    technologies: ['React', 'Node.js', 'Google Gemini API', 'MongoDB', 'JWT'],
    image: '/projects/blogit-cover.png',
    github: 'https://github.com/kingofthehills',
    live: 'https://blogit-silk.vercel.app',
    featured: true,
  },
  {
    slug: 'movie-discovery-app',
    title: 'Movie Discovery App',
    description: 'A responsive movie search platform with live TMDB results and a real-time trending leaderboard.',
    longDescription:
      'A movie search platform built with React, the TMDB API, Appwrite, and Tailwind CSS. It surfaces real-time search results and a top-10 trending-movies section, backed by search analytics persisted in Appwrite to power the trending logic.',
    problem: 'Movie discovery apps often feel slow or generic — users want fast, relevant search and a sense of what is trending right now.',
    solution: 'Combined live TMDB API responses for search with an Appwrite-backed analytics layer that tracks queries to compute a custom, real-time trending leaderboard.',
    features: [
      'Dynamic, real-time movie search powered by the TMDB API',
      'Top 10 trending-movies section driven by live search analytics',
      'Appwrite backend for persisting and aggregating search data',
      'Fully responsive, cross-device UI focused on fast, intuitive search',
    ],
    architecture: 'React frontend styled with Tailwind CSS, TMDB REST API for movie data, Appwrite as the backend for analytics persistence.',
    challenges: 'Designing a trending algorithm from raw search analytics that stayed accurate and responsive without over-fetching from Appwrite.',
    results: 'Shipped a fast, fully responsive movie discovery experience with a live trending leaderboard driven by real user search activity.',
    category: 'Web App',
    year: '2025',
    technologies: ['React', 'TMDB API', 'Appwrite', 'Tailwind CSS'],
    image: '/projects/movie-discovery-cover.png',
    github: 'https://github.com/kingofthehills',
    live: 'https://movies-website-swart.vercel.app',
    featured: true,
  },
  {
    slug: 'plant-disease-detection',
    title: 'Plant Disease Detection (Deep Learning)',
    description: 'A ResNet101-based deep learning model that classifies leaf diseases across four crop types with 98%+ accuracy.',
    longDescription:
      'A deep learning model built with TensorFlow, Keras, and a ResNet101 architecture to detect and classify diseases in the leaves of bell pepper, tomato, coriander, and lettuce plants, trained on a curated, augmented image dataset.',
    problem: 'Manual identification of plant leaf diseases is slow and error-prone, and farmers often lack quick access to expert diagnosis.',
    solution: 'Applied transfer learning and fine-tuning on a ResNet101 backbone, trained on a curated, class-balanced, and augmented dataset sourced from open agricultural databases.',
    features: [
      'ResNet101-based transfer learning for multi-class leaf disease classification',
      'Curated, class-balanced image dataset across four crop types',
      'Data augmentation and normalization pipeline to improve generalization',
      'Over 98% classification accuracy on labeled leaf disease datasets',
    ],
    architecture: 'Python and TensorFlow/Keras training pipeline using a ResNet101 CNN backbone with transfer learning and fine-tuning on a preprocessed, augmented image dataset.',
    challenges: 'Curating and balancing a high-resolution dataset across four crop types, and tuning augmentation and fine-tuning to avoid overfitting while pushing past 98% accuracy.',
    results: 'Achieved over 98% classification accuracy using transfer learning and fine-tuning with ResNet101 on labeled leaf disease datasets.',
    category: 'Machine Learning',
    year: '2025',
    technologies: ['TensorFlow', 'Keras', 'ResNet101', 'Python'],
    image: '/projects/project-three.svg',
    github: 'https://github.com/kingofthehills',
    live: '',
    featured: false,
  },
]
