// ----------------------- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ -----------------------
const loader = document.getElementById("loader") as HTMLDivElement | null;
const btn = document.getElementById("presidentBtn") as HTMLButtonElement | null;
const app = document.getElementById("app");

// ----------------------- НАВИГАЦИЯ -----------------------
function navigate(path: string) {
    console.log("NAVIGATE TO", path);

    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.history.pushState({}, "", path);
        router();

        document.body.classList.remove("fade-out");
        document.body.classList.add("fade-in");

        setTimeout(() => document.body.classList.remove("fade-in"), 500);
    }, 300);
}

// ----------------------- РЕНДЕР СТРАНИЦ -----------------------

// Вход
function renderLoginPage() {
    if (!app) return;

    app.innerHTML = `
        <div class="split-layout fade-in">
            <div class="left-panel">
                <div class="vertical-text">PRESIDENT</div>
            </div>
            <div class="right-panel">
                <div class="login-form-container">
                    <h1>Log In</h1>
                    <form id="loginForm" class="auth-form" data-login>
                        <div class="form-group">
                            <input type="email" id="email" value="Email" required>
                        </div>
                        <button type="submit" class="submit-btn">SEND THE CODE</button>
                    </form>
                    <div class="auth-links">
                        <a data-link href="/disclaimer" class="link-incognito">go incognito ></a>
                        <a data-link href="/registration" class="link-signin">Sign in ></a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const email = document.getElementById("email") as HTMLInputElement;
    email.addEventListener("focus", () => email.value === "Email" && (email.value = ""));
    email.addEventListener("blur", () => email.value === "" && (email.value = "Email"));

    document.getElementById("loginForm")?.addEventListener("submit", e => {
        e.preventDefault();
        navigate("/code");
    });
}

// Регистрация
function renderRegistrationPage() {
    if (!app) return;

    app.innerHTML = `
        <div class="split-layout fade-in">
            <div class="left-panel">
                <div class="vertical-text">PRESIDENT</div>
            </div>
            <div class="right-panel">
                <div class="login-form-container">
                    <h1>Sign In</h1>
                    <form id="registrationForm" class="auth-form" data-registration>
                        <div class="form-group">
                            <input type="email" id="email" value="Email" required>
                        </div>
                        <button type="submit" class="submit-btn">SEND THE CODE</button>
                    </form>
                    <div class="auth-links">
                        <a data-link href="/login" class="link-signin">Log in ></a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const email = document.getElementById("email") as HTMLInputElement;
    email.addEventListener("focus", () => email.value === "Email" && (email.value = ""));
    email.addEventListener("blur", () => email.value === "" && (email.value = "Email"));

    document.getElementById("registrationForm")?.addEventListener("submit", e => {
        e.preventDefault();
        navigate("/code");
    });
}

// Ввод кода
function renderCodePage(email: string = "user@example.com") {
    if (!app) return;

    app.innerHTML = `
        <div class="split-layout fade-in">
            <div class="left-panel">
                <div class="vertical-text">PRESIDENT</div>
            </div>
            <div class="right-panel">
                <div class="login-form-container">
                    <h1 class="code-title">Enter the code</h1>
                    <p class="code-email">Code sent to: ${email}</p>
                    <form id="codeForm" class="auth-form">
                        <div class="code-inputs">
                            ${"<input type='text' maxlength='1' class='code-box'>".repeat(6)}
                        </div>
                        <button type="submit" class="submit-btn">ENTER</button>
                    </form>
                    <div class="auth-links">
                        <a data-link href="/disclaimer" class="link-incognito">go incognito ></a>
                    </div>
                </div>
            </div>
        </div>
        <div id="modal" class="modal hidden">
            <div class="modal-content">
                <p id="modal-message"></p>
                <div id="modal-buttons"></div>
            </div>
        </div>
    `;

    const inputs = document.querySelectorAll(".code-box") as NodeListOf<HTMLInputElement>;
    inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });

    document.getElementById("codeForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const code = Array.from(inputs).map(i => i.value).join("");
        const modal = document.getElementById("modal")!;
        const message = document.getElementById("modal-message")!;
        const buttons = document.getElementById("modal-buttons")!;

        modal.classList.remove("hidden");

        if (code === "000000") {
            message.textContent = "successfully";
            buttons.innerHTML = `<button id="continueBtn" class="submit-btn">CONTINUE</button>`;
            document.getElementById("continueBtn")?.addEventListener("click", () => navigate("/disclaimer"));
        } else {
            message.textContent = "Invalid code";
            buttons.innerHTML = `<button id="closeBtn" class="submit-btn">Close</button>`;
            document.getElementById("closeBtn")?.addEventListener("click", () => {
                modal.classList.add("hidden");
                inputs.forEach(input => input.value = "");
                inputs[0].focus();
            });
        }
    });
}

// Дисклеймер
function renderDisclaimerPage() {
    if (!app) return;

    app.innerHTML = `
        <div class="disclaimer-page fade-in">
            <div class="disclaimer-container">
                <h1>DISCLAIMER</h1>
                <p>
                    This website is created for humorous purposes and does not involve the actual purchase of items.
                    Please only rate the creation of the website, as it is designed to teach novice programmers.
                </p>
                <button class="disclaimer-btn">Continue →</button>
            </div>
        </div>
    `;

    document.querySelector(".disclaimer-btn")?.addEventListener("click", () => navigate("/home"));
}

// Главная
function renderHomePage() {
    if (!app) return;

    app.innerHTML = `
        <div class="home-page fade-in">
            <!-- Главный экран -->
            <section class="hero">
                <header class="header">
                    <div class="header-logo">
                        <img src="/logo-white.png" data-alt="/logo-black.png" alt="Shop Logo" class="logo">
                    </div>
                    <nav class="header-nav">
                        <a href="/catalog">PRESIDENT</a>
                        <a href="/catalog">DAKIMAKURA</a>
                        <a href="/catalog">MERCH</a>
                    </nav>
                    <div class="header-icons">
                        <img src="/icons/search-white.png" data-alt="/icons/search-black.png" alt="Search" class="icon">
                        <img src="/icons/cart-white.png" data-alt="/icons/cart-black.png" alt="Cart" class="icon cart-icon">
                        <img src="/icons/account-white.png" data-alt="/icons/account-black.png" alt="Account" class="icon account-icon">
                    </div>
                </header>
                <div class="hero-content">
                    <h1>Emmanuel<br>Macron</h1>
                    <p>One of the most beautiful presidents<br>in the world</p>
                    <button class="hero-btn">More detailed →</button>
                </div>
            </section>

            <!-- Категории -->
            <section class="categories">
                <a href="/catalog" class="category">
                    <img src="/categories/president.jpg" alt="President">
                    <p>PRESIDENT</p>
                </a>
                <a href="/catalog" class="category">
                    <img src="/categories/dakimakura.jpg" alt="Dakimakura">
                    <p>DAKIMAKURA</p>
                </a>
                <a href="/catalog" class="category">
                    <img src="/categories/merch.jpg" alt="Merch">
                    <p>MERCH</p>
                </a>
            </section>

            <!-- Футер -->
            <footer class="footer">
                <div class="footer-logo">
                    <img src="/logo-white.png" data-alt="/logo-black.png" alt="Shop Logo" class="logo">
                    <span>PRESIDENT SHOP</span>
                </div>
            </footer>

            <!-- Нижняя чёрная полоса -->
            <div class="footer-bar">
                <img src="/logo-black.png" alt="Shop Logo" class="logo-small">
                <span>PRESIDENT SHOP</span>
            </div>
        </div>

        <!-- Модальное окно поиска -->
        <div id="searchModal" class="search-modal hidden">
            <div class="search-modal-content">
                <header class="search-header">
                    <div class="header-left">
                        <img src="/icons/close-black.png" alt="Close" class="close-icon">
                        <span class="close-text">Close</span>
                    </div>
                    <div class="search-header-icons">
                        <img src="/icons/cart-black.png" alt="Cart" class="header-icon">
                        <img src="/icons/account-black.png" alt="Account" class="header-icon">
                    </div>
                </header>
                <div class="header-divider"></div>
                <div class="search-bar">
                    <img src="/icons/search-black.png" alt="Search" class="search-icon">
                    <input type="text" id="searchInput" placeholder="What are you looking for">
                </div>
                <div class="search-results"></div>
                <div class="search-suggestions">
                    <h3 class="suggestions-title">You may also like</h3>
                    <div class="suggestions-row">
                        <a href="/catalog?tag=beautifyl" class="suggestion">
                            <img src="/categories/beautifyl.jpg" alt="beautifyl">
                        </a>
                        <a href="/catalog?tag=trump" class="suggestion">
                            <img src="/categories/trump.jpg" alt="Trump">
                        </a>
                        <a href="/catalog?tag=zelenski" class="suggestion">
                            <img src="/categories/zelenski.jpg" alt="zelenski">
                        </a>
                        <a href="/catalog?tag=obama" class="suggestion">
                            <img src="/categories/obama.jpg" alt="Obama">
                        </a>
                    </div>
                </div>
                <div class="search-footer">
                    <a href="/home" class="go-back">Go back to the main page</a>
                </div>
            </div>
        </div>
    `;

    //открытие в модальных окнах иконок
    function setupModalIcons(modal: HTMLElement) {
      const cartIcon = modal.querySelector(".header-icon[alt='Cart']");
      const accountIcon = modal.querySelector(".header-icon[alt='Account']");
      const searchIcon = modal.querySelector(".header-icon[alt='Search']");

      // корзина
      cartIcon?.addEventListener("click", () => {
        navigate("/cart");
      });

      // аккаунт
      accountIcon?.addEventListener("click", () => {
        if (localStorage.getItem("userToken")) {
          openLogoutModal();
        } else {
          navigate("/login");
        }
    });
    } 


    // Логика скролла хедера
    function setupHeaderScroll() {
        const header = document.querySelector(".header");
        if (!header) return;

        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // Рендер результатов поиска
    function renderSearchResults(results: string[]) {
        const resultsBlock = document.querySelector(".search-results") as HTMLDivElement;
        if (!resultsBlock) return;
        resultsBlock.innerHTML = results.map(r => `<p>${r}</p>`).join("");
    }

    // Рендер предложений поиска
    function renderSearchSuggestions(suggestions: { name: string, tag: string, img: string }[]) {
        const suggestionsBlock = document.querySelector(".search-suggestions") as HTMLDivElement;
        if (!suggestionsBlock) return;
        suggestionsBlock.innerHTML = suggestions.map(s => `
            <a href="/catalog?tag=${s.tag}" class="suggestion">
                <img src="${s.img}" alt="${s.name}">
                <p>${s.name}</p>
            </a>
        `).join("");
    }

    // Логика поля поиска
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    searchInput.addEventListener("focus", () => {
        if (searchInput.value === "What are you looking for") searchInput.value = "";
    });
    searchInput.addEventListener("blur", () => {
        if (searchInput.value === "") searchInput.value = "What are you looking for";
    });

    // Логика корзины
    const cartIcon = document.querySelector(".cart-icon");
    cartIcon?.addEventListener("click", () => navigate("/cart"));

    // Логика модалки поиска
    function setupSearchIcon() {
        const searchIcon = document.querySelector(".header-icons img[alt='Search']");
        const searchModal = document.getElementById("searchModal");
        const closeBtn = document.querySelector(".close-icon");

        if (!searchIcon || !searchModal || !closeBtn) return;

        searchIcon.addEventListener("click", () => {
            searchModal.classList.remove("hidden");
            searchModal.classList.add("open");
            document.body.classList.add("no-scroll");
            document.documentElement.classList.add("no-scroll");
        });

        closeBtn.addEventListener("click", () => {
            searchModal.classList.remove("open");
            searchModal.classList.add("closing");

            setTimeout(() => {
                searchModal.classList.remove("closing");
                searchModal.classList.add("hidden");
                document.body.classList.remove("no-scroll");
                document.documentElement.classList.remove("no-scroll");
            }, 400);
        });

        searchModal.addEventListener("click", (e) => {
            if (e.target === searchModal && closeBtn instanceof HTMLElement) {
                closeBtn.click();
            }
        });
        setupModalIcons(searchModal as HTMLElement);
    }
    
    setupSearchIcon();

    // Логика аккаунта
    setupAccountIcon();

    function isLoggedIn() {
        return localStorage.getItem("userToken") !== null;
    }

    function setupAccountIcon() {
        const accountIcon = document.querySelector(".account-icon");
        if (!accountIcon) return;

        accountIcon.addEventListener("click", () => {
            if (isLoggedIn()) {
                openLogoutModal();
            } else {
                navigate("/login");
            }
        });
    }

    function openLogoutModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <p>So far, only logging out of the account</p>
                <button class="submit-btn" id="logout-btn">Exit</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("logout-btn")?.addEventListener("click", () => {
            localStorage.removeItem("userToken");
            modal.remove();
            navigate("/login");
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) modal.remove();
        });
    }

    // Логика смены фото при наведении на футер
    const footer = document.querySelector(".footer");
    const icons = document.querySelectorAll(".icon, .logo");

    if (footer) {
                footer.addEventListener("mouseenter", () => {
            icons.forEach(img => {
                const el = img as HTMLImageElement;
                const alt = el.getAttribute("data-alt");
                if (alt) el.src = alt;
            });
        });

        footer.addEventListener("mouseleave", () => {
            icons.forEach(img => {
                const el = img as HTMLImageElement;
                const original = el.getAttribute("src");
                if (original) el.src = original;
            });
        });
    }

    setupHeaderScroll();
}

// Каталог
function renderCatalogPage() {
    if (!app) return;

    app.innerHTML = `
        <div class="catalog-page fade-in">
            <header class="catalog-header">
                <div class="header-top">
                    <div class="header-logo">
                        <img src="/logo-black.png" alt="Shop Logo" class="logo">
                    </div>
                    <div class="header-icons">
                        <img src="/icons/search-black.png" alt="Search" class="icon search-icon">
                        <img src="/icons/filter-black.png" alt="Filter" class="icon filter-icon">
                        <img src="/icons/cart-black.png" alt="Cart" class="icon cart-icon">
                        <img src="/icons/account-black.png" alt="Account" class="icon account-icon">
                    </div>
                </div>
                <nav class="header-nav-2">
                    <a href="/catalog?category=president">PRESIDENT</a>
                    <a href="/catalog?category=dakimakura">DAKIMAKURA</a>
                    <a href="/catalog?category=merch">MERCH</a>
                </nav>
            </header>
            <div class="catalog-grid">
                <!-- ряд 1 -->
                <div class="row">
                    <div class="half small-cards">
                    <div class="product-card small">
                        <img src="/products/beautifyl.jpg" alt="Item 1">
                        <div class="info">
                        <h3 class="product-title">Product Name</h3>
                        <p class="product-price">$199</p>
                        <button class="cart-btn">
                        <img src="/icons/my-cart.png" alt="Cart">
                        </button>
                        </div>
                    </div>
                    <div class="product-card small">
                        <img src="/products/obama.jpg" alt="Item 2">
                        <div class="info">
                        <h3 class="product-title">Product Name</h3>
                        <p class="product-price">$199</p>
                        <button class="cart-btn">
                        <img src="/icons/my-cart.png" alt="Cart">
                        </button>
                        </div>
                    </div>
                    </div>
                    <div class="half">
                    <div class="product-card large">
                        <img src="/products/trump.jpg" alt="Item 3">
                        <div class="info">
                        <h3 class="product-title">Product Name</h3>
                        <p class="product-price">$199</p>
                        <button class="cart-btn">
                        <img src="/icons/my-cart.png" alt="Cart">
                        </button>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- ряд 2 (зеркально) -->
                <div class="row reverse">
                    <div class="half">
                    <div class="product-card large">
                        <img src="/products/beautifyl.jpg" alt="Item 4">
                        <div class="info">
                       <h3 class="product-title">Product Name</h3>
                        <p class="product-price">$199</p>
                        <button class="cart-btn">
                        <img src="/icons/my-cart.png" alt="Cart">
                        </button>

                        </div>
                    </div>
                    </div>
                    <div class="half small-cards">
                    <div class="product-card small">
                        <img src="/products/obama.jpg" alt="Item 5">
                        <div class="info">
                        <h3 class="product-title">Product Name</h3>
                        <p class="product-price">$199</p>
                        <button class="cart-btn">
                        <img src="/icons/my-cart.png" alt="Cart">
                        </button>
                        </div>
                    </div>
                    <div class="product-card small">
                        <img src="/products/trump.jpg" alt="Item 6">
                        <div class="info">
                        <h3 class="product-title">Product Name</h3>
                        <p class="product-price">$199</p>
                        <button class="cart-btn">
                        <img src="/icons/my-cart.png" alt="Cart">
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Модальное окно поиска -->
        <div id="searchModal" class="search-modal hidden">
            <div class="search-modal-content">
                <header class="search-header">
                    <div class="header-left">
                        <img src="/icons/close-black.png" alt="Close" class="close-icon">
                        <span class="close-text">Close</span>
                    </div>
                    <div class="search-header-icons">
                        <img src="/icons/filter-black.png" alt="filter" class="header-icon">
                        <img src="/icons/cart-black.png" alt="Cart" class="header-icon">
                        <img src="/icons/account-black.png" alt="Account" class="header-icon">
                    </div>
                </header>
                <div class="header-divider"></div>
                <div class="search-bar">
                    <img src="/icons/search-black.png" alt="Search" class="search-icon">
                    <input type="text" id="searchInput" placeholder="What are you looking for">
                </div>
                <div class="search-results"></div>
                <div class="search-suggestions">
                    <h3 class="suggestions-title">You may also like</h3>
                    <div class="suggestions-row">
                        <a href="/catalog?tag=beautifyl" class="suggestion">
                            <img src="/categories/beautifyl.jpg" alt="beautifyl">
                        </a>
                        <a href="/catalog?tag=trump" class="suggestion">
                            <img src="/categories/trump.jpg" alt="Trump">
                        </a>
                        <a href="/catalog?tag=zelenski" class="suggestion">
                            <img src="/categories/zelenski.jpg" alt="zelenski">
                        </a>
                        <a href="/catalog?tag=obama" class="suggestion">
                            <img src="/categories/obama.jpg" alt="Obama">
                        </a>
                    </div>
                </div>
                <div class="search-footer">
                    <a href="/home" class="go-back">Go back to the main page</a>
                </div>
            </div>
        </div>

        <!-- Модальное окно фильтрации -->
        <div id="filterModal" class="filter-modal hidden">
            <div class="filter-modal-content">
                <header class="filter-header">
                    <div class="header-left">
                        <img src="/icons/close-black.png" alt="Close" class="close-icon">
                        <span class="close-text">Close</span>
                    </div>
                    <div class="filter-header-icons">
                        <img src="/icons/search-black.png" alt="search" class="header-icon">
                        <img src="/icons/cart-black.png" alt="Cart" class="header-icon">
                        <img src="/icons/account-black.png" alt="Account" class="header-icon">
                    </div>
                </header>
                <div class="header-divider"></div>
                <div class="filter-body">
                    <div class="filter-section">
                        <h3>By price</h3>
                        <div class="price-inputs">
                            <label class="filter-label">from:</label>
                            <input type="number" class="filter-input" placeholder="0">
                            <label class="filter-label">to:</label>
                            <input type="number" class="filter-input" placeholder="1000">
                        </div>
                    </div>
                    <div class="filter-section">
                        <h3>Category</h3>
                        <div class="filter-options category-options">
                            <button class="filter-btn">PRESIDENT</button>
                            <button class="filter-btn">DAKIMAKURA</button>
                            <button class="filter-btn">MERCH</button>
                        </div>
                    </div>
                    <div class="filter-section">
                        <h3>Delivery</h3>
                        <div class="filter-options delivery-options">
                            <button class="filter-btn">today</button>
                            <button class="filter-btn">tomorrow</button>
                            <button class="filter-btn">until 5 days</button>
                        </div>
                    </div>
                </div>
                <div class="filter-footer">
                    <a href="/home" class="go-back">Go back to the main page</a>
                </div>
            </div>
        </div>
    `;
    const cartIcon = document.querySelector(".cart-icon");
    cartIcon?.addEventListener("click", () => navigate("/cart"));

    setupAccountIcon();

    function isLoggedIn() {
        return localStorage.getItem("userToken") !== null;
    }

    function setupAccountIcon() {
        const accountIcon = document.querySelector(".account-icon");
        if (!accountIcon) return;

        accountIcon.addEventListener("click", () => {
            if (isLoggedIn()) {
                openLogoutModal();
            } else {
                navigate("/login");
            }
        });
    }

    function openLogoutModal() {
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <p>So far, only logging out of the account</p>
                <button class="submit-btn" id="logout-btn">Exit</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("logout-btn")?.addEventListener("click", () => {
            localStorage.removeItem("userToken");
            modal.remove();
            navigate("/login");
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) modal.remove();
        });
    }

    //открытие в модальных окнах иконок
    function setupModalIcons(modal: HTMLElement) {
      const cartIcon = modal.querySelector(".header-icon[alt='Cart']");
      const accountIcon = modal.querySelector(".header-icon[alt='Account']");
      const searchIcon = modal.querySelector(".header-icon[alt='Search']");
      const filterModal = modal.querySelector(".header-icon[alt='filter']");

      // корзина
      cartIcon?.addEventListener("click", () => {
        navigate("/cart");
      });

      // аккаунт
      accountIcon?.addEventListener("click", () => {
        if (localStorage.getItem("userToken")) {
          openLogoutModal();
        } else {
          navigate("/login");
        }
    });
    cartIcon?.addEventListener("click", () => {
        navigate("/cart");
      });
    // поиск
    const searchIconInFilter = modal.querySelector(".header-icon[alt='search']");
    searchIconInFilter?.addEventListener("click", () => {
        const searchModal = document.getElementById("searchModal");
        const filterModal = document.getElementById("filterModal");

        if (!searchModal) return;

        // открываем поиск
        searchModal.classList.remove("hidden");
        searchModal.classList.add("open");
        document.body.classList.add("no-scroll");

        // закрываем фильтр, если он открыт
        if (filterModal?.classList.contains("open")) {
            filterModal.classList.remove("open");
            filterModal.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        }
    });

    // фильтр
    const filterIconInFilter = modal.querySelector(".header-icon[alt='filter']");
        filterIconInFilter?.addEventListener("click", () => {
        const searchModal = document.getElementById("searchModal");
        const filterModal = document.getElementById("filterModal");

        if (!filterModal) return;

        // открываем фильтр
        filterModal.classList.remove("hidden");
        filterModal.classList.add("open");
        document.body.classList.add("no-scroll");

        // закрываем поиск, если он открыт
        if (searchModal?.classList.contains("open")) {
            searchModal.classList.remove("open");
            searchModal.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        }
    });
    }

    function setupFilterModal() {
        const filterIcon = document.querySelector(".filter-icon");
        const filterModal = document.getElementById("filterModal");
        const closeBtn = filterModal?.querySelector(".close-icon");

        if (!filterIcon || !filterModal || !closeBtn) return;

        filterIcon.addEventListener("click", () => {
            filterModal.classList.remove("hidden");
            filterModal.classList.add("open");
            document.body.classList.add("no-scroll");
        });

        closeBtn.addEventListener("click", () => {
            filterModal.classList.remove("open");
            filterModal.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        });

        document.querySelectorAll(".filter-options").forEach(group => {
            group.querySelectorAll(".filter-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    group.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                });
            });
        });
        setupModalIcons(filterModal);

    }
    function setupSearchIcon() {
        const searchIcon = document.querySelector(".header-icons img[alt='Search']");
        const searchModal = document.getElementById("searchModal");
        const closeBtn = document.querySelector(".close-icon");

        if (!searchIcon || !searchModal || !closeBtn) return;

        searchIcon.addEventListener("click", () => {
            searchModal.classList.remove("hidden");
            searchModal.classList.add("open");
            document.body.classList.add("no-scroll");
            document.documentElement.classList.add("no-scroll");
        });

        closeBtn.addEventListener("click", () => {
            searchModal.classList.remove("open");
            searchModal.classList.add("closing");

            setTimeout(() => {
                searchModal.classList.remove("closing");
                searchModal.classList.add("hidden");
                document.body.classList.remove("no-scroll");
                document.documentElement.classList.remove("no-scroll");
            }, 400);
        });

        searchModal.addEventListener("click", (e) => {
            if (e.target === searchModal && closeBtn instanceof HTMLElement) {
                closeBtn.click();
            }
        });
        setupModalIcons(searchModal);
    }
    setupSearchIcon();
    setupFilterModal();
}

// Корзина
function renderCartPage() {
    if (!app) return;

    app.innerHTML = `
        <div class="cart-page fade-in">
            <h1>Your Cart</h1>
            <p>So far, the cart is empty.</p>
        </div>
    `;
}

// ----------------------- РОУТЕР -----------------------
function router() {
    console.log("ROUTER STARTED", window.location.pathname);
    const path = window.location.pathname;

    if (path !== "/") {
        loader?.style.setProperty("display", "none");
        btn?.style.setProperty("display", "none");
    }

    if (path === "/") {
        loader?.classList.remove("hidden");
        setTimeout(() => {
            loader!.style.opacity = "0";
            setTimeout(() => {
                loader!.style.display = "none";
                btn?.classList.remove("hidden");
            }, 500);
        }, 1500);

        btn?.addEventListener("click", () => navigate("/login"));
        return;
    }

    if (path === "/login") return renderLoginPage();
    if (path === "/registration") return renderRegistrationPage();
    if (path === "/disclaimer") return renderDisclaimerPage();
    if (path === "/code") return renderCodePage();
    if (path === "/home") return renderHomePage();
    if (path === "/cart") return renderCartPage();
    if (path.startsWith("/catalog")) return renderCatalogPage();

    if (app) app.innerHTML = "<h1>404 — Страница не найдена</h1>";
}

// ----------------------- ЗАПУСК -----------------------
window.addEventListener("popstate", router);
if (document.readyState === "complete") {
    router();
} else {
    window.addEventListener("load", router);
}
