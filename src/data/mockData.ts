export interface Investor {
  id: string;
  name: string;
  firm: string;
  role: string;
  location: string;
  portfolioSize: string;
  averageInvestment: string;
  sectors: string[];
  stages: string[];
  portfolioFit: number;
  email: string;
  phone: string;
  linkedin: string;
  recentInvestments: string[];
  status: 'warm' | 'cold' | 'hot' | 'contacted';
  avatar: string;
}

export const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Michael Chen',
    firm: 'Andreessen Horowitz',
    role: 'Partner',
    location: 'San Francisco, CA',
    portfolioSize: '120+ companies',
    averageInvestment: '$5M-$25M',
    sectors: ['FinTech', 'SaaS', 'AI/ML'],
    stages: ['Series A', 'Series B'],
    portfolioFit: 92,
    email: 'mchen@a16z.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/michaelchen',
    recentInvestments: ['Stripe (Series C)', 'Coinbase (Series B)', 'Plaid (Series A)'],
    status: 'hot',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    firm: 'Sequoia Capital',
    role: 'Principal',
    location: 'Menlo Park, CA',
    portfolioSize: '85+ companies',
    averageInvestment: '$10M-$50M',
    sectors: ['HealthTech', 'Biotech', 'AI/ML'],
    stages: ['Series B', 'Series C'],
    portfolioFit: 88,
    email: 'swilliams@sequoiacap.com',
    phone: '+1 (555) 234-5678',
    linkedin: 'linkedin.com/in/sarahwilliams',
    recentInvestments: ['23andMe (Series D)', 'Moderna (Series C)', 'Recursion (Series B)'],
    status: 'warm',
    avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    firm: 'Kleiner Perkins',
    role: 'General Partner',
    location: 'Palo Alto, CA',
    portfolioSize: '200+ companies',
    averageInvestment: '$2M-$15M',
    sectors: ['EdTech', 'Consumer', 'Enterprise'],
    stages: ['Seed', 'Series A'],
    portfolioFit: 76,
    email: 'drodriguez@kpcb.com',
    phone: '+1 (555) 345-6789',
    linkedin: 'linkedin.com/in/davidrodriguez',
    recentInvestments: ['Coursera (Series A)', 'Udemy (Seed)', 'MasterClass (Series B)'],
    status: 'contacted',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'Emily Park',
    firm: 'GV (Google Ventures)',
    role: 'Investment Partner',
    location: 'Mountain View, CA',
    portfolioSize: '150+ companies',
    averageInvestment: '$1M-$10M',
    sectors: ['AI/ML', 'Enterprise', 'Consumer'],
    stages: ['Seed', 'Series A', 'Series B'],
    portfolioFit: 94,
    email: 'epark@gv.com',
    phone: '+1 (555) 456-7890',
    linkedin: 'linkedin.com/in/emilypark',
    recentInvestments: ['Uber (Series B)', 'Nest (Series A)', 'Slack (Series C)'],
    status: 'hot',
    avatar: 'https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '5',
    name: 'James Thompson',
    firm: 'Accel Partners',
    role: 'Partner',
    location: 'London, UK',
    portfolioSize: '90+ companies',
    averageInvestment: '$5M-$30M',
    sectors: ['FinTech', 'E-commerce', 'SaaS'],
    stages: ['Series A', 'Series B', 'Series C'],
    portfolioFit: 82,
    email: 'jthompson@accel.com',
    phone: '+44 20 7000 0000',
    linkedin: 'linkedin.com/in/jamesthompson',
    recentInvestments: ['Revolut (Series C)', 'Monzo (Series B)', 'GoCardless (Series A)'],
    status: 'warm',
    avatar: 'https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '6',
    name: 'Lisa Zhang',
    firm: 'Index Ventures',
    role: 'General Partner',
    location: 'San Francisco, CA',
    portfolioSize: '75+ companies',
    averageInvestment: '$3M-$20M',
    sectors: ['SaaS', 'Developer Tools', 'Infrastructure'],
    stages: ['Series A', 'Series B'],
    portfolioFit: 90,
    email: 'lzhang@indexventures.com',
    phone: '+1 (555) 567-8901',
    linkedin: 'linkedin.com/in/lisazhang',
    recentInvestments: ['GitLab (Series B)', 'Docker (Series A)', 'Confluent (Series C)'],
    status: 'cold',
    avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];