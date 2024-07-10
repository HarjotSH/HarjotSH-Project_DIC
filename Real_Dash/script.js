document.addEventListener('DOMContentLoaded', function () {
    const bgToggle = document.getElementById('bg-toggle');
    const bgIcon = document.getElementById('bg-icon');
    const body = document.body;

    bgToggle.addEventListener('click', function () {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            bgIcon.textContent = 'light_mode';
        } else {
            bgIcon.textContent = 'dark_mode';
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const valuesHeading = document.getElementById('value-heading');

    valuesHeading.addEventListener('click', () => {
        location.reload(); // Refresh the page when the "Values" heading is clicked
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const sensorInfo = document.querySelector('.sensor-info');

    window.addEventListener('scroll', function () {
        // Calculate when the sensor-info section comes into view
        const sensorInfoTop = sensorInfo.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sensorInfoTop < windowHeight) {
            // Add a class to trigger the animation
            sensorInfo.classList.add('animate-slide-in');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Set the date input to today's date
    const dateInput = document.getElementById('today-date');
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    dateInput.value = todayString;
});


document.addEventListener('DOMContentLoaded', function () {
    const sensorInfo = document.getElementById('sensor-info');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sensorInfo.classList.add('visible');
                observer.unobserve(sensorInfo);
            }
        });
    });

    observer.observe(sensorInfo);
});
