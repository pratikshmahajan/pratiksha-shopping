
import { useEffect, useMemo, useState } from "react";
import "./index.css";

const PRODUCTS = [
  { id: 1, name: "Floral Summer Dress", category: "Fashion", price: 799, oldPrice: 1199, emoji: "👗", color: "#ffe3ed", rating: 4.8 },
  { id: 2, name: "Pink Handbag", category: "Fashion", price: 999, oldPrice: 1499, emoji: "👜", color: "#fce7f3", rating: 4.7 },
  { id: 3, name: "Classic Denim Jacket", category: "Fashion", price: 1299, oldPrice: 1799, emoji: "🧥", color: "#dbeafe", rating: 4.6 },
  { id: 4, name: "Casual Sneakers", category: "Footwear", price: 1199, oldPrice: 1599, emoji: "👟", color: "#e0e7ff", rating: 4.8 },
  { id: 5, name: "Elegant Heels", category: "Footwear", price: 899, oldPrice: 1299, emoji: "👠", color: "#fce7f3", rating: 4.5 },
  { id: 6, name: "Everyday Sandals", category: "Footwear", price: 499, oldPrice: 799, emoji: "🩴", color: "#ffedd5", rating: 4.4 },
  { id: 7, name: "Rose Glow Lipstick", category: "Beauty", price: 299, oldPrice: 399, emoji: "💄", color: "#ffe4e6", rating: 4.8 },
  { id: 8, name: "Skin Care Essentials", category: "Beauty", price: 599, oldPrice: 899, emoji: "🧴", color: "#fef3c7", rating: 4.7 },
  { id: 9, name: "Perfume Gift Set", category: "Beauty", price: 899, oldPrice: 1199, emoji: "🌸", color: "#f3e8ff", rating: 4.9 },
  { id: 10, name: "Wireless Headphones", category: "Electronics", price: 1499, oldPrice: 1999, emoji: "🎧", color: "#e0e7ff", rating: 4.8 },
  { id: 11, name: "Smart Watch", category: "Electronics", price: 1999, oldPrice: 2699, emoji: "⌚", color: "#dbeafe", rating: 4.6 },
  { id: 12, name: "Portable Speaker", category: "Electronics", price: 999, oldPrice: 1399, emoji: "🔊", color: "#ede9fe", rating: 4.5 },
  { id: 13, name: "Pearl Earrings", category: "Accessories", price: 249, oldPrice: 399, emoji: "💎", color: "#fce7f3", rating: 4.8 },
  { id: 14, name: "Stylish Sunglasses", category: "Accessories", price: 399, oldPrice: 599, emoji: "🕶️", color: "#ffedd5", rating: 4.5 },
  { id: 15, name: "Minimalist Watch", category: "Accessories", price: 699, oldPrice: 999, emoji: "⌚", color: "#f3e8ff", rating: 4.6 },
  { id: 16, name: "Soft Cushion Set", category: "Home & Living", price: 499, oldPrice: 699, emoji: "🛋️", color: "#fce7f3", rating: 4.7 },
  { id: 17, name: "Decorative Table Lamp", category: "Home & Living", price: 799, oldPrice: 1099, emoji: "💡", color: "#fef3c7", rating: 4.6 },
  { id: 18, name: "Ceramic Coffee Mug", category: "Home & Living", price: 249, oldPrice: 349, emoji: "☕", color: "#ffedd5", rating: 4.8 },
  { id: 19, name: "Cute Notebook Set", category: "Books", price: 199, oldPrice: 299, emoji: "📚", color: "#dbeafe", rating: 4.7 },
  { id: 20, name: "Daily Planner", category: "Books", price: 249, oldPrice: 399, emoji: "📒", color: "#ede9fe", rating: 4.8 },
  { id: 21, name: "Inspirational Book", category: "Books", price: 349, oldPrice: 499, emoji: "📖", color: "#dcfce7", rating: 4.6 },
  { id: 22, name: "College Backpack", category: "Bags", price: 899, oldPrice: 1299, emoji: "🎒", color: "#dbeafe", rating: 4.8 },
  { id: 23, name: "Travel Duffel Bag", category: "Bags", price: 1099, oldPrice: 1599, emoji: "🧳", color: "#f3e8ff", rating: 4.6 },
  { id: 24, name: "Cute Mini Sling Bag", category: "Bags", price: 599, oldPrice: 899, emoji: "👛", color: "#ffe4e6", rating: 4.7 },
];

const CATEGORIES = [
  { name: "Fashion", emoji: "👗", description: "Everyday styles" },
  { name: "Beauty", emoji: "💄", description: "Your beauty picks" },
  { name: "Electronics", emoji: "🎧", description: "Smart essentials" },
  { name: "Footwear", emoji: "👟", description: "Step out in style" },
  { name: "Accessories", emoji: "💎", description: "Little details" },
  { name: "Home & Living", emoji: "🏡", description: "Love your space" },
  { name: "Books", emoji: "📚", description: "Read and grow" },
  { name: "Bags", emoji: "👜", description: "Carry your style" },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    const users = readStorage("ps-users", []);

    if (mode === "register") {
      if (name.trim().length < 2) {
        setMessage("Please enter your full name.");
        return;
      }

      if (password.length < 6) {
        setMessage("Password must contain at least 6 characters.");
        return;
      }

      if (users.some((item) => item.email === cleanEmail)) {
        setMessage("This email is already registered. Please log in.");
        return;
      }

      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        password,
      };

      localStorage.setItem(
        "ps-users",
        JSON.stringify([...users, newUser])
      );

      onAuthenticated({ name: newUser.name, email: newUser.email });
      return;
    }

    const existingUser = users.find(
      (item) =>
        item.email === cleanEmail && item.password === password
    );

    if (!existingUser) {
      setMessage("Invalid email or password. Please try again.");
      return;
    }

    onAuthenticated({
      name: existingUser.name,
      email: existingUser.email,
    });
  }

  return (
    <main className="auth-screen">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <section className="auth-card">
        <div className="brand-logo auth-logo">
          <span className="brand-heart">♥</span>
          <span>Pratiksha</span>
          <strong>Shopping</strong>
        </div>

        <div className="auth-illustration">🛍️</div>

        <p className="eyebrow">YOUR HAPPY SHOPPING PLACE</p>

        <h1>
          {mode === "login" ? "Welcome back!" : "Join our happy place!"}
        </h1>

        <p className="auth-subtitle">
          {mode === "login"
            ? "Log in to discover lovely finds and lovely prices."
            : "Create your account and find something lovely today."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <label>
              Full name
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={6}
            />
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="primary-button auth-submit" type="submit">
            {mode === "login" ? "Login to Shop →" : "Create My Account →"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage("");
            }}
          >
            {mode === "login" ? "Create an account" : "Login"}
          </button>
        </p>

        <p className="auth-note">
          ♡ Lovely finds, lovely prices, just for you.
        </p>
      </section>
    </main>
  );
}

function ProductCard({ product, favorite, onFavorite, onAdd }) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <article className="product-card">
      <div className="product-art" style={{ background: product.color }}>
        <span className="discount-tag">{discount}% OFF</span>

        <button
          className={`favorite-button ${favorite ? "favorited" : ""}`}
          onClick={() => onFavorite(product)}
          aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          title={favorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          {favorite ? "♥" : "♡"}
        </button>

        <span className="product-emoji">{product.emoji}</span>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-rating">★ {product.rating} <span>Customer rating</span></p>

        <div className="product-price-row">
          <strong>{money(product.price)}</strong>
          <del>{money(product.oldPrice)}</del>
        </div>

        <button
          className="add-cart-button"
          onClick={() => onAdd(product)}
        >
          + Add to Cart
        </button>
      </div>
    </article>
  );
}

export default function App() {
  // Login page appears first whenever the app is refreshed.
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => readStorage("ps-cart", []));
  const [wishlist, setWishlist] = useState(() =>
    readStorage("ps-wishlist", [])
  );

  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem("ps-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ps-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function goHome() {
    setPage("home");
    setSelectedCategory("");
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCategory(category) {
    setSelectedCategory(category);
    setPage("category");
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addToCart(product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);

      return found
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...current, { ...product, quantity: 1 }];
    });

    notify(`${product.name} added to your cart!`);
  }

  function changeQuantity(id, change) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleFavorite(product) {
    const isFavorite = wishlist.includes(product.id);

    setWishlist((current) =>
      isFavorite
        ? current.filter((id) => id !== product.id)
        : [...current, product.id]
    );

    notify(
      isFavorite
        ? "Removed from your wishlist."
        : "Added to your wishlist ♥"
    );
  }

  function logout() {
    setUser(null);
    goHome();
    notify("You have logged out.");
  }

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const visibleProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (page === "category" && selectedCategory) {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (page === "wishlist") {
      result = result.filter((product) => wishlist.includes(product.id));
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [page, selectedCategory, search, sort, wishlist]);

  // Never show the shopping store before login or registration.
  if (!user) {
    return (
      <AuthPage
        onAuthenticated={(authenticatedUser) => {
          setUser(authenticatedUser);
          notify("Welcome to Pratiksha Shopping! 💗");
        }}
      />
    );
  }

  function renderProductGrid(products) {
    if (products.length === 0) {
      return (
        <div className="empty-state">
          <span>🛍️</span>
          <h3>Nothing lovely found just yet!</h3>
          <p>Try another search or explore more collections.</p>
          <button className="primary-button" onClick={goHome}>
            Continue Shopping
          </button>
        </div>
      );
    }

    return (
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            favorite={wishlist.includes(product.id)}
            onFavorite={toggleFavorite}
            onAdd={addToCart}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="store">
      <div className="announcement">
        ✨ HAPPY SHOPPING DAYS — lovely finds, lovely prices! ✨
      </div>

      <header className="site-header">
        <button className="brand-logo header-logo" onClick={goHome}>
          <span className="brand-heart">♥</span>
          <span>Pratiksha</span>
          <strong>Shopping</strong>
        </button>

        <div className="header-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search products, categories..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              if (page === "cart") setPage("home");
              if (page === "wishlist") setPage("home");
            }}
          />
        </div>

        <div className="header-actions">
          <button
            className="header-action"
            onClick={() => {
              setPage("wishlist");
              setSelectedCategory("");
            }}
          >
            <span>♡</span>
            <small>Wishlist</small>
            <b>{wishlist.length}</b>
          </button>

          <button
            className="header-action"
            onClick={() => setPage("cart")}
          >
            <span>🛍</span>
            <small>Cart</small>
            <b>{cartCount}</b>
          </button>

          <button className="logout-button" onClick={logout}>
            ↪ Logout
          </button>
        </div>
      </header>

      <div className="welcome-strip">
        <div>
          <strong>Welcome, {user.name} 💗</strong>
          <span>Find something lovely today.</span>
        </div>
        <span className="welcome-sparkle">✦</span>
      </div>

      <nav className="main-nav">
        <button onClick={goHome} className={page === "home" ? "nav-active" : ""}>
          Home
        </button>

        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => openCategory(category.name)}
            className={
              selectedCategory === category.name ? "nav-active" : ""
            }
          >
            {category.name}
          </button>
        ))}
      </nav>

      <main>
        {page === "home" && (
          <>
            {!search && (
              <>
                <section className="hero">
                  <div className="hero-content">
                    <span className="hero-label">♡ A LITTLE SOMETHING SPECIAL</span>
                    <h1>
                      Your style.
                      <br />
                      Your happiness.
                      <br />
                      <span>Your shopping story.</span>
                    </h1>
                    <p>
                      Discover lovely fashion, beauty essentials and
                      little things that make every day special.
                    </p>

                    <div className="hero-buttons">
                      <button
                        className="primary-button"
                        onClick={() => {
                          setPage("category");
                          setSelectedCategory("");
                        }}
                      >
                        Explore Collection →
                      </button>

                      <button
                        className="secondary-button"
                        onClick={() => openCategory("Fashion")}
                      >
                        Shop Fashion
                      </button>
                    </div>

                    <div className="hero-benefits">
                      <span>♡ Lovely choices</span>
                      <span>✦ Great prices</span>
                      <span>✓ Easy shopping</span>
                    </div>
                  </div>

                  <div className="hero-art">
                    <div className="hero-circle">
                      <span className="hero-bag">🛍️</span>
                      <span className="floating-item float-one">👗</span>
                      <span className="floating-item float-two">💄</span>
                      <span className="floating-item float-three">👠</span>
                      <span className="floating-item float-four">💎</span>
                    </div>
                    <div className="hero-note">
                      <span>♥</span>
                      <div>
                        <strong>Shop with love</strong>
                        <small>Find your favourites</small>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="stats-row">
                  <div><strong>24+</strong><span>Lovely products</span></div>
                  <div><strong>8</strong><span>Collections</span></div>
                  <div><strong>♡ 100%</strong><span>Shopping happiness</span></div>
                </section>

                <section className="section-block">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">EXPLORE YOUR FAVOURITES</p>
                      <h2>Shop by Category</h2>
                      <p>Something lovely for every part of your life.</p>
                    </div>
                  </div>

                  <div className="category-grid">
                    {CATEGORIES.map((category) => (
                      <button
                        className="category-card"
                        key={category.name}
                        onClick={() => openCategory(category.name)}
                      >
                        <span className="category-emoji">{category.emoji}</span>
                        <strong>{category.name}</strong>
                        <small>{category.description}</small>
                        <span className="category-arrow">↗</span>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}

            <section className="section-block" id="products">
              <div className="section-heading product-heading">
                <div>
                  <p className="eyebrow">
                    {search ? "YOUR SEARCH RESULTS" : "HANDPICKED FOR YOU"}
                  </p>
                  <h2>{search ? "Search Results" : "Lovely Finds"}</h2>
                  <p>
                    {search
                      ? `Products matching "${search}"`
                      : "Discover something you will absolutely love."}
                  </p>
                </div>

                <label className="sort-control">
                  Sort by
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </label>
              </div>

              {renderProductGrid(visibleProducts)}
            </section>
          </>
        )}

        {page === "category" && (
          <section className="section-block page-section">
            <button className="back-button" onClick={goHome}>← Back to Home</button>

            <div className="section-heading">
              <div>
                <p className="eyebrow">EXPLORE YOUR FAVOURITES</p>
                <h2>{selectedCategory || "All Products"} Collection</h2>
                <p>Lovely choices, lovely prices, just for you.</p>
              </div>
              <label className="sort-control">
                Sort by
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </label>
            </div>

            {renderProductGrid(visibleProducts)}
          </section>
        )}

        {page === "wishlist" && (
          <section className="section-block page-section">
            <button className="back-button" onClick={goHome}>← Back to Home</button>
            <div className="section-heading">
              <div>
                <p className="eyebrow">SAVED WITH LOVE</p>
                <h2>My Wishlist ♡</h2>
                <p>Your favourite finds, all in one place.</p>
              </div>
            </div>
            {renderProductGrid(visibleProducts)}
          </section>
        )}

        {page === "cart" && (
          <section className="section-block page-section">
            <button className="back-button" onClick={goHome}>← Continue Shopping</button>
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR LOVELY FINDS</p>
                <h2>My Shopping Cart 🛍</h2>
                <p>Everything you picked, ready for you.</p>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <span>🛍️</span>
                <h3>Your cart is waiting for something lovely!</h3>
                <p>Explore the collection and add your favourites.</p>
                <button className="primary-button" onClick={goHome}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="cart-layout">
                <div className="cart-items">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <div className="cart-item-art" style={{ background: item.color }}>
                        <span>{item.emoji}</span>
                      </div>

                      <div className="cart-item-info">
                        <p className="product-category">{item.category}</p>
                        <h3>{item.name}</h3>
                        <strong>{money(item.price)}</strong>

                        <div className="quantity-control">
                          <button onClick={() => changeQuantity(item.id, -1)} aria-label="Decrease quantity">−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity">+</button>
                        </div>
                      </div>

                      <button
                        className="remove-button"
                        onClick={() => {
                          setCart((current) => current.filter((product) => product.id !== item.id));
                          notify("Item removed from cart.");
                        }}
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>

                <aside className="cart-summary">
                  <h3>Order Summary</h3>
                  <div><span>Items</span><span>{cartCount}</span></div>
                  <div><span>Subtotal</span><span>{money(cartTotal)}</span></div>
                  <div><span>Delivery</span><span className="free-delivery">FREE</span></div>
                  <hr />
                  <div className="summary-total"><strong>Total</strong><strong>{money(cartTotal)}</strong></div>
                  <button
                    className="primary-button checkout-button"
                    onClick={() => notify("Demo checkout: connect a payment service to accept real orders.")}
                  >
                    Proceed to Checkout →
                  </button>
                  <p className="checkout-note">♡ Thank you for shopping with us!</p>
                </aside>
              </div>
            )}
          </section>
        )}
      </main>

      <section className="newsletter">
        <div className="newsletter-icon">💌</div>
        <div>
          <p className="eyebrow">A LITTLE LOVE IN YOUR INBOX</p>
          <h2>Stay in the lovely loop!</h2>
          <p>Keep discovering new finds and happy shopping ideas.</p>
        </div>
        <button className="secondary-button" onClick={() => notify("Thanks for your interest! Newsletter signup can be connected to your backend.")}>
          Sounds Lovely ♡
        </button>
      </section>

      <footer className="site-footer">
        <button className="brand-logo footer-logo" onClick={goHome}>
          <span className="brand-heart">♥</span>
          <span>Pratiksha</span>
          <strong>Shopping</strong>
        </button>

        <p>A little shopping, a lot of happiness!</p>

        <div className="footer-links">
          <button onClick={goHome}>Home</button>
          <button onClick={() => openCategory("Fashion")}>Fashion</button>
          <button onClick={() => setPage("wishlist")}>Wishlist</button>
          <button onClick={() => setPage("cart")}>My Cart</button>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Pratiksha Shopping. All rights reserved.</span>
          <span>Made with <span className="footer-heart">♥</span> by <strong>Pratiksha Mahajan</strong></span>
        </div>
      </footer>

      {notice && <div className="toast-message">{notice}</div>}

      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
