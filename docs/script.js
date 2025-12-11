// ============================================
// Personal Portfolio & IoT Data Dashboard
// Author: Artyom Mkrtchyan
// ============================================

// ============================================
// Global Variables
// ============================================
let sensorData = [];
let charts = {};
let currentMetric = 'temperature';
let currentTimeRange = 'all';

// Metric configurations
const metricConfig = {
  temperature: { label: 'Temperature', unit: '°C', color: '#f59e0b', icon: 'thermometer' },
  humidity: { label: 'Humidity', unit: '%', color: '#3b82f6', icon: 'droplets' },
  pressure: { label: 'Pressure', unit: 'hPa', color: '#8b5cf6', icon: 'gauge' },
  co2ppm: { label: 'CO2', unit: 'ppm', color: '#ef4444', icon: 'wind' },
  pm1_0: { label: 'PM1.0', unit: 'µg/m³', color: '#10b981', icon: 'cloud' },
  pm2_5: { label: 'PM2.5', unit: 'µg/m³', color: '#06b6d4', icon: 'cloud' },
  pm4_0: { label: 'PM4.0', unit: 'µg/m³', color: '#84cc16', icon: 'cloud' },
  pm10: { label: 'PM10', unit: 'µg/m³', color: '#f97316', icon: 'cloud' },
  altitude: { label: 'Altitude', unit: 'm', color: '#6366f1', icon: 'mountain' }
};

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initContactForm();
  loadSensorData();
  lucide.createIcons();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    observer.observe(section);
  });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple validation
    if (!name || !email || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    
    // Simulate form submission
    showToast('Message sent successfully!', 'success');
    form.reset();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
  // Create toast container if not exists
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============================================
// Data Loading & Processing
// ============================================
async function loadSensorData() {
  try {
    // Try to fetch from data.json
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data');
    
    sensorData = await response.json();
    console.log(`Loaded ${sensorData.length} data points`);
    
    // Initialize dashboard
    initDashboard();
  } catch (error) {
    console.error('Error loading sensor data:', error);
    showToast('Error loading sensor data', 'error');
  }
}

function getFilteredData() {
  if (currentTimeRange === 'all') {
    return sensorData;
  }
  const limit = parseInt(currentTimeRange);
  return sensorData.slice(-limit);
}

function calculateStats(data, metric) {
  const values = data.map(d => d[metric]).filter(v => v !== null && v !== undefined);
  if (values.length === 0) return { avg: 0, min: 0, max: 0, current: 0 };
  
  return {
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    current: values[values.length - 1]
  };
}

// ============================================
// Dashboard Initialization
// ============================================
function initDashboard() {
  // Setup controls
  const metricSelect = document.getElementById('metricSelect');
  const timeRange = document.getElementById('timeRange');
  
  metricSelect.addEventListener('change', (e) => {
    currentMetric = e.target.value;
    updateDashboard();
  });
  
  timeRange.addEventListener('change', (e) => {
    currentTimeRange = e.target.value;
    updateDashboard();
  });
  
  // Setup stat card clicks
  document.querySelectorAll('.dashboard-stat').forEach(card => {
    card.addEventListener('click', () => {
      const metric = card.dataset.metric;
      if (metric && metricConfig[metric]) {
        metricSelect.value = metric;
        currentMetric = metric;
        updateDashboard();
      }
    });
  });
  
  // Initialize charts
  initCharts();
  updateDashboard();
}

// ============================================
// Chart Initialization
// ============================================
function initCharts() {
  // Chart.js global defaults
  Chart.defaults.color = '#a1a1aa';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
  Chart.defaults.font.family = "'Inter', sans-serif";
  
  // Line Chart - Main metric over time
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  charts.line = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Temperature',
        data: [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a24',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          titleFont: { weight: '600' },
          callbacks: {
            label: (ctx) => {
              const config = metricConfig[currentMetric];
              return `${config.label}: ${ctx.parsed.y.toFixed(2)} ${config.unit}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Bar Chart - Average metrics comparison
  const barCtx = document.getElementById('barChart').getContext('2d');
  charts.bar = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Temperature', 'Humidity', 'CO2', 'PM2.5'],
      datasets: [{
        label: 'Normalized Average',
        data: [],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a24',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true,
          max: 100
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Doughnut Chart - PM Distribution
  const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
  charts.doughnut = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: {
      labels: ['PM1.0', 'PM2.5', 'PM4.0', 'PM10'],
      datasets: [{
        data: [],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(132, 204, 22, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderColor: '#1a1a24',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: '#1a1a24',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(2)} µg/m³`
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Multi-line Chart - Multiple metrics
  const multiCtx = document.getElementById('multiLineChart').getContext('2d');
  charts.multi = new Chart(multiCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperature',
          data: [],
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        },
        {
          label: 'Humidity',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        },
        {
          label: 'CO2 (scaled)',
          data: [],
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1a24',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          min: 0,
          max: 100
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    }
  });
  
  // Setup multi-chart legend
  setupMultiChartLegend();
}

function setupMultiChartLegend() {
  const legendContainer = document.getElementById('multiChartLegend');
  const datasets = charts.multi.data.datasets;
  
  legendContainer.innerHTML = datasets.map((ds, i) => `
    <div class="legend-item" data-index="${i}">
      <span class="legend-color" style="background: ${ds.borderColor}"></span>
      <span>${ds.label}</span>
    </div>
  `).join('');
  
  // Add click handlers for legend items
  legendContainer.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      const dataset = charts.multi.data.datasets[index];
      dataset.hidden = !dataset.hidden;
      item.classList.toggle('hidden', dataset.hidden);
      charts.multi.update();
    });
  });
}

// ============================================
// Dashboard Update
// ============================================
function updateDashboard() {
  const data = getFilteredData();
  if (data.length === 0) return;
  
  updateStatsCards(data);
  updateLineChart(data);
  updateBarChart(data);
  updateDoughnutChart(data);
  updateMultiLineChart(data);
}

function updateStatsCards(data) {
  const tempStats = calculateStats(data, 'temperature');
  const humidityStats = calculateStats(data, 'humidity');
  const co2Stats = calculateStats(data, 'co2ppm');
  const pm25Stats = calculateStats(data, 'pm2_5');
  
  document.getElementById('statTemp').textContent = `${tempStats.current.toFixed(1)}°C`;
  document.getElementById('statHumidity').textContent = `${humidityStats.current.toFixed(1)}%`;
  document.getElementById('statCO2').textContent = `${co2Stats.current.toFixed(0)} ppm`;
  document.getElementById('statPM25').textContent = `${pm25Stats.current.toFixed(1)} µg/m³`;
  
  // Highlight active metric card
  document.querySelectorAll('.dashboard-stat').forEach(card => {
    card.classList.toggle('active', card.dataset.metric === currentMetric);
  });
}

function updateLineChart(data) {
  const config = metricConfig[currentMetric];
  const labels = data.map((d, i) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });
  const values = data.map(d => d[currentMetric]);
  
  // Update chart title
  document.getElementById('lineChartTitle').textContent = `${config.label} Over Time`;
  
  // Update chart data
  charts.line.data.labels = labels;
  charts.line.data.datasets[0].label = config.label;
  charts.line.data.datasets[0].data = values;
  charts.line.data.datasets[0].borderColor = config.color;
  charts.line.data.datasets[0].backgroundColor = `${config.color}20`;
  charts.line.update('active');
}

function updateBarChart(data) {
  // Normalize values to 0-100 scale for comparison
  const metrics = ['temperature', 'humidity', 'co2ppm', 'pm2_5'];
  const maxValues = {
    temperature: 50,    // Max expected temp
    humidity: 100,      // Percentage
    co2ppm: 2000,       // Max CO2
    pm2_5: 100          // Max PM2.5
  };
  
  const normalizedValues = metrics.map(metric => {
    const stats = calculateStats(data, metric);
    return (stats.avg / maxValues[metric]) * 100;
  });
  
  charts.bar.data.datasets[0].data = normalizedValues;
  charts.bar.update('active');
}

function updateDoughnutChart(data) {
  const pm1 = calculateStats(data, 'pm1_0').avg;
  const pm25 = calculateStats(data, 'pm2_5').avg;
  const pm4 = calculateStats(data, 'pm4_0').avg;
  const pm10 = calculateStats(data, 'pm10').avg;
  
  charts.doughnut.data.datasets[0].data = [pm1, pm25, pm4, pm10];
  charts.doughnut.update('active');
}

function updateMultiLineChart(data) {
  const labels = data.map((d, i) => {
    const date = new Date(d.timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });
  
  // Normalize all values to 0-100 scale
  const tempMax = Math.max(...data.map(d => d.temperature));
  const tempMin = Math.min(...data.map(d => d.temperature));
  const co2Max = Math.max(...data.map(d => d.co2ppm));
  const co2Min = Math.min(...data.map(d => d.co2ppm));
  
  const normalizedTemp = data.map(d => 
    ((d.temperature - tempMin) / (tempMax - tempMin || 1)) * 100
  );
  const normalizedHumidity = data.map(d => d.humidity); // Already 0-100
  const normalizedCO2 = data.map(d => 
    ((d.co2ppm - co2Min) / (co2Max - co2Min || 1)) * 100
  );
  
  charts.multi.data.labels = labels;
  charts.multi.data.datasets[0].data = normalizedTemp;
  charts.multi.data.datasets[1].data = normalizedHumidity;
  charts.multi.data.datasets[2].data = normalizedCO2;
  charts.multi.update('active');
}
