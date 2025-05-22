document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const nameEl = document.getElementById('name');
    const taglineEl = document.getElementById('tagline');
    const bioEl = document.getElementById('bio');
    const profilePicUrlEl = document.getElementById('profilePicUrl');
    const emailEl = document.getElementById('email');
    const linkedinEl = document.getElementById('linkedin');
    const githubEl = document.getElementById('github');

    const skillInputEl = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsContainerEl = document.getElementById('skillsContainer');

    const projectsContainerEl = document.getElementById('projectsContainer');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectFormTemplate = document.getElementById('projectFormTemplate');

    const generatePreviewBtn = document.getElementById('generatePreviewBtn');
    const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
    const previewFrameEl = document.getElementById('previewFrame');

    // --- State ---
    let skills = [];
    let projectCount = 0; // To give unique IDs to project forms if needed, though we'll mostly rely on DOM structure

    // --- Skill Management ---
    function renderSkills() {
        skillsContainerEl.innerHTML = '';
        skills.forEach((skill, index) => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;';
            removeBtn.onclick = () => removeSkill(index);
            
            skillTag.appendChild(removeBtn);
            skillsContainerEl.appendChild(skillTag);
        });
    }

    function addSkill() {
        const skillText = skillInputEl.value.trim();
        if (skillText && !skills.includes(skillText)) {
            skills.push(skillText);
            renderSkills();
            skillInputEl.value = '';
        }
    }

    function removeSkill(index) {
        skills.splice(index, 1);
        renderSkills();
    }

    addSkillBtn.addEventListener('click', addSkill);
    skillInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });

    // --- Project Management ---
    function addProjectForm() {
        projectCount++;
        const projectFormClone = projectFormTemplate.content.cloneNode(true);
        const projectDiv = projectFormClone.querySelector('.project-form-instance');
        projectDiv.dataset.projectId = `project-${projectCount}`;

        const removeBtn = projectDiv.querySelector('.remove-project-btn');
        removeBtn.onclick = () => {
            projectDiv.remove();
            // Re-evaluate projectCount or simply let it be for uniqueness
        };
        
        projectsContainerEl.appendChild(projectFormClone);
    }

    addProjectBtn.addEventListener('click', addProjectForm);
    addProjectForm(); // Add one project form by default

    // --- Data Collection ---
    function collectData() {
        const projectsData = [];
        document.querySelectorAll('.project-form-instance').forEach(formEl => {
            projectsData.push({
                title: formEl.querySelector('.project-title-input').value.trim(),
                description: formEl.querySelector('.project-description-input').value.trim(),
                imageUrl: formEl.querySelector('.project-imageUrl-input').value.trim(),
                liveUrl: formEl.querySelector('.project-liveUrl-input').value.trim(),
                repoUrl: formEl.querySelector('.project-repoUrl-input').value.trim(),
                technologies: formEl.querySelector('.project-technologies-input').value.trim(),
            });
        });

        return {
            name: nameEl.value.trim(),
            tagline: taglineEl.value.trim(),
            bio: bioEl.value.trim(),
            profilePicUrl: profilePicUrlEl.value.trim(),
            email: emailEl.value.trim(),
            linkedin: linkedinEl.value.trim(),
            github: githubEl.value.trim(),
            skills: [...skills], // Clone skills array
            projects: projectsData,
        };
    }

    // --- Portfolio HTML Generation ---
    function generatePortfolioHTML(data) {
        const skillsHTML = data.skills.map(skill => 
            `<span class="inline-block bg-indigo-100 text-indigo-700 rounded-full px-4 py-2 text-sm font-semibold mr-2 mb-2 shadow-sm">${skill}</span>`
        ).join('');

        const projectsHTML = data.projects.filter(p => p.title).map(project => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                ${project.imageUrl ? `<img class="w-full h-56 object-cover" src="${project.imageUrl}" alt="${project.title}">` : '<div class="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>'}
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-gray-800 mb-3">${project.title}</h3>
                    <p class="text-gray-600 mb-4 leading-relaxed">${project.description}</p>
                    ${project.technologies ? `<div class="mb-4"><strong class="font-medium text-gray-700">Technologies:</strong> <span class="text-sm text-gray-600">${project.technologies.split(',').map(t => t.trim()).join(', ')}</span></div>` : ''}
                    <div class="flex flex-wrap gap-3 mt-5">
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">Live Demo</a>` : ''}
                        ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" class="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">Source Code</a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name || 'My'} Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
        .hero-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .section-title {
            font-size: 2.5rem; /* 40px */
            font-weight: 800;
            color: #1e3a8a; /* Darker blue */
            margin-bottom: 2.5rem; /* 40px */
            text-align: center;
            position: relative;
            padding-bottom: 1rem; /* 16px */
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background-color: #3b82f6; /* Blue accent */
            border-radius: 2px;
        }
        /* Custom scrollbar for a more polished look (optional) */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
    </style>
</head>
<body class="bg-slate-50 text-gray-800 antialiased">

    <!-- Navigation (Optional - Simple for now) -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-6 py-3 flex justify-between items-center">
            <a href="#" class="text-2xl font-bold text-blue-600">${data.name || 'Portfolio'}</a>
            <div class="space-x-4">
                <a href="#about" class="text-gray-600 hover:text-blue-600">About</a>
                <a href="#skills" class="text-gray-600 hover:text-blue-600">Skills</a>
                <a href="#projects" class="text-gray-600 hover:text-blue-600">Projects</a>
                <a href="#contact" class="text-gray-600 hover:text-blue-600">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header id="hero" class="hero-bg text-white py-20 md:py-32">
        <div class="container mx-auto px-6 text-center">
            ${data.profilePicUrl ? `<img src="${data.profilePicUrl}" alt="${data.name}" class="w-40 h-40 md:w-48 md:h-48 rounded-full mx-auto mb-6 border-4 border-white shadow-xl">` : ''}
            <h1 class="text-4xl md:text-6xl font-extrabold mb-3">${data.name || 'Your Name'}</h1>
            <p class="text-xl md:text-2xl font-light text-indigo-100">${data.tagline || 'Your Awesome Tagline'}</p>
        </div>
    </header>

    <main class="container mx-auto p-6 md:p-12">
        <!-- About Section -->
        <section id="about" class="py-16 md:py-20">
            <h2 class="section-title">About Me</h2>
            <div class="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-xl">
                <p class="text-lg text-gray-700 leading-relaxed">${data.bio || 'A passionate individual with a love for creating amazing things.'}</p>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills" class="py-16 md:py-20 bg-slate-100 rounded-xl my-10">
            <h2 class="section-title">Skills</h2>
            <div class="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 px-4">
                ${skillsHTML || '<p class="text-gray-600">No skills listed yet.</p>'}
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="py-16 md:py-20">
            <h2 class="section-title">My Projects</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                ${projectsHTML || '<p class="text-gray-600 col-span-full text-center">No projects listed yet.</p>'}
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-16 md:py-20 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl my-10">
            <h2 class="section-title !text-white">Get In Touch</h2>
            <div class="max-w-xl mx-auto text-center">
                <p class="text-lg text-gray-300 mb-6">I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                ${data.email ? `<p class="text-xl mb-8"><strong class="font-semibold">Email:</strong> <a href="mailto:${data.email}" class="text-blue-400 hover:underline">${data.email}</a></p>` : ''}
                <div class="flex justify-center space-x-8">
                    ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="text-gray-300 hover:text-white transition duration-300"><svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd"/></svg><span class="sr-only">LinkedIn</span></a>` : ''}
                    ${data.github ? `<a href="${data.github}" target="_blank" class="text-gray-300 hover:text-white transition duration-300"><svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.602-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.465-1.11-1.465-.909-.62.069-.608.069-.608 1.004.074 1.532 1.03 1.532 1.03.891 1.529 2.341 1.089 2.91.833.091-.647.349-1.086.635-1.335-2.22-.251-4.555-1.111-4.555-4.943 0-1.091.39-1.984 1.029-2.682-.103-.252-.446-1.27.098-2.645 0 0 .84-.269 2.75 1.025A9.547 9.547 0 0112 6.836c.85.004 1.705.114 2.505.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.375.203 2.393.1 2.645.64.698 1.027 1.591 1.027 2.682 0 3.842-2.338 4.687-4.565 4.935.358.307.679.917.679 1.852 0 1.335-.012 2.415-.012 2.741 0 .269.18.579.688.481A9.997 9.997 0 0022 12c0-5.523-4.477-10-10-10z" clip-rule="evenodd"/></svg><span class="sr-only">GitHub</span></a>` : ''}
                </div>
            </div>
        </section>
    </main>

    <footer class="text-center py-8 bg-gray-800 text-gray-400">
        <p>&copy; ${new Date().getFullYear()} ${data.name || 'Your Name'}. Generated with the Impressive Portfolio Generator.</p>
    </footer>
</body>
</html>
    `;
    }

    // --- Event Handlers for Main Actions ---
    function handleGeneratePreview() {
        const portfolioData = collectData();
        const portfolioHtml = generatePortfolioHTML(portfolioData);
        previewFrameEl.srcdoc = portfolioHtml;
    }

    function handleDownloadHtml() {
        const portfolioData = collectData();
        const portfolioHtml = generatePortfolioHTML(portfolioData);
        
        const blob = new Blob([portfolioHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(portfolioData.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generatePreviewBtn.addEventListener('click', handleGeneratePreview);
    downloadHtmlBtn.addEventListener('click', handleDownloadHtml);

    // Initial render for skills (empty) and one project form
    renderSkills();
});
```

Save this code as `script.js` in the same directory as your `index.html` (or `Untitled-1.html`) file. It should work seamlessly with the HTML structure you have.

Let me know if you need anything else!