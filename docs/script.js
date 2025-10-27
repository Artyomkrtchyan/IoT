// -------------------- Главная страница --------------------

// Ждём, пока DOM загрузится
document.addEventListener("DOMContentLoaded", () => {

    // Кнопка "More" на главной странице
    const moreBtn = document.querySelector(".read-more");
    if (moreBtn) {
        moreBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const profileInfo = document.querySelector(".profile-info p");
            if (profileInfo) {
                // Показываем/скрываем полный текст с анимацией
                if (!profileInfo.classList.contains("expanded")) {
                    profileInfo.textContent += " I am particularly interested in IoT devices, embedded systems, and AI integration in electronics. I love learning new frameworks and applying them to real-life projects.";
                    profileInfo.classList.add("expanded");
                    moreBtn.querySelector(".arrow").textContent = "⌵"; // меняем стрелку
                } else {
                    profileInfo.textContent = "I am a motivated and goal-oriented student/developer with a strong interest in IoT projects. I enjoy creating practical and innovative solutions, continuously learning new technologies, and applying them in real-world projects.";
                    profileInfo.classList.remove("expanded");
                    moreBtn.querySelector(".arrow").textContent = ">";
                }
            }
        });
    }

    // Навигация — подсветка при наведении
    const navItems = document.querySelectorAll(".main-nav .nav-item");
    navItems.forEach(item => {
        item.addEventListener("mouseover", () => {
            item.style.color = "#ff6600";
        });
        item.addEventListener("mouseout", () => {
            item.style.color = "";
        });
    });

    // -------------------- Страница Education --------------------
    
    const educationSection = document.querySelector(".text-left .text");
    if (educationSection) {
        // Плавное появление контента
        educationSection.style.opacity = 0;
        educationSection.style.transition = "opacity 1s ease-in-out";
        setTimeout(() => {
            educationSection.style.opacity = 1;
        }, 600); // небольшая задержка
    }

    // Анимация при клике на заголовки образования
    const educationHeaders = document.querySelectorAll(".text h2");
    educationHeaders.forEach(header => {
        header.style.cursor = "pointer";
        header.addEventListener("click", () => {
            const next = header.nextElementSibling;
            if (next) {
                next.style.display = next.style.display === "none" ? "block" : "none";
            }
        });
    });

});
