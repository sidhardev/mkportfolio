document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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

    // State
    let skills = [];
    let projectCount = 0;

    // Skills Management
    function renderSkills() {
        skillsContainerEl.innerHTML = '';
        skills.forEach((skill, index) => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
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

    // Project Management
    function addProjectForm() {
        projectCount++;
        const projectFormClone = projectFormTemplate.content.cloneNode(true);
        const projectDiv = projectFormClone.querySelector('.project-form-instance');
        projectDiv.dataset.projectId = `project-${projectCount}`;

        const removeBtn = projectDiv.querySelector('.remove-project-btn');
        removeBtn.onclick = () => projectDiv.remove();
        
        projectsContainerEl.appendChild(projectFormClone);
    }

    // Data Collection
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
            skills: [...skills],
            projects: projectsData,
        };
    }

    // Portfolio Generation
    function generatePortfolioHTML(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name || 'Portfolio'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        @media (max-width: 640px) {
            .mobile-menu { display: none; }
            .mobile-menu.show { display: block; }
        }
    </style>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow fixed w-full z-10">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-xl font-bold text-blue-600">${data.name || 'Portfolio'}</span>
                </div>
                <div class="hidden sm:flex sm:items-center sm:space-x-4">
                    <a href="#about" class="px-3 py-2 text-gray-600 hover:text-blue-600">About</a>
                    <a href="#skills" class="px-3 py-2 text-gray-600 hover:text-blue-600">Skills</a>
                    <a href="#projects" class="px-3 py-2 text-gray-600 hover:text-blue-600">Projects</a>
                    <a href="#contact" class="px-3 py-2 text-gray-600 hover:text-blue-600">Contact</a>
                </div>
                <button onclick="document.querySelector('.mobile-menu').classList.toggle('show')" 
                        class="sm:hidden p-2 rounded-md hover:bg-gray-100">
                    Menu
                </button>
            </div>
        </div>
        <div class="mobile-menu sm:hidden">
            <div class="px-2 pb-3 space-y-1">
                <a href="#about" class="block px-3 py-2 text-gray-600 hover:text-blue-600">About</a>
                <a href="#skills" class="block px-3 py-2 text-gray-600 hover:text-blue-600">Skills</a>
                <a href="#projects" class="block px-3 py-2 text-gray-600 hover:text-blue-600">Projects</a>
                <a href="#contact" class="block px-3 py-2 text-gray-600 hover:text-blue-600">Contact</a>
            </div>
        </div>
    </nav>

    <header class="pt-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div class="max-w-6xl mx-auto px-4 py-16 text-center">
            ${data.profilePicUrl ? 
                `<img src="${data.profilePicUrl}" alt="${data.name}" class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white">` : 
                ''
            }
            <h1 class="text-4xl font-bold mb-4">${data.name || 'Your Name'}</h1>
            <p class="text-xl opacity-90">${data.tagline || 'Welcome to my portfolio'}</p>
        </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-12">
        <section id="about" class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">About Me</h2>
            <div class="bg-white rounded shadow p-6">
                <p class="text-gray-600">${data.bio || 'Bio content goes here'}</p>
            </div>
        </section>

        <section id="skills" class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">Skills</h2>
            <div class="bg-white rounded shadow p-6">
                <div class="flex flex-wrap justify-center gap-2">
                    ${data.skills.map(skill => 
                        `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${skill}</span>`
                    ).join('') || '<p class="text-gray-500">No skills listed yet</p>'}
                </div>
            </div>
        </section>

        <section id="projects" class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">Projects</h2>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                ${data.projects.filter(p => p.title).map(project => `
                    <div class="bg-white rounded shadow overflow-hidden">
                        ${project.imageUrl ? 
                            `<img src="${project.imageUrl}" alt="${project.title}" class="w-full h-48 object-cover">` :
                            '<div class="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>'
                        }
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                            <p class="text-gray-600 mb-4">${project.description}</p>
                            ${project.technologies ? 
                                `<p class="text-sm text-gray-500 mb-4">${project.technologies}</p>` : 
                                ''
                            }
                            <div class="flex gap-4">
                                ${project.liveUrl ? 
                                    `<a href="${project.liveUrl}" target="_blank" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">View Live</a>` :
                                    ''
                                }
                                ${project.repoUrl ? 
                                    `<a href="${project.repoUrl}" target="_blank" class="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900">Source Code</a>` :
                                    ''
                                }
                            </div>
                        </div>
                    </div>
                `).join('') || '<p class="text-gray-500 text-center col-span-full">No projects listed yet</p>'}
            </div>
        </section>

        <section id="contact" class="mb-16">
            <h2 class="text-3xl font-bold text-center mb-8">Contact</h2>
            <div class="bg-white rounded shadow p-6 text-center">
                ${data.email ? 
                    `<p class="mb-4">
                        <strong class="text-gray-700">Email:</strong> 
                        <a href="mailto:${data.email}" class="text-blue-600 hover:underline">${data.email}</a>
                    </p>` : 
                    ''
                }
                <div class="flex justify-center gap-6">
                    ${data.linkedin ? 
                        `<a href="${data.linkedin}" target="_blank" class="text-gray-600 hover:text-blue-600">LinkedIn</a>` : 
                        ''
                    }
                    ${data.github ? 
                        `<a href="${data.github}" target="_blank" class="text-gray-600 hover:text-blue-600">GitHub</a>` : 
                        ''
                    }
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-gray-800 text-white py-8">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; ${new Date().getFullYear()} ${data.name || 'Your Name'}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', event => {
                event.preventDefault();
                document.querySelector('.mobile-menu').classList.remove('show');
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 64,
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
</body>
</html>`;
    }

    // Event Handlers
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

    // Event Listeners
    addSkillBtn.addEventListener('click', addSkill);
    skillInputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });
    
    addProjectBtn.addEventListener('click', addProjectForm);
    generatePreviewBtn.addEventListener('click', handleGeneratePreview);
    downloadHtmlBtn.addEventListener('click', handleDownloadHtml);

    // Initialize
    renderSkills();
    addProjectForm();
});
