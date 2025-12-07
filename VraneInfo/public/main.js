// Main JavaScript for kljun.me presentation

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initParticleBackground();
    initCounters();
    initCharts();
    initSmoothScroll();
    initNavigation();
});

// Scroll reveal animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Particle background animation using p5.js
function initParticleBackground() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    new p5((p) => {
        let particles = [];
        const numParticles = 50;
        
        p.setup = function() {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
            canvas.parent(container);
            
            // Create particles
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    opacity: p.random(0.3, 0.8)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw particle
                p.fill(246, 173, 85, particle.opacity * 255);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(other => {
                    const distance = p.dist(particle.x, particle.y, other.x, other.y);
                    if (distance < 100) {
                        p.stroke(56, 178, 172, (1 - distance / 100) * 50);
                        p.strokeWeight(1);
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                });
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        };
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, stepTime);
}

// Initialize charts
function initCharts() {
    initEfficiencyChart();
    initMarketChart();
}

// Efficiency chart
function initEfficiencyChart() {
    const chartElement = document.getElementById('efficiency-chart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Tradicionalni sistem', 'kljun.me'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Troškovi goriva', 'Emisije CO2', 'Efikasnost prikupljanja', 'Zadovoljstvo građana', 'Održivost']
        },
        yAxis: {
            type: 'value',
            max: 100
        },
        series: [
            {
                name: 'Tradicionalni sistem',
                type: 'bar',
                data: [100, 100, 60, 50, 30],
                itemStyle: {
                    color: '#EF4444'
                }
            },
            {
                name: 'kljun.me',
                type: 'bar',
                data: [60, 40, 95, 90, 95],
                itemStyle: {
                    color: '#38A169'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // Resize chart on window resize
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Market growth chart
function initMarketChart() {
    const chartElement = document.getElementById('market-chart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Crna Gora', 'Balkan', 'EU'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['2024', '2025', '2026', '2027', '2028', '2029']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '€{value}M'
            }
        },
        series: [
            {
                name: 'Crna Gora',
                type: 'line',
                data: [0, 2.5, 3.5, 4.2, 5.0, 5.5],
                itemStyle: {
                    color: '#38A169'
                },
                smooth: true
            },
            {
                name: 'Balkan',
                type: 'line',
                data: [0, 0, 25, 35, 45, 55],
                itemStyle: {
                    color: '#F6AD55'
                },
                smooth: true
            },
            {
                name: 'EU',
                type: 'line',
                data: [0, 0, 0, 250, 350, 450],
                itemStyle: {
                    color: '#3182CE'
                },
                smooth: true
            }
        ]
    };
    
    chart.setOption(option);
    
    // Resize chart on window resize
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Smooth scroll functionality
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('nav');
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('bg-white/95');
            nav.classList.remove('bg-white/90');
        } else {
            nav.classList.add('bg-white/90');
            nav.classList.remove('bg-white/95');
        }
    });
    
    // Highlight active navigation item
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-eco-green');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-eco-green');
            }
        });
    });
}

// Utility function to scroll to specific section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Card hover effects
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
});

// Add loading animation
window.addEventListener('load', function() {
    // Animate hero elements
    anime.timeline()
        .add({
            targets: '.reveal',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(200),
            easing: 'easeOutQuad'
        });
});