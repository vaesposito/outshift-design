const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const siteData = {
  title: 'Outshift Design',
  year: new Date().getFullYear(),
  nav: [
    { label: 'Initiatives', href: '/#initiatives', hasDropdown: true },
    { label: 'About us', href: '/#about', hasDropdown: true },
    { label: 'Blog', href: '/#blog', hasDropdown: false },
  ],
  initiatives: [
    {
      title: 'Designing for the Internet of Agents',
      description: 'Hax: The Framework Guiding Human-Agent Collaboration',
      badge: 'SDK',
      video: '/videos/agents.mp4',
      reversed: false,
    },
    {
      title: 'Internet of Cognition',
      description: 'Enabling agents and humans to scale intelligence collectively.',
      badge: 'AI/ML',
      video: '/videos/cognition.mp4',
      reversed: true,
    },
  ],
  researchCards: [
    {
      title: 'Hax',
      description: 'A research framework for building AI-powered systems with human-centered design principles and ethical considerations at the core.',
      image: '/images/hax-research.png',
      tags: ['AI Research', 'Design Framework', 'Ethics'],
    },
    {
      title: 'Internet of Cognition',
      description: 'Exploring the future of interconnected cognitive systems and their impact on human decision making and collaboration.',
      image: '/images/cognition-research.png',
      tags: ['Cognitive Systems', 'Future Research', 'Collaboration'],
    },
  ],
  blogPosts: [
    {
      title: 'The Future of Design Systems',
      description: 'How we built a scalable design system that powers hundreds of products across the enterprise.',
      author: 'Sarah Chen',
      date: 'March 1, 2026',
      readTime: '5 min read',
    },
    {
      title: 'Designing for Accessibility',
      description: 'Our approach to creating inclusive experiences that work for everyone.',
      author: 'Sarah Chen',
      date: 'March 1, 2026',
      readTime: '5 min read',
    },
    {
      title: 'Remote Collaboration at Scale',
      description: 'Lessons learned from building tools for distributed teams across the globe.',
      author: 'Sarah Chen',
      date: 'March 1, 2026',
      readTime: '5 min read',
    },
  ],
};

app.get('/', (_req, res) => {
  res.render('home', { ...siteData, pageTitle: siteData.title });
});

app.get('/styleguide', (_req, res) => {
  res.render('styleguide', { ...siteData, pageTitle: `${siteData.title} — Style Guide` });
});

app.listen(PORT, () => {
  console.log(`Outshift Design running at http://localhost:${PORT}`);
});
