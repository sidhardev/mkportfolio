document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    // Personal Info
    const nameInput = document.getElementById('name');
    const taglineInput = document.getElementById('tagline');
    const bioInput = document.getElementById('bio');
    const profilePicUrlInput = document.getElementById('profilePicUrl');
    const emailInput = document.getElementById('email');
    const linkedinInput = document.getElementById('linkedin');
    const githubInput = document.getElementById('github');

    // Skills
    const skillInput = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsContainer = document.getElementById('skillsContainer');

    // Projects
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectsContainer = document.getElementById('projectsContainer');
    const projectFormTemplate = document.getElementById('projectFormTemplate');

    // Actions & Preview
    const generatePreviewBtn = document.getElementById('generatePreviewBtn');
    const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
    const previewFrame = document.getElementById('previewFrame');

    // --- Event Listeners ---

    // Add Skill
    addSkillBtn.addEventListener('click', () => {
        const skillText = skillInput.value.trim();
        if (skillText) {
            addSkillToDom(skillText);
            skillInput.value = '';
            skillInput.focus();
        }
    });
    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if it were in a form
            addSkillBtn.click();
        }
    });


    // Remove Skill (Event Delegation)
    skillsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-skill-btn')) {
            e.target.closest('.skill-tag').remove();
        }
    });

    // Add Project
    addProjectBtn.addEventListener('click', addProjectForm);

    // Remove Project (Event Delegation)
    projectsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-project-btn')) {
            e.target.closest('.project-form-instance').remove();
        }
    });

    // Generate Preview
    generatePreviewBtn.addEventListener('click', updatePreview);

    // Download HTML
    downloadHtmlBtn.addEventListener('click', downloadPortfolio);

    // --- Functions ---

    function addSkillToDom(skillText) {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm mr-2 mb-2 flex items-center';
        
        const skillNameSpan = document.createElement('span');
        skillNameSpan.textContent = skillText;
        skillTag.appendChild(skillNameSpan);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-skill-btn ml-2 text-indigo-600 hover:text-indigo-800 font-bold';
        removeBtn.innerHTML = '&times;'; // "x" symbol
        removeBtn.setAttribute('aria-label', `Remove ${skillText} skill`);
        skillTag.appendChild(removeBtn);

        skillsContainer.appendChild(skillTag);
    }

    function addProjectForm() {
        const templateContent = projectFormTemplate.content.cloneNode(true);
        projectsContainer.appendChild(templateContent);
    }

    function getPortfolioData() {
        const skills = Array.from(skillsContainer.querySelectorAll('.skill-tag span'))
                            .map(span => span.textContent.trim());

        const projects = Array.from(projectsContainer.querySelectorAll('.project-form-instance'))
            .map(projectDiv => {
                return {
                    title: projectDiv.querySelector('.project-title-input')?.value.trim() || '',
                    description: projectDiv.querySelector('.project-description-input')?.value.trim() || '',
                    imageUrl: projectDiv.querySelector('.project-imageUrl-input')?.value.trim() || '',
                    liveUrl: projectDiv.querySelector('.project-liveUrl-input')?.value.trim() || '',
                    repoUrl: projectDiv.querySelector('.project-repoUrl-input')?.value.trim() || '',
                    technologies: projectDiv.querySelector('.project-technologies-input')?.value.split(',').map(t => t.trim()).filter(t => t) || []
                };
            });

        return {
            name: nameInput.value.trim(),
            tagline: taglineInput.value.trim(),
            bio: bioInput.value.trim(),
            profilePicUrl: profilePicUrlInput.value.trim(),
            email: emailInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            github: githubInput.value.trim(),
            skills,
            projects
        };
    }

    function generatePortfolioHTML(data) {
        const technologiesList = (techArray) => {
            if (!techArray || techArray.length === 0) return '';
            return techArray.map(tech => `<span class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">${tech}</span>`).join(' ');
        };

        const projectsHTML = data.projects.map(project => `
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-full h-48 object-cover rounded-md mb-4">` : ''}
                <h3 class="text-xl font-bold text-gray-800 mb-2">${project.title || 'Untitled Project'}</h3>
                ${project.description ? `<p class="text-gray-600 mb-3 text-sm whitespace-pre-line">${project.description}</p>` : ''}
                ${project.technologies && project.technologies.length > 0 ? `
                    <div class="mb-3">
                        <h4 class="text-xs font-semibold text-gray-500 uppercase mb-1">Technologies:</h4>
                        <div class="flex flex-wrap gap-1">
                            ${technologiesList(project.technologies)}
                        </div>
                    </div>
                ` : ''}
                <div class="mt-4 flex space-x-3">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium">Live Demo</a>` : ''}
                    ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium">Source Code</a>` : ''}
                </div>
            </div>
        `).join('');

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.name ? data.name + "'s Portfolio" : 'My Portfolio'}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; background-color: #f9fafb; }
                    .whitespace-pre-line { white-space: pre-line; }
                </style>
            </head>
            <body class="text-gray-800">
                <div class="container mx-auto max-w-4xl p-4 md:p-8">
                    <header class="text-center mb-10 md:mb-12">
                        ${data.profilePicUrl ? `<img src="${data.profilePicUrl}" alt="${data.name || 'Profile'}" class="w-28 h-28 md:w-32 md:h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg">` : ''}
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900">${data.name || 'Your Name'}</h1>
                        ${data.tagline ? `<p class="text-lg md:text-xl text-blue-600 font-medium mt-1">${data.tagline}</p>` : ''}
                    </header>

                    ${data.bio ? `
                    <section id="about" class="mb-8 md:mb-10 p-6 bg-white rounded-lg shadow-sm">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">About Me</h2>
                        <p class="text-gray-600 leading-relaxed whitespace-pre-line">${data.bio}</p>
                    </section>
                    ` : ''}
                    
                    ${(data.email || data.linkedin || data.github) ? `
                    <section id="contact" class="mb-8 md:mb-10 p-6 bg-white rounded-lg shadow-sm">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">Contact</h2>
                        <ul class="list-none p-0 space-y-2">
                            ${data.email ? `<li><strong class="font-medium">Email:</strong> <a href="mailto:${data.email}" class="text-blue-600 hover:underline">${data.email}</a></li>` : ''}
                            ${data.linkedin ? `<li><strong class="font-medium">LinkedIn:</strong> <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${data.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></li>` : ''}
                            ${data.github ? `<li><strong class="font-medium">GitHub:</strong> <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${data.github.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></li>` : ''}
                        </ul>
                    </section>
                    ` : ''}

                    ${data.skills && data.skills.length > 0 ? `
                    <section id="skills" class="mb-8 md:mb-10 p-6 bg-white rounded-lg shadow-sm">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Skills</h2>
                        <div class="flex flex-wrap gap-2">
                            ${data.skills.map(skill => `<span class="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">${skill}</span>`).join('')}
                        </div>
                    </section>
                    ` : ''}

                    ${data.projects && data.projects.length > 0 ? `
                    <section id="projects">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Projects</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            ${projectsHTML}
                        </div>
                    </section>
                    ` : ''}

                    <footer class="text-center mt-10 md:mt-16 py-6 border-t border-gray-200">
                        <p class="text-sm text-gray-500">Generated with the Impressive Portfolio Generator</p>
                    </footer>
                </div>
            </body>
            </html>
        `;
    }

    function updatePreview() {
        const data = getPortfolioData();
        const portfolioHtml = generatePortfolioHTML(data);
        previewFrame.srcdoc = portfolioHtml;
    }

    function downloadPortfolio() {
        const data = getPortfolioData();
        const portfolioHtml = generatePortfolioHTML(data);
        const blob = new Blob([portfolioHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = (data.name || 'portfolio').toLowerCase().replace(/\s+/g, '-') + '.html';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Initial setup: Add one project form by default if desired, or leave it empty
    // addProjectForm(); // Uncomment to start with one project form
    // Initial preview update if you have default values or want to show an empty state
    // updatePreview(); 
});