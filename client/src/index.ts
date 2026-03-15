
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
                        <button type="button" id="sendCode" class="submit-btn">SEND THE CODE</button>
                    </form>
                    <div class="auth-links">
                        <a data-link href="/disclaimer" class="link-incognito">go incognito ></a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const emailInput = document.getElementById("email") as HTMLInputElement;
const sendCodeBtn = document.getElementById("sendCode");

sendCodeBtn?.addEventListener("click", async () => {
  if (!emailInput) return;

  const email = emailInput.value.trim();
  if (!email || email === "Email") {
    alert("Введите email");
    return;
  }

  localStorage.setItem("auth_email", email);

  try {
    const res = await fetch("http://localhost:3000/auth/sendCode", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      navigate("/code");
      alert("Код отправлен на почту");
    } else {
      alert(data.error || "Ошибка при отправке кода");
    }
  } catch (e) {
    alert("Не удалось связаться с сервером");
  }
});

    emailInput.addEventListener("focus", () => emailInput.value === "Email" && (emailInput.value = ""));
    emailInput.addEventListener("blur", () => emailInput.value === "" && (emailInput.value = "Email"));
}
// Ввод кода
function renderCodePage(email: string = "user@example.com") {
    const storedEmail = localStorage.getItem("auth_email") || email;
    if (!app) return;

    app.innerHTML = `
        <div class="split-layout fade-in">
            <div class="left-panel">
                <div class="vertical-text">PRESIDENT</div>
            </div>
            <div class="right-panel">
                <div class="login-form-container">
                    <h1 class="code-title">Enter the code</h1>
                    <p class="code-email">Code sent to: ${storedEmail}</p>
                    <form id="codeForm" class="auth-form">
                        <div class="code-inputs">
                            ${"<input type='text' maxlength='1' class='code-box'>".repeat(6)}
                        </div>
                        <button type="submit" id="verifyCode" class="submit-btn">ENTER</button>
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

    const codeForm = document.getElementById("codeForm") as HTMLFormElement | null;
const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".code-box"));
const modal = document.getElementById("modal")!;
const message = document.getElementById("modal-message")!;
const buttons = document.getElementById("modal-buttons")!;
inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  }); 
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value === "" && index > 0) {
      inputs[index - 1].focus();
    }
  });
});


if (codeForm && inputs.length > 0) {
  codeForm.addEventListener("submit", async e => {
    e.preventDefault();

    const code = inputs.map(i => i.value).join("");
    const email = localStorage.getItem("auth_email");

    if (!email) {
      message.textContent = "Email not found. Try logging in again.";
      buttons.innerHTML = `<button id="closeBtn" class="submit-btn">Close</button>`;
      modal.classList.remove("hidden");
      document.getElementById("closeBtn")?.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
      return;
    }

    modal.classList.remove("hidden");
    message.textContent = "Checking the code...";

    try {
      const res = await fetch("http://localhost:3000/auth/verify-code", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.success) {
        // помечаем пользователя как авторизованного
        if (data.user?.id != null) {
          localStorage.setItem("userToken", String(data.user.id));
        }

        message.textContent = "successfully";
        buttons.innerHTML = `<button id="continueBtn" class="submit-btn">CONTINUE</button>`;
        document.getElementById("continueBtn")?.addEventListener("click", () => {
          navigate("/disclaimer");
        });
      } else {
        message.textContent = "Invalid code";
        buttons.innerHTML = `<button id="closeBtn" class="submit-btn">Close</button>`;
        document.getElementById("closeBtn")?.addEventListener("click", () => {
          modal.classList.add("hidden");
          inputs.forEach(input => input.value = "");
          inputs[0].focus();
        });
      }
    } catch (e) {
      message.textContent = "Server connection error";
      buttons.innerHTML = `<button id="closeBtn" class="submit-btn">Close</button>`;
      document.getElementById("closeBtn")?.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
    }
  });
}





    
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
    function renderSearchResults(results: { title: string; price: number }[]) {
        const resultsBlock = document.querySelector(".search-results") as HTMLDivElement;
        if (!resultsBlock) return;
        if (!results.length) {
            resultsBlock.innerHTML = "<p>No products found</p>";
            return;
        }
        resultsBlock.innerHTML = results
          .map(r => `<p>${r.title} — $${r.price}</p>`)
          .join("");
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

    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            renderSearchResults([]);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/products?q=${encodeURIComponent(query)}`);
            const products = await res.json();
            renderSearchResults(products);
        } catch {
            renderSearchResults([]);
        }
    });

    // Логика корзины
    const cartIcon = document.querySelector(".cart-icon");
    cartIcon?.addEventListener("click", () => {
        if (!localStorage.getItem("userToken")) {
            const goLogin = confirm("Only authorized users can view the cart. Do you want to log in?");
            if (goLogin) {
                navigate("/login");
            }
            return;
        }
        navigate("/cart");
    });

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



//--УВЕДОМЛЕНИЯ-----------
function showNotification(message: string, withRegisterBtn = false) {
  const notify = document.createElement("div");
  notify.className = "notify";
  notify.textContent = message;

  if (withRegisterBtn) {
    const btn = document.createElement("button");
    btn.style.background = "transparent";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.marginLeft = "10px";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      notify.remove();
      navigate("/registration");
    });
    notify.appendChild(btn);
  }

  document.body.appendChild(notify);

  // плавное появление
  setTimeout(() => notify.classList.add("show"), 50);

  // исчезает через 2 сек
  setTimeout(() => {
    notify.classList.remove("show");
    setTimeout(() => notify.remove(), 400);
  }, 2000);
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
                    <a href="/catalog?category=president" data-category="president">PRESIDENT</a>
                    <a href="/catalog?category=dakimakura" data-category="dakimakura">DAKIMAKURA</a>
                    <a href="/catalog?category=merch" data-category="merch">MERCH</a>
                </nav>
            </header>
            <div class="catalog-grid" id="catalogGrid"></div>
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
    cartIcon?.addEventListener("click", () => {
        if (!localStorage.getItem("userToken")) {
            const goLogin = confirm("Only authorized users can view the cart. Do you want to log in?");
            if (goLogin) {
                navigate("/login");
            }
            return;
        }
        navigate("/cart");
    });

    const grid = document.getElementById("catalogGrid") as HTMLDivElement | null;

    // Текущее состояние фильтров/поиска
    const urlParams = new URLSearchParams(window.location.search);
    let currentCategory: string | undefined = urlParams.get("category") || undefined;
    let currentSearch = "";
    let currentPriceFrom: number | null = null;
    let currentPriceTo: number | null = null;

    let baseProducts: any[] = [];

    function applyClientFilters(products: any[]): any[] {
        let filtered = [...products];

        if (currentPriceFrom !== null) {
            filtered = filtered.filter(p => typeof p.price === "number" && p.price >= currentPriceFrom!);
        }
        if (currentPriceTo !== null) {
            filtered = filtered.filter(p => typeof p.price === "number" && p.price <= currentPriceTo!);
        }

        return filtered;
    }

    function renderProductsToGrid(products: any[]) {
    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = "<p>No products found</p>";
        return;
    }

    grid.innerHTML = products
      .map((p: any, index: number) => {
        // Определяем размер карточки по позиции
        const isLarge = (Math.floor(index / 3) % 2 === 0 && index % 3 === 2) ||
                        (Math.floor(index / 3) % 2 === 1 && index % 3 === 0);
        const sizeClass = isLarge ? "large" : "small";

        return `
          <div class="product-card ${sizeClass}">
            <img src="${p.images?.preview ?? ""}" alt="${p.title}">
            <div class="info">
              <h3 class="product-title" data-title="basket">${p.title}</h3>
              <div class="price-row">
                <p class="product-price" data-price="basket">$${p.price}</p>
                <button class="cart-btn" data-product-id="${p.id}">
                  <img src="/icons/my-cart.png" alt="Cart">
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Логика добавления в корзину остаётся
// Универсальная функция уведомления

// Логика добавления в корзину
grid.querySelectorAll<HTMLButtonElement>(".cart-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const productId = btn.getAttribute("data-product-id");
    if (!productId) return;

    if (!localStorage.getItem("userToken")) {
      showNotification("You are not registered", true);
      return;
    }

    try {
      await fetch("http://localhost:3000/basket/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, count: 1 })
      });
      showNotification("Product added to cart");
    } catch {
      showNotification("Product addition error");
    }
  });
});


}


    async function loadProducts() {
        if (!grid) return;

        const params = new URLSearchParams();
        if (currentCategory) params.set("category", currentCategory);
        if (currentSearch.trim()) params.set("q", currentSearch.trim());

        const url = `http://localhost:3000/products${params.toString() ? `?${params.toString()}` : ""}`;

        try {
            const res = await fetch(url);
            const products = await res.json();
            baseProducts = Array.isArray(products) ? products : [];
            const filtered = applyClientFilters(baseProducts);
            renderProductsToGrid(filtered);
        } catch {
            grid.innerHTML = "<p>Error loading products</p>";
        }
    }

    // начальный рендер
    loadProducts();

    // переключение категории в шапке
    document.querySelectorAll<HTMLAnchorElement>(".header-nav-2 a[data-category]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const cat = link.dataset.category;
            if (cat) {
                currentCategory = cat;
                const url = new URL(window.location.href);
                url.searchParams.set("category", cat);
                window.history.pushState({}, "", url.toString());
                loadProducts();
            }
        });
    });

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

        // выбор категорий и доставки (визуально) + фильтр по цене
        document.querySelectorAll(".filter-options").forEach(group => {
            group.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    group.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");

                    // категории из модалки
                    if (group.classList.contains("category-options")) {
                        const text = btn.textContent?.trim().toLowerCase();
                        if (text === "president" || text === "dakimakura" || text === "merch") {
                            currentCategory = text;
                            const url = new URL(window.location.href);
                            url.searchParams.set("category", currentCategory);
                            window.history.pushState({}, "", url.toString());
                            loadProducts();
                        }
                    }
                });
            });
        });

        // инпуты цены
        const priceInputs = filterModal.querySelectorAll<HTMLInputElement>(".price-inputs .filter-input");
        const fromInput = priceInputs[0];
        const toInput = priceInputs[1];

        const handlePriceChange = () => {
            const fromVal = fromInput?.value ? Number(fromInput.value) : NaN;
            const toVal = toInput?.value ? Number(toInput.value) : NaN;

            currentPriceFrom = isNaN(fromVal) ? null : fromVal;
            currentPriceTo = isNaN(toVal) ? null : toVal;

            const filtered = applyClientFilters(baseProducts);
            renderProductsToGrid(filtered);
        };

        fromInput?.addEventListener("input", handlePriceChange);
        toInput?.addEventListener("input", handlePriceChange);

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

    // поиск в модалке каталога
    const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
    const searchResultsBlock = document.querySelector(".search-results") as HTMLDivElement | null;
    const searchModal = document.getElementById("searchModal");

    function renderNameSuggestions(query: string) {
        if (!searchResultsBlock) return;
        const q = query.trim().toLowerCase();
        if (!q) {
            searchResultsBlock.innerHTML = "";
            return;
        }

        const productsForView = applyClientFilters(baseProducts);
        const matched = productsForView.filter(p =>
            typeof p.title === "string" && p.title.toLowerCase().includes(q)
        );

        if (!matched.length) {
            searchResultsBlock.innerHTML = "<p>No products found</p>";
            return;
        }

        searchResultsBlock.innerHTML = `
            <ul class="search-results-list">
                ${matched
                    .map(
                        (p: any) =>
                            `<li class="search-result-item" data-product-id="${p.id}">${p.title}</li>`
                    )
                    .join("")}
            </ul>
        `;

        // клик по названию товара — закрываем модалку и скроллим к карточке
        searchResultsBlock
            .querySelectorAll<HTMLLIElement>(".search-result-item")
            .forEach(item => {
                item.addEventListener("click", () => {
                    const productId = item.getAttribute("data-product-id");
                    if (!productId || !grid) return;

                    // закрываем модалку
                    if (searchModal) {
                        searchModal.classList.remove("open");
                        searchModal.classList.add("hidden");
                    }
                    document.body.classList.remove("no-scroll");
                    document.documentElement.classList.remove("no-scroll");

                    // скроллим до нужной карточки
                    const btn = grid.querySelector<HTMLButtonElement>(
                        `.cart-btn[data-product-id="${productId}"]`
                    );
                    const card = btn?.closest<HTMLElement>(".product-card");
                    card?.scrollIntoView({ behavior: "smooth", block: "center" });
                });
            });
    }

    if (searchInput) {
        // динамические подсказки по названиям при вводе
        searchInput.addEventListener("input", () => {
            renderNameSuggestions(searchInput.value);
        });

        // сам поиск — только по Enter
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                currentSearch = searchInput.value.trim();
                loadProducts();

                // закрываем модальное окно
                if (searchModal) {
                    searchModal.classList.remove("open");
                    searchModal.classList.add("hidden");
                }
                document.body.classList.remove("no-scroll");
                document.documentElement.classList.remove("no-scroll");
            }
        });
    }
}

// Корзина
function renderCartPage() {
  if (!app) return;

  if (!localStorage.getItem("userToken")) {
    showNotification("Вы не зарегистрированы", true);
    return;
  }

  app.innerHTML = `
    <div class="cart-page fade-in">
      <header class="catalog-header">
        <div class="header-top">
          <div class="header-logo">
            <img src="/logo-black.png" alt="Shop Logo" class="logo" id="homeBtn">
          </div>
          <div class="header-icons">
            <img src="/icons/search-black.png" alt="Search" class="icon search-icon">
            <img src="/icons/account-black.png" alt="Account" class="icon account-icon">
          </div>
        </div>
        <nav class="header-nav-2">
          <a href="/catalog?category=president">PRESIDENT</a>
          <a href="/catalog?category=dakimakura">DAKIMAKURA</a>
          <a href="/catalog?category=merch">MERCH</a>
        </nav>
      </header>

      <div class="cart-container">
        <!-- Блок товаров -->
        <div class="cart-items">
          <div class="cart-header">
            <h2 class="cart-title">PRODUCTS</h2>
            <div class="cart-subrow">
              <span class="cart-label">total products</span>
              <span class="cart-count" id="productsCount">0</span>
              <span class="cart-link" id="removeAllBtn">remove all</span>
            </div>
          </div>
          <div class="cart-divider"></div>
          <div class="cart-list" id="cartList"><p>Loading...</p></div>
        </div>

        <!-- Блок суммы -->
        <div class="cart-summary">
          <h2 class="summary-title">TOTAL</h2>
          <div class="summary-row">
            <span class="summary-label">products</span>
            <span class="summary-count" id="summaryCount">0 pcs</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">total amount</span>
            <span class="summary-amount" id="summaryAmount">0 $</span>
          </div>
          <button class="order-btn" id="orderBtn">ORDER</button>
        </div>
      </div>
    </div>
  `;

  const cartList = document.getElementById("cartList") as HTMLDivElement;
  const summaryCount = document.getElementById("summaryCount")!;
  const summaryAmount = document.getElementById("summaryAmount")!;
  const productsCount = document.getElementById("productsCount")!;
  const orderBtn = document.getElementById("orderBtn")!;
  const removeAllBtn = document.getElementById("removeAllBtn");

  async function loadCart() {
    if (!cartList) return;

    try {
      const res = await fetch("http://localhost:3000/basket", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        cartList.innerHTML = `<p>${data?.error || "Failed to load basket"}</p>`;
        return;
      }

      const items = Array.isArray(data?.basket) ? data.basket : [];
      const total = typeof data?.totalPrice === "number"
        ? data.totalPrice
        : items.reduce((sum: number, i: any) => sum + (i?.product?.price ?? 0) * (i?.count ?? 0), 0);

      if (!items.length) {
        cartList.innerHTML = "<p>So far, the cart is empty.</p>";
        summaryCount.textContent = "0 pcs";
        summaryAmount.textContent = "0 $";
        productsCount.textContent = "0";
        if (removeAllBtn) removeAllBtn.style.display = "none";
        return;
      }

      if (removeAllBtn) removeAllBtn.style.display = "";

      cartList.innerHTML = items.map((i: any) => `
  <div class="cart-item" data-product-id="${i.product?.id ?? ""}">
    <div class="cart-left">
      <img src="${i.product?.images?.preview ?? ""}" alt="${i.product?.title ?? ""}" class="cart-img">
    </div>
    <div class="cart-right">
      <div class="cart-top">
        <h3 class="cart-title">${i.product?.title ?? ""}</h3>
        <span class="cart-price">$${((i.product?.price ?? 0) * (i.count ?? 0)).toFixed(2)}</span>
      </div>
      <p class="cart-category">Category: ${i.product?.categories?.[0] ?? ""}</p>
      <div class="cart-bottom">
        <div class="cart-counter">
          <button class="minus-btn">-</button>
          <span class="count">${i.count}</span>
          <button class="plus-btn">+</button>
        </div>
        <span class="cart-link cart-remove" data-product-id="${i.product?.id ?? ""}">remove</span>
      </div>
    </div>
  </div>
`).join("");
// Навешиваем обработчики на каждую карточку
cartList.querySelectorAll(".cart-item").forEach((el, index) => {
  const minusBtn = el.querySelector(".minus-btn") as HTMLButtonElement;
  const plusBtn = el.querySelector(".plus-btn") as HTMLButtonElement;
  const countSpan = el.querySelector(".count") as HTMLSpanElement;
  const priceDiv = el.querySelector(".cart-price") as HTMLSpanElement;

  let count = items[index].count;
  const price = items[index].product?.price ?? 0;

  function update() {
    countSpan.textContent = String(count);
    priceDiv.textContent = `$${(price * count).toFixed(2)}`;
    // пересчёт TOTAL
    const totalCount = Array.from(cartList.querySelectorAll(".count"))
      .reduce((sum, span) => sum + parseInt(span.textContent || "0"), 0);
    const totalAmount = Array.from(cartList.querySelectorAll(".cart-price"))
      .reduce((sum, div) => sum + parseFloat(div.textContent?.replace("$", "") || "0"), 0);

    summaryCount.textContent = `${totalCount} pcs`;
    summaryAmount.textContent = `${totalAmount.toFixed(2)} $`;
  }

  minusBtn.addEventListener("click", () => {
    if (count > 1) {
      count--;
      update();
    }
  });

  plusBtn.addEventListener("click", () => {
    count++;
    update();
  });
});


      // Обновляем данные в блоке суммы
      const totalCount = items.reduce((sum: number, i: any) => sum + (i?.count ?? 0), 0);
      summaryCount.textContent = `${totalCount} pcs`;
      summaryAmount.textContent = `${total.toFixed(2)} $`;
      productsCount.textContent = String(items.length);

    } catch {
      cartList.innerHTML = "<p>Failed to load basket</p>";
    }
  }

  loadCart();

  orderBtn.addEventListener("click", () => {
    showNotification("successfully");
  });

  removeAllBtn?.addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:3000/basket/clear", {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) loadCart();
    } catch {
      showNotification("Failed to clear cart", true);
    }
  });

  cartList.addEventListener("click", async (e) => {
    const removeEl = (e.target as HTMLElement).closest(".cart-remove");
    if (!removeEl) return;
    const productId = removeEl.getAttribute("data-product-id");
    if (!productId) return;
    try {
      const res = await fetch(`http://localhost:3000/basket/remove/${productId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) loadCart();
    } catch {
      showNotification("Failed to remove item", true);
    }
  });
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
    if (path === "/disclaimer") return renderDisclaimerPage();
    if (path === "/code") return renderCodePage();
    if (path === "/home") return renderHomePage();
    if (path === "/cart") {
        if (!localStorage.getItem("userToken")) {
            const goLogin = confirm("Only authorized users can view the cart. Do you want to log in?");
            if (goLogin) {
                return navigate("/login");
            }
            return;
        }
        return renderCartPage();
    }
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





//
