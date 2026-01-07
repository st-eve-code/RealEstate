'use client'

import React, { useState } from 'react';
import '../../App.css';
import Nav_bar from '../../components/Navbar';
import Footer from '../Footer';
import { Send, Search, Calendar, Tag, ArrowLeft, Clock } from 'lucide-react';

// Blog Articles Data
const blogArticles = [
  {
    id: 1,
    title: "Exploring the Benefits of Renting vs. Buying a Home",
    excerpt: "In this article, we delve into the advantages of renting a home compared to purchasing one. We discuss financial flexibility, maintenance responsibilities, and lifestyle choices that make renting an attractive option for many individuals and families.",
    date: "2025-01-27",
    category: "Renting",
    image: "https://images.ctfassets.net/n2ifzifcqscw/7eIbgmc7sRJUZjW4LqCnbV/ff7cb40f868f154b6de7e319fbc365a8/why-people-travel-hero.jpeg?w=1920&fm=webp",
    author: "Sarah Johnson",
    readTime: "5 min read",
    isFeatured: true,
    content: `
      <h2>Financial Flexibility</h2>
      <p>Renting offers unparalleled financial flexibility compared to homeownership. When you rent, you avoid the substantial upfront costs associated with buying a home, including down payments, closing costs, and immediate repairs or renovations.</p>
      
      <h3>Lower Initial Investment</h3>
      <p>Most rental agreements require only first and last month's rent plus a security deposit, which is significantly less than the 20% down payment typically required for a home purchase. This allows you to maintain liquidity and invest your capital elsewhere.</p>
      
      <h3>Predictable Monthly Expenses</h3>
      <p>Rental costs are fixed for the duration of your lease, making budgeting easier. You won't face unexpected expenses like a broken water heater or roof repairs, as these are typically the landlord's responsibility.</p>
      
      <h2>Maintenance Freedom</h2>
      <p>One of the biggest advantages of renting is freedom from maintenance responsibilities. When something breaks, you simply call your landlord or property management company, and they handle the repairs at no cost to you.</p>
      
      <h2>Lifestyle Flexibility</h2>
      <p>Renting provides the flexibility to relocate easily for job opportunities, lifestyle changes, or simply to explore different neighborhoods without the burden of selling a property.</p>
      
      <h3>No Long-term Commitment</h3>
      <p>Most leases are 6-12 months, giving you the option to move without the lengthy process of selling a home. This is particularly beneficial for young professionals, students, or anyone uncertain about their long-term plans.</p>
      
      <h2>Access to Amenities</h2>
      <p>Many rental properties, especially apartment complexes, offer amenities like pools, fitness centers, and community spaces that would be cost-prohibitive to own individually.</p>
      
      <h2>Conclusion</h2>
      <p>While homeownership has its merits, renting provides financial flexibility, maintenance freedom, and lifestyle adaptability that makes it the ideal choice for many people at various life stages.</p>
    `
  },
  {
    id: 2,
    title: "Top 10 Tips for First-Time Renters",
    excerpt: "Moving into your first rental property? Here are essential tips to help you navigate the rental process, understand your lease agreement, and maintain a good relationship with your landlord.",
    date: "2025-01-25",
    category: "Tips & Guides",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    author: "Michael Chen",
    readTime: "7 min read",
    isFeatured: true,
    content: `
      <h2>Understanding Your Lease</h2>
      <p>Before signing anything, read your lease agreement thoroughly. Understanding the terms and conditions will help you avoid potential issues down the road.</p>
      
      <h3>Key Lease Components</h3>
      <p>Pay attention to rent amount, due dates, late fees, security deposit terms, maintenance responsibilities, pet policies, and subletting rules.</p>
      
      <h2>Documentation is Key</h2>
      <p>Take photos and videos of the property before moving in. Document any existing damage to protect yourself when moving out and ensure you get your full security deposit back.</p>
      
      <h2>Know Your Rights</h2>
      <p>Familiarize yourself with tenant rights in your area. Understanding your legal protections will help you advocate for yourself if issues arise.</p>
      
      <h2>Communication with Landlord</h2>
      <p>Maintain professional, documented communication with your landlord. Use email for important requests and keep records of all correspondence.</p>
      
      <h2>Budgeting Beyond Rent</h2>
      <p>Factor in utilities, renter's insurance, internet, and parking when budgeting. These additional costs can add significantly to your monthly expenses.</p>
    `
  },
  {
    id: 3,
    title: "How to Make a Rental Feel Like Home",
    excerpt: "Transform your rental property into a personalized space without violating your lease. Learn creative decorating ideas and temporary modifications that can make any rental feel like home.",
    date: "2025-01-23",
    category: "Interior Design",
    image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800",
    author: "Emma Williams",
    readTime: "6 min read",
    isFeatured: false,
    content: `
      <h2>Removable Solutions</h2>
      <p>Use removable wallpaper, command strips, and peel-and-stick tiles to personalize your space without permanent changes.</p>
      
      <h2>Furniture Placement</h2>
      <p>Strategic furniture arrangement can completely transform a space and make it feel more like your own.</p>
      
      <h2>Lighting Matters</h2>
      <p>Add floor lamps, table lamps, and string lights to create ambiance and overcome inadequate overhead lighting.</p>
      
      <h2>Personal Touches</h2>
      <p>Display artwork, photos, and decorative items that reflect your personality and make the space uniquely yours.</p>
    `
  },
  {
    id: 4,
    title: "Understanding Rental Insurance: What You Need to Know",
    excerpt: "Protect your belongings and liability with renter's insurance. This comprehensive guide explains coverage types, costs, and why every renter should consider this important protection.",
    date: "2025-01-20",
    category: "Insurance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    author: "David Martinez",
    readTime: "8 min read",
    isFeatured: false,
    content: `
      <h2>What Does Renter's Insurance Cover?</h2>
      <p>Renter's insurance typically covers personal property, liability, and additional living expenses if your rental becomes uninhabitable.</p>
      
      <h2>Cost of Coverage</h2>
      <p>Most renter's insurance policies cost between $15-30 per month, making it an affordable way to protect your belongings.</p>
      
      <h2>How to Choose a Policy</h2>
      <p>Consider coverage limits, deductibles, and specific endorsements for high-value items like electronics or jewelry.</p>
    `
  },
  {
    id: 5,
    title: "Navigating the Rental Application Process",
    excerpt: "Learn what landlords look for in rental applications, how to strengthen your application, and what to expect during the screening process.",
    date: "2025-01-18",
    category: "Renting",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    author: "Jennifer Lee",
    readTime: "5 min read",
    isFeatured: false,
    content: `
      <h2>Application Requirements</h2>
      <p>Most applications require proof of income, credit check authorization, references, and employment verification.</p>
      
      <h2>Credit Score Matters</h2>
      <p>Landlords typically look for credit scores above 650. If yours is lower, consider offering a larger security deposit or finding a co-signer.</p>
      
      <h2>Income Requirements</h2>
      <p>Many landlords require that your monthly income be 2.5-3 times the monthly rent amount.</p>
    `
  },
  {
    id: 6,
    title: "Pet-Friendly Rentals: Finding and Negotiating",
    excerpt: "Discover strategies for finding pet-friendly rentals and negotiating pet policies with landlords. Learn how to present yourself as a responsible pet owner.",
    date: "2025-01-15",
    category: "Tips & Guides",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
    author: "Robert Taylor",
    readTime: "6 min read",
    isFeatured: true,
    content: `
      <h2>Finding Pet-Friendly Properties</h2>
      <p>Use specific search filters on rental websites and be upfront about your pets from the beginning.</p>
      
      <h2>Pet Resume</h2>
      <p>Create a pet resume including vaccination records, training certificates, and references from previous landlords.</p>
      
      <h2>Negotiation Tips</h2>
      <p>Offer a pet deposit or higher security deposit to ease landlord concerns about potential damage.</p>
    `
  },
  {
    id: 7,
    title: "The Rise of Smart Home Technology in Rentals",
    excerpt: "How smart home technology is transforming the rental market. From smart locks to energy-efficient thermostats, discover the tech features renters are looking for.",
    date: "2025-01-12",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    author: "Alex Thompson",
    readTime: "7 min read",
    isFeatured: false,
    content: `
      <h2>Smart Security Features</h2>
      <p>Smart locks, video doorbells, and security cameras are becoming standard features in modern rentals, offering both convenience and safety.</p>
      
      <h2>Energy Efficiency</h2>
      <p>Smart thermostats and lighting systems help reduce utility costs while providing comfort and convenience to tenants.</p>
      
      <h2>Market Demand</h2>
      <p>Properties with smart home features typically rent faster and can command higher rental prices in competitive markets.</p>
    `
  },
  {
    id: 8,
    title: "Budgeting for Your First Apartment",
    excerpt: "A comprehensive guide to creating a realistic budget for your first apartment, including hidden costs and unexpected expenses many first-time renters overlook.",
    date: "2025-01-10",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224154-2607d78e6418?w=800",
    author: "Maria Garcia",
    readTime: "8 min read",
    isFeatured: true,
    content: `
      <h2>Initial Moving Costs</h2>
      <p>Beyond first month's rent and security deposit, budget for moving expenses, furniture, and essential household items.</p>
      
      <h2>Monthly Expenses Breakdown</h2>
      <p>Create a detailed budget including rent, utilities, groceries, transportation, and discretionary spending.</p>
      
      <h2>Emergency Fund</h2>
      <p>Maintain an emergency fund equivalent to 3-6 months of living expenses to cover unexpected situations.</p>
    `
  },
  {
    id: 9,
    title: "Sustainable Living in Rental Properties",
    excerpt: "Eco-friendly practices for renters who want to reduce their environmental impact. Learn simple changes that make a big difference without violating lease agreements.",
    date: "2025-01-08",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800",
    author: "James Wilson",
    readTime: "6 min read",
    isFeatured: false,
    content: `
      <h2>Energy Conservation</h2>
      <p>Simple changes like LED bulbs, smart power strips, and proper insulation can significantly reduce energy consumption.</p>
      
      <h2>Water Conservation</h2>
      <p>Low-flow showerheads and faucet aerators are inexpensive upgrades that can be easily installed and removed.</p>
      
      <h2>Waste Reduction</h2>
      <p>Implement recycling and composting systems, even in small spaces, to minimize your environmental footprint.</p>
    `
  },
  {
    id: 10,
    title: "Understanding Security Deposits: A Complete Guide",
    excerpt: "Everything you need to know about security deposits - from initial payment to getting your full deposit back when you move out.",
    date: "2025-01-05",
    category: "Renting",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    author: "Lisa Brown",
    readTime: "5 min read",
    isFeatured: false,
    content: `
      <h2>Security Deposit Laws</h2>
      <p>Understand your state's laws regarding security deposit limits, holding requirements, and return timelines.</p>
      
      <h2>Documenting Condition</h2>
      <p>Thorough move-in and move-out documentation is crucial for protecting your security deposit from unfair deductions.</p>
      
      <h2>Common Deductions</h2>
      <p>Learn what landlords can legally deduct from your deposit and how to avoid common pitfalls.</p>
    `
  },
  {
    id: 11,
    title: "The Future of Co-Living Spaces",
    excerpt: "Explore the growing trend of co-living spaces and how they're reshaping urban rental markets for young professionals and digital nomads.",
    date: "2025-01-03",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    author: "Kevin Zhang",
    readTime: "7 min read",
    isFeatured: true,
    content: `
      <h2>What is Co-Living?</h2>
      <p>Co-living offers private bedrooms with shared common spaces, creating community-focused living environments with built-in social networks.</p>
      
      <h2>Benefits for Renters</h2>
      <p>Lower costs, furnished spaces, included utilities, and instant community make co-living attractive for many urban dwellers.</p>
      
      <h2>Market Growth</h2>
      <p>The co-living market is experiencing rapid growth, particularly in high-cost urban areas where traditional housing is unaffordable.</p>
    `
  },
  {
    id: 12,
    title: "Rental Scams: How to Spot and Avoid Them",
    excerpt: "Protect yourself from rental scams with our comprehensive guide. Learn the red flags and verification steps to ensure you're dealing with legitimate listings.",
    date: "2024-12-30",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    author: "Rachel Kim",
    readTime: "6 min read",
    isFeatured: false,
    content: `
      <h2>Common Scam Tactics</h2>
      <p>Learn to identify fake listings, phantom rentals, and identity theft schemes that target renters.</p>
      
      <h2>Verification Steps</h2>
      <p>Always verify property ownership, meet in person, and never wire money for deposits or application fees.</p>
      
      <h2>Reporting Scams</h2>
      <p>Know where and how to report rental scams to protect yourself and help prevent others from being victimized.</p>
    `
  },
  {
    id: 13,
    title: "Maximizing Small Rental Spaces",
    excerpt: "Creative storage solutions and design tips for making the most of small apartments and studio rentals without sacrificing style or functionality.",
    date: "2024-12-28",
    category: "Interior Design",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    author: "Sophia Martinez",
    readTime: "8 min read",
    isFeatured: false,
    content: `
      <h2>Multi-functional Furniture</h2>
      <p>Invest in furniture that serves multiple purposes, like sofa beds, storage ottomans, and expandable dining tables.</p>
      
      <h2>Vertical Storage Solutions</h2>
      <p>Utilize wall space with shelves, hanging organizers, and magnetic strips to free up floor space.</p>
      
      <h2>Visual Expansion Techniques</h2>
      <p>Use mirrors, light colors, and strategic lighting to make small spaces feel larger and more open.</p>
    `
  },
  {
    id: 14,
    title: "The Impact of Remote Work on Rental Markets",
    excerpt: "How the shift to remote work is changing where people choose to live and what they look for in rental properties.",
    date: "2024-12-25",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
    author: "Daniel Park",
    readTime: "7 min read",
    isFeatured: true,
    content: `
      <h2>Changing Location Preferences</h2>
      <p>Remote workers are moving away from expensive urban centers to more affordable suburban and rural areas.</p>
      
      <h2>Home Office Requirements</h2>
      <p>Renters now prioritize properties with dedicated office spaces, better internet connectivity, and quiet environments.</p>
      
      <h2>Market Shifts</h2>
      <p>Some urban rental markets are seeing price decreases while suburban and vacation rental markets experience growth.</p>
    `
  },
  {
    id: 15,
    title: "Seasonal Rental Maintenance Checklist",
    excerpt: "A comprehensive seasonal maintenance guide for renters to keep their properties in top condition and maintain good relationships with landlords.",
    date: "2024-12-22",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
    author: "Thomas Reed",
    readTime: "6 min read",
    isFeatured: false,
    content: `
      <h2>Spring Maintenance</h2>
      <p>Clean gutters, check for winter damage, and prepare outdoor spaces for summer use.</p>
      
      <h2>Summer Tasks</h2>
      <p>Maintain air conditioning systems, check for pests, and ensure proper ventilation.</p>
      
      <h2>Fall Preparation</h2>
      <p>Winterize outdoor faucets, check heating systems, and prepare for colder weather.</p>
      
      <h2>Winter Care</h2>
      <p>Prevent frozen pipes, maintain walkways, and ensure proper insulation.</p>
    `
  },
  {
    id: 16,
    title: "Renting with Roommates: A Survival Guide",
    excerpt: "Essential tips for successfully sharing a rental property with roommates, from setting ground rules to managing shared expenses.",
    date: "2024-12-20",
    category: "Tips & Guides",
    image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
    author: "Amanda Foster",
    readTime: "8 min read",
    isFeatured: false,
    content: `
      <h2>Establishing House Rules</h2>
      <p>Create clear guidelines for cleaning schedules, guest policies, quiet hours, and shared space usage.</p>
      
      <h2>Financial Agreements</h2>
      <p>Use apps to track shared expenses, set up automatic rent payments, and establish an emergency fund for household repairs.</p>
      
      <h2>Conflict Resolution</h2>
      <p>Develop strategies for addressing issues early and maintaining positive communication among roommates.</p>
    `
  },
  {
    id: 17,
    title: "Luxury Rental Amenities That Are Worth It",
    excerpt: "Which luxury amenities actually enhance your quality of life versus those that are just marketing gimmicks? Our analysis helps you decide.",
    date: "2024-12-18",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    author: "Christopher Lee",
    readTime: "5 min read",
    isFeatured: false,
    content: `
      <h2>Must-Have Amenities</h2>
      <p>In-unit laundry, central air conditioning, and reliable high-speed internet are worth the premium for most renters.</p>
      
      <h2>Nice-to-Have Features</h2>
      <p>Concierge services, rooftop terraces, and pet spas add value but may not justify significant rent increases.</p>
      
      <h2>Amenities to Question</h2>
      <p>Some luxury features like wine cellars or business centers may sound impressive but see little practical use.</p>
    `
  },
  {
    id: 18,
    title: "The Psychology of Rental Pricing",
    excerpt: "Understanding how landlords set rental prices and what factors influence market rates in different neighborhoods and property types.",
    date: "2024-12-15",
    category: "Market Analysis",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    author: "Nathan Brooks",
    readTime: "7 min read",
    isFeatured: true,
    content: `
      <h2>Market Comparables</h2>
      <p>Landlords research similar properties in the area to determine competitive pricing strategies.</p>
      
      <h2>Seasonal Trends</h2>
      <p>Rental prices often fluctuate based on season, with higher demand during summer moving months.</p>
      
      <h2>Psychological Pricing</h2>
      <p>Learn how pricing just below round numbers ($1,995 vs $2,000) can influence perception and attract more interest.</p>
    `
  },
  {
    id: 19,
    title: "Rental Property Photography: Tips for Great Listings",
    excerpt: "How to take professional-quality photos of your rental property to attract better tenants and reduce vacancy time between leases.",
    date: "2024-12-12",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800",
    author: "Olivia Chen",
    readTime: "6 min read",
    isFeatured: false,
    content: `
      <h2>Lighting Techniques</h2>
      <p>Use natural light whenever possible and supplement with artificial lighting to create bright, inviting spaces.</p>
      
      <h2>Composition Tips</h2>
      <p>Shoot from corners to maximize room size appearance and use wide-angle lenses to capture entire spaces.</p>
      
      <h2>Staging for Photos</h2>
      <p>Declutter, add simple decor, and create inviting scenes that help potential tenants imagine living in the space.</p>
    `
  },
  {
    id: 20,
    title: "The Evolution of Rental Agreements",
    excerpt: "How rental agreements have changed over time and what modern tenants should know about new types of leases and rental arrangements.",
    date: "2024-12-10",
    category: "Legal",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    author: "William Harris",
    readTime: "8 min read",
    isFeatured: false,
    content: `
      <h2>Traditional vs Modern Leases</h2>
      <p>Compare standard 12-month leases with newer options like month-to-month, corporate housing, and short-term rentals.</p>
      
      <h2>Digital Lease Agreements</h2>
      <p>The rise of electronic signatures and digital lease management is making the rental process faster and more efficient.</p>
      
      <h2>Future Trends</h2>
      <p>Blockchain technology and smart contracts may revolutionize how rental agreements are created and enforced.</p>
    `
  }
];

// Reusable Components
const BlogCard = ({ article, onClick, size = 'normal' }) => {
  if (size === 'small') {
    return (
      <div 
        onClick={onClick}
        className='bg-white shadow-md hover:shadow-xl transition-all rounded-lg w-full h-auto p-3 cursor-pointer border border-gray-100'
      >
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-40 object-cover rounded-lg"
        />
        <h3 className='font-Poppins font-bold text-sm text-gray-700 mt-3 mb-2 line-clamp-2'>
          {article.title}
        </h3>
        <div className='flex items-center gap-2 text-gray-500 mb-2'>
          <Calendar size={12} />
          <p className='font-Poppins font-normal text-xs'>
            {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button className='font-Poppins font-medium text-sm text-blue-500 hover:underline'>
          Read more →
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className='bg-white shadow-md hover:shadow-xl transition-all rounded-lg w-full h-auto p-3 cursor-pointer border border-gray-100'
    >
      <img 
        src={article.image} 
        alt={article.title}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className='pt-2 w-full'>
        <div className='mt-4 flex flex-row gap-3 flex-wrap'>
          <div className='bg-gray-100 px-4 font-Poppins font-medium text-gray-600 text-xs py-2 rounded-lg flex items-center gap-2'>
            <Calendar size={14} />
            {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className='bg-blue-500 px-4 font-Poppins font-medium text-white text-xs py-2 rounded-lg flex items-center gap-2'>
            <Tag size={14} />
            {article.category}
          </div>
          <div className='bg-gray-100 px-4 font-Poppins font-medium text-gray-600 text-xs py-2 rounded-lg flex items-center gap-2'>
            <Clock size={14} />
            {article.readTime}
          </div>
        </div>
      </div>
      <div className='pt-2'>
        <h2 className='font-Poppins font-bold text-xl text-gray-800 mt-4 mb-2 line-clamp-2'>
          {article.title}
        </h2>
        <p className='font-Poppins font-normal text-sm text-gray-600 mb-4 line-clamp-3'>
          {article.excerpt}
        </p>
        <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
          <p className='font-Poppins font-medium text-sm text-gray-700'>
            By {article.author}
          </p>
          <button className='font-Poppins font-medium text-sm text-blue-500 hover:underline'>
            Read more →
          </button>
        </div>
      </div>
    </div>
  );
};

function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Get unique categories
  const categories = ['All Categories', ...new Set(blogArticles.map(article => article.category))];

  // Filter articles
  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations - Changed to cumulative display
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const displayCount = currentPage * articlesPerPage;
  const currentArticles = filteredArticles.slice(0, displayCount);

  // Get featured and latest articles
  const featuredArticles = blogArticles.filter(article => article.isFeatured).slice(0, 2);
  const latestArticles = [...blogArticles].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // Handle subscribe
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! You will receive updates in your inbox.');
  };

  // Load More Button
  const LoadMoreButton = () => {
    const hasMore = displayCount < filteredArticles.length;
    
    if (!hasMore) return null;

    return (
      <div className='flex justify-center mt-8'>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className='px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-Poppins font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2'
        >
          Load More Articles
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      </div>
    );
  };

  // Results info component
  const ResultsInfo = () => {
    if (filteredArticles.length === 0) return null;
    
    return (
      <div className='text-center mb-4'>
        <p className='font-Poppins text-sm text-gray-600'>
          Showing <span className='font-bold text-blue-600'>{displayCount > filteredArticles.length ? filteredArticles.length : displayCount}</span> of <span className='font-bold text-blue-600'>{filteredArticles.length}</span> articles
        </p>
      </div>
    );
  };

  // Article Detail View
  if (selectedArticle) {
    return (
      <section>
        <Nav_bar />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <button 
            onClick={() => setSelectedArticle(null)}
            className='flex items-center gap-2 text-blue-500 hover:text-blue-600 font-Poppins font-medium mb-6 transition-colors'
          >
            <ArrowLeft size={20} />
            Back to all articles
          </button>

          <article className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title}
              className='w-full h-96 object-cover'
            />
            
            <div className='p-6 md:p-10'>
              <div className='flex flex-wrap gap-3 mb-4'>
                <span className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-Poppins font-medium flex items-center gap-2'>
                  <Tag size={16} />
                  {selectedArticle.category}
                </span>
                <span className='bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-Poppins font-medium flex items-center gap-2'>
                  <Calendar size={16} />
                  {new Date(selectedArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className='bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-Poppins font-medium flex items-center gap-2'>
                  <Clock size={16} />
                  {selectedArticle.readTime}
                </span>
              </div>

              <h1 className='font-Poppins font-bold text-3xl md:text-4xl text-gray-900 mb-4'>
                {selectedArticle.title}
              </h1>

              <p className='font-Poppins font-medium text-gray-600 mb-6'>
                By {selectedArticle.author}
              </p>

              <div className='prose max-w-none'>
                <p className='text-lg text-gray-700 leading-relaxed mb-6 font-medium'>
                  {selectedArticle.excerpt}
                </p>
                
                <div 
                  className='article-content text-gray-700'
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              <div className='mt-10 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500'>
                <h3 className='font-Poppins font-bold text-lg text-blue-900 mb-2'>Share this article</h3>
                <p className='text-sm text-blue-800'>Found this helpful? Share it with your friends and family!</p>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <div className='mt-12'>
            <h2 className='font-Poppins font-bold text-2xl text-gray-800 mb-6'>Related Articles</h2>
            <div className='grid md:grid-cols-3 gap-6'>
              {blogArticles
                .filter(article => 
                  article.id !== selectedArticle.id && 
                  article.category === selectedArticle.category
                )
                .slice(0, 3)
                .map(article => (
                  <BlogCard 
                    key={article.id} 
                    article={article} 
                    onClick={() => {
                      setSelectedArticle(article);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    size='small'
                  />
                ))
              }
            </div>
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  // Main Blog List View
  return (
    <section>
      <Nav_bar />
      <section className='mt-8'>
        {/* Header */}
        <div className='bg-blue-500 rounded-full w-fit px-6 mx-auto py-2'>
          <h1 className='font-Poppins font-medium text-sm text-white'>Blog Contents</h1>
        </div>
        
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className='font-Poppins font-bold text-gray-800 text-3xl md:text-4xl text-center mt-6'>
            Discover Our Latest Insights and Updates on Rentals
          </h1>
          <p className='font-Poppins font-normal text-sm text-gray-600 text-center mt-4'>
            Stay updated with the latest news, tips, and insights on renting properties. 
            Explore our articles to learn more about how we are transforming the rental experience.
          </p>
        </div>

        {/* Hero Image */}
        <div className='mt-8 mx-2 md:mx-10 h-[20rem] md:h-[28rem]'>
          <img 
            src={blogArticles[0].image}
            alt="Featured" 
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Main Content Grid */}
        <div className='container mx-auto px-2 md:px-4 mt-8'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
            {/* Main Content - Blog Posts */}
            <div className='lg:col-span-8'>
              <div className='bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100'>
                <h2 className='font-Poppins font-bold text-2xl md:text-3xl text-gray-800 mb-2'>
                  Latest Articles
                </h2>
                <p className='font-Poppins font-normal text-sm text-gray-600 mb-6'>
                  Explore our collection of articles about renting, property management, and more.
                </p>

                {/* Filters and Search */}
                <div className='flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gray-200'>
                  <div className='flex gap-2 flex-wrap'>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 font-Poppins font-medium text-sm rounded-lg transition-all ${
                          selectedCategory === category
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className='flex flex-col md:flex-row gap-3 mb-6'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                    <input 
                      type="search" 
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      className='border border-gray-300 rounded-lg py-3 pl-10 pr-4 w-full font-Poppins outline-blue-500 bg-white font-medium text-sm text-gray-800' 
                      placeholder='Search articles by title, content, or author...'
                    />
                  </div>
                  <button 
                    type="submit" 
                    className='font-Poppins font-medium text-sm text-white bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap'
                  >
                    <Search size={18} />
                    Search
                  </button>
                </form>

                {/* Results Info */}
                <ResultsInfo />

                {/* Blog Cards Grid */}
                <div className='grid md:grid-cols-2 gap-6'>
                  {currentArticles.length > 0 ? (
                    currentArticles.map(article => (
                      <BlogCard 
                        key={article.id} 
                        article={article} 
                        onClick={() => {
                          setSelectedArticle(article);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    ))
                  ) : (
                    <div className='col-span-2 text-center py-12'>
                      <Search className='mx-auto text-gray-300 mb-4' size={48} />
                      <p className='font-Poppins text-gray-500 text-lg mb-2'>No articles found</p>
                      <p className='font-Poppins text-gray-400 text-sm'>Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <LoadMoreButton />
              </div>
            </div>

            {/* Sidebar - Featured & Latest */}
            <div className='lg:col-span-4 space-y-6'>
              {/* Featured Articles */}
              <div className='bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-100 sticky top-4'>
                <h2 className='font-Poppins font-bold text-xl text-gray-800 mb-4'>
                  Featured Articles
                </h2>
                <div className='space-y-4'>
                  {featuredArticles.map(article => (
                    <BlogCard 
                      key={article.id} 
                      article={article} 
                      onClick={() => {
                        setSelectedArticle(article);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      size='small'
                    />
                  ))}
                </div>

                {/* Latest Articles */}
                <h2 className='font-Poppins font-bold text-xl text-gray-800 mt-8 mb-4'>
                  Latest Articles
                </h2>
                <div className='space-y-4'>
                  {latestArticles.map(article => (
                    <BlogCard 
                      key={article.id} 
                      article={article} 
                      onClick={() => {
                        setSelectedArticle(article);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      size='small'
                    />
                  ))}
                </div>

                {/* Subscribe Section */}
                <div className='mt-8'>
                  <h2 className='font-Poppins font-bold text-xl text-gray-800 mb-4'>
                    Subscribe
                  </h2>
                  <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200'>
                    <h3 className='font-Poppins font-bold text-lg text-gray-800 mb-2'>
                      Stay Updated! 📬
                    </h3>
                    <p className='font-Poppins font-normal text-xs text-gray-600 mb-4'>
                      Subscribe to our newsletter to get the latest updates and articles delivered straight to your inbox.
                    </p>
                    <form onSubmit={handleSubscribe}>
                      <input 
                        type="email" 
                        required
                        className='w-full bg-white border border-gray-300 mb-3 px-3 py-2.5 rounded-lg font-Poppins font-normal text-sm text-gray-700 outline-blue-500' 
                        placeholder='Enter your email address'
                      />
                      <button 
                        type="submit" 
                        className='bg-blue-500 hover:bg-blue-600 flex justify-center items-center gap-2 text-white px-4 py-3 rounded-lg font-Poppins font-medium text-sm w-full transition-all'
                      >
                        <Send size={18} />
                        Subscribe Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
}

export default Blog;