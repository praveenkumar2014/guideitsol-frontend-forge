const fs = require('fs');
const path = require('path');

const trainingTsPath = path.join(__dirname, '../src/data/training.ts');
let content = fs.readFileSync(trainingTsPath, 'utf8');

// 1. Add image to Course type
if (!content.includes('image?: string;')) {
  content = content.replace(
    '  rating?: number;',
    '  image?: string;\n  rating?: number;'
  );
}

// 2. Add realistic instructor profiles and course images
const instructorAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
];

const courseImages = {
  "Software Development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  "Data & AI": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
  "Cloud & DevOps": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  "Testing": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "UI/UX & Design": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "SAP & Enterprise": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "Mobile Development": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  "Digital & Business": "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&q=80"
};

// Replace courses
let inCoursesArray = false;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const courses: Course[] = [')) {
    inCoursesArray = true;
    continue;
  }
  if (inCoursesArray && lines[i].startsWith('];')) {
    inCoursesArray = false;
    continue;
  }
  
  if (inCoursesArray) {
    if (lines[i].includes('instructor: "')) {
      const match = lines[i].match(/instructor: "(.*)"/);
      if (match) {
        const name = match[1];
        // Generate pseudo random avatar based on name length
        const avatar = instructorAvatars[name.length % instructorAvatars.length];
        lines[i] = `${lines[i]}\n    instructorProfile: {\n      name: "${name}",\n      role: "Senior Engineering Manager",\n      organization: "GuideSoft IT",\n      avatar: "${avatar}",\n      bio: "${name} is a renowned expert with over 10 years of experience in building scalable enterprise systems. They have trained thousands of students and consulted for Fortune 500 companies.",\n      rating: 4.8,\n      studentsTaught: "15,000+",\n      coursesCount: 3\n    },`;
      }
    }
    
    if (lines[i].includes('category: "')) {
      const match = lines[i].match(/category: "(.*)"/);
      if (match) {
        const cat = match[1];
        const img = courseImages[cat] || courseImages["Software Development"];
        lines[i] = `${lines[i]}\n    image: "${img}",`;
      }
    }
  }
}

fs.writeFileSync(trainingTsPath, lines.join('\n'));
console.log('Successfully injected real images into training.ts');
