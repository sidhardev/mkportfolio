document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init();

    // Style configuration elements
    const colorThemeSelect = document.getElementById('colorTheme');
    const layoutStyleSelect = document.getElementById('layoutStyle');
    const fontStyleSelect = document.getElementById('fontStyle');
    const animationStyleSelect = document.getElementById('animationStyle');

    // Style configurations
    const styleConfigs = {
        colors: {
            blue: {
                primary: '#3b82f6',
                secondary: '#1d4ed8',
                gradient: 'from-blue-500 to-indigo-600'
            },
            purple: {
                primary: '#8b5cf6',
                secondary: '#6d28d9',
                gradient: 'from-purple-500 to-pink-600'
            },
            green: {
                primary: '#10b981',
                secondary: '#059669',
                gradient: 'from-green-500 to-teal-600'
            },
            orange: {
                primary: '#f97316',
                secondary: '#ea580c',
                gradient: 'from-orange-500 to-red-600'
            },
            gray: {
                primary: '#4b5563',
                secondary: '#374151',
                gradient: 'from-gray-600 to-gray-800'
            }
        },
        layouts: {
            modern: {
                spacing: 'max-w-6xl mx-auto px-4 py-12',
                cardStyle: 'rounded-xl shadow-lg'
            },
            classic: {
                spacing: 'max-w-5xl mx-auto px-6 py-16',
                cardStyle: 'rounded-md shadow-md'
            },
            minimalist: {
                spacing: 'max-w-4xl mx-auto px-8 py-20',
                cardStyle: 'border border-gray-200'
            },
            bold: {
                spacing: 'max-w-7xl mx-auto px-4 py-8',
                cardStyle: 'rounded-2xl shadow-2xl'
            }
        },
        fonts: {
            Inter: "'Inter', sans-serif",
            Poppins: "'Poppins', sans-serif",
            'Playfair Display': "'Playfair Display', serif",
            Roboto: "'Roboto', sans-serif"
        },
        animations: {
            fade: {
                dataAos: 'fade-up',
                duration: '1000'
            },
            slide: {
                dataAos: 'slide-up',
                duration: '800'
            },
            bounce: {
                dataAos: 'zoom-in',
                duration: '600'
            },
            none: {
                dataAos: '',
                duration: '0'
            }
        }
    };

    // First check if this is a shared portfolio
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData && window.location.hash === '#preview') {
        try {
            const portfolioData = JSON.parse(decodeURIComponent(atob(sharedData)));
            const portfolioHtml = generatePortfolioHTML(portfolioData);
            document.body.innerHTML = portfolioHtml;
            document.title = `${portfolioData.name}'s Portfolio`;
            return; // Stop here if this is a shared portfolio
        } catch (error) {
            console.error('Failed to load shared portfolio:', error);
        }
    }

    // DOM Elements
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

    // Style change listeners with live preview
    colorThemeSelect?.addEventListener('change', (e) => {
        updateThemeExample(e.target.value);
        updatePreview();
    });
    layoutStyleSelect?.addEventListener('change', updatePreview);
    fontStyleSelect?.addEventListener('change', (e) => {
        document.body.style.fontFamily = styleConfigs.fonts[e.target.value];
        updatePreview();
    });
    animationStyleSelect?.addEventListener('change', updatePreview);

    // Function to update theme examples
    function updateThemeExample(selectedTheme) {
        document.querySelectorAll('.theme-example').forEach(example => {
            const theme = example.dataset.theme;
            example.classList.toggle('ring-2', theme === selectedTheme);
            example.classList.toggle('ring-offset-2', theme === selectedTheme);
            example.classList.toggle('ring-sky-500', theme === selectedTheme);
        });
    }

    // Initialize with default theme
    updateThemeExample('blue');

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
            e.preventDefault();
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
        removeBtn.innerHTML = '&times;';
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
            .map(projectDiv => ({
                title: projectDiv.querySelector('.project-title-input')?.value.trim() || '',
                description: projectDiv.querySelector('.project-description-input')?.value.trim() || '',
                imageUrl: projectDiv.querySelector('.project-imageUrl-input')?.value.trim() || '',
                liveUrl: projectDiv.querySelector('.project-liveUrl-input')?.value.trim() || '',
                repoUrl: projectDiv.querySelector('.project-repoUrl-input')?.value.trim() || '',
                technologies: projectDiv.querySelector('.project-technologies-input')?.value.split(',').map(t => t.trim()).filter(t => t) || []
            }));

        return {
            name: nameInput.value.trim(),
            tagline: taglineInput.value.trim(),
            bio: bioInput.value.trim(),
            profilePicUrl: profilePicUrlInput.value.trim(),
            email: emailInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            github: githubInput.value.trim(),
            skills,
            projects,
            styles: {
                color: colorThemeSelect?.value || 'blue',
                layout: layoutStyleSelect?.value || 'modern',
                font: fontStyleSelect?.value || 'Inter',
                animation: animationStyleSelect?.value || 'fade'
            }
        };
    }

    function generatePortfolioHTML(data) {
        const selectedColor = styleConfigs.colors[data.styles?.color || 'blue'];
        const selectedLayout = styleConfigs.layouts[data.styles?.layout || 'modern'];
        const selectedFont = styleConfigs.fonts[data.styles?.font || 'Inter'];
        const selectedAnimation = styleConfigs.animations[data.styles?.animation || 'fade'];

        const getThemeClasses = (theme) => {
            const themeStyles = {
                modern: 'backdrop-blur-sm bg-white/90',
                classic: 'border-t-4',
                minimalist: 'bg-white',
                bold: 'shadow-xl'
            };
            return themeStyles[theme] || '';
        };

        const getColorClasses = (color) => {
            const colorStyles = {
                blue: 'from-blue-50 to-indigo-50',
                purple: 'from-purple-50 to-pink-50',
                green: 'from-green-50 to-emerald-50',
                orange: 'from-orange-50 to-yellow-50',
                gray: 'from-gray-50 to-slate-50'
            };
            return colorStyles[color] || '';
        };

        const technologiesList = (techArray) => {
            if (!techArray || techArray.length === 0) return '';
            return techArray.map(tech => 
                `<span class="bg-${selectedColor.primary}/10 text-${selectedColor.primary} px-3 py-1 rounded-full text-xs font-medium">${tech}</span>`
            ).join(' ');
        };

        const projectsHTML = data.projects.map(project => `
            <div class="bg-white/80 p-8 ${selectedLayout.cardStyle} mb-6 hover:transform hover:scale-[1.02] transition-all duration-300" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">
                ${project.imageUrl ? `
                    <div class="relative h-48 -mt-8 -mx-8 mb-6 overflow-hidden">
                        <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                ` : ''}
                <h3 class="text-2xl font-bold text-gray-800 mb-3">${project.title || 'Untitled Project'}</h3>
                ${project.description ? `<p class="text-gray-600 mb-4 text-sm leading-relaxed">${project.description}</p>` : ''}
                ${project.technologies && project.technologies.length > 0 ? `
                    <div class="mb-4">
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${technologiesList(project.technologies)}
                        </div>
                    </div>
                ` : ''}
                <div class="flex gap-4 mt-6">
                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-${selectedColor.primary} hover:text-${selectedColor.secondary} font-medium transition-colors">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Live Demo
                    </a>` : ''}
                    ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-${selectedColor.primary} hover:text-${selectedColor.secondary} font-medium transition-colors">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        View Code
                    </a>` : ''}
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
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
                <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
                <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
                <style>
                    body { 
                        font-family: ${selectedFont}; 
                        background: linear-gradient(135deg, ${getColorClasses(data.styles?.color || 'blue')});
                        min-height: 100vh;
                    }
                    .section-card {
                        ${getThemeClasses(data.styles?.layout || 'modern')}
                    }
                </style>
            </head>
            <body class="min-h-screen pb-20" onload="AOS.init();">
                <div class="${selectedLayout.spacing}">
                    <header class="text-center py-20 mb-12" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">
                        ${data.profilePicUrl ? `
                            <div class="relative inline-block mb-6">
                                <div class="absolute inset-0 bg-gradient-to-r ${selectedColor.gradient} rounded-full blur-lg opacity-75 animate-pulse"></div>
                                <img src="${data.profilePicUrl}" alt="${data.name || 'Profile'}" class="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl">
                            </div>
                        ` : ''}
                        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">${data.name || 'Your Name'}</h1>
                        ${data.tagline ? `<p class="text-xl md:text-2xl text-${selectedColor.primary} font-medium">${data.tagline}</p>` : ''}
                    </header>

                    ${data.bio ? `
                    <section id="about" class="section-card mb-12 p-8 rounded-2xl" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-${selectedColor.primary}/20">About Me</h2>
                        <p class="text-gray-600 leading-relaxed text-lg">${data.bio}</p>
                    </section>
                    ` : ''}
                    
                    ${(data.email || data.linkedin || data.github) ? `
                    <section id="contact" class="section-card mb-12 p-8 rounded-2xl" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-${selectedColor.primary}/20">Get in Touch</h2>
                        <div class="grid md:grid-cols-3 gap-6">
                            ${data.email ? `
                                <a href="mailto:${data.email}" class="flex items-center p-4 rounded-xl bg-${selectedColor.primary}/5 hover:bg-${selectedColor.primary}/10 transition-colors">
                                    <svg class="w-6 h-6 text-${selectedColor.primary} mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span class="text-gray-600 hover:text-gray-900 transition-colors">${data.email}</span>
                                </a>
                            ` : ''}
                            ${data.linkedin ? `
                                <a href="${data.linkedin}" target="_blank" class="flex items-center p-4 rounded-xl bg-${selectedColor.primary}/5 hover:bg-${selectedColor.primary}/10 transition-colors">
                                    <svg class="w-6 h-6 text-${selectedColor.primary} mr-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                    <span class="text-gray-600 hover:text-gray-900 transition-colors">LinkedIn</span>
                                </a>
                            ` : ''}
                            ${data.github ? `
                                <a href="${data.github}" target="_blank" class="flex items-center p-4 rounded-xl bg-${selectedColor.primary}/5 hover:bg-${selectedColor.primary}/10 transition-colors">
                                    <svg class="w-6 h-6 text-${selectedColor.primary} mr-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    <span class="text-gray-600 hover:text-gray-900 transition-colors">GitHub</span>
                                </a>
                            ` : ''}
                        </div>
                    </section>
                    ` : ''}

                    ${data.skills && data.skills.length > 0 ? `
                    <section id="skills" class="section-card mb-12 p-8 rounded-2xl" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-${selectedColor.primary}/20">Skills & Technologies</h2>
                        <div class="flex flex-wrap gap-3">
                            ${data.skills.map(skill => 
                                `<span class="px-4 py-2 rounded-xl bg-${selectedColor.primary}/10 text-${selectedColor.primary} font-medium">${skill}</span>`
                            ).join('')}
                        </div>
                    </section>
                    ` : ''}

                    ${data.projects && data.projects.length > 0 ? `
                    <section id="projects">
                        <h2 class="text-2xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-${selectedColor.primary}/20" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">Featured Projects</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            ${projectsHTML}
                        </div>
                    </section>
                    ` : ''}

                    <footer class="text-center mt-20" ${selectedAnimation.dataAos} data-aos-duration="${selectedAnimation.duration}">
                        <div class="section-card inline-block px-8 py-4 rounded-full">
                            <p class="text-sm text-gray-500">Crafted with ❤️ using Portfolio Generator</p>
                        </div>
                    </footer>
                </div>
                <script>
                    // Reinitialize AOS when all images are loaded
                    window.addEventListener('load', () => {
                        AOS.refresh();
                    });
                </script>
            </body>
            </html>
        `;
    }

    function updatePreview() {
        const portfolioData = getPortfolioData();
        const portfolioHtml = generatePortfolioHTML(portfolioData);
        previewFrame.srcdoc = portfolioHtml;
        
        // Create sharable link
        const portfolioDataStr = JSON.stringify(portfolioData);
        const portfolioDataB64 = btoa(encodeURIComponent(portfolioDataStr));
        const shareableUrl = `${window.location.origin}${window.location.pathname}?data=${portfolioDataB64}#preview`;

        // Show modern share modal
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        dialog.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all" data-aos="zoom-in">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Share Your Portfolio</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl mb-6">
                    <p class="text-gray-600 mb-2">Your portfolio is ready! Share it with the world:</p>
                    <div class="flex gap-2">
                        <input type="text" value="${shareableUrl}" class="flex-1 p-3 border border-gray-200 rounded-lg bg-white font-mono text-sm" readonly onclick="this.select()">
                        <button class="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2 whitespace-nowrap" onclick="navigator.clipboard.writeText('${shareableUrl}').then(() => this.innerHTML = '<svg class=\\'w-5 h-5\\' fill=\\'none\\' stroke=\\'currentColor\\'><path stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M5 13l4 4L19 7\\'></path></svg>Copied!')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                            </svg>
                            Copy Link
                        </button>
                    </div>
                </div>
                <div class="flex gap-4">
                    <a href="${shareableUrl}" target="_blank" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center">Open Preview</a>
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
                </div>
                <div class="mt-6 pt-6 border-t border-gray-200">
                    <p class="text-sm text-gray-500 text-center">Want to edit? Just make your changes and click "Generate & Preview" again!</p>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    function downloadPortfolio() {
        const portfolioData = getPortfolioData();
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
});