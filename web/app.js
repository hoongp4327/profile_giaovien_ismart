(() => {
  const teachers = window.TEACHERS || [];
  const filters = window.FILTERS || [];

  const track = document.getElementById("track");
  const filterBar = document.getElementById("filters");
  const searchInput = document.getElementById("search");
  const empty = document.getElementById("empty");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const pageCurrent = document.getElementById("page-current");
  const pageTotal = document.getElementById("page-total");
  const viewer = document.getElementById("viewer");
  const viewerImg = document.getElementById("viewer-img");
  const viewerCopy = document.getElementById("viewer-copy");

  const params = new URLSearchParams(location.search);
  const state = {
    group: filters.some((f) => f.id === params.get("nhom")) ? params.get("nhom") : "all",
    query: "",
  };

  // Bỏ dấu để tìm "nga" ra "Nga", "thao" ra "Thảo"
  const normalize = (s) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

  const pad = (n) => String(n).padStart(2, "0");

  function renderFilters() {
    filterBar.innerHTML = "";
    for (const f of filters) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.role = "tab";
      btn.textContent = f.label;
      btn.setAttribute("aria-selected", String(f.id === state.group));
      btn.addEventListener("click", () => {
        state.group = f.id;
        const url = new URL(location.href);
        f.id === "all" ? url.searchParams.delete("nhom") : url.searchParams.set("nhom", f.id);
        history.replaceState(null, "", url);
        renderFilters();
        renderCards();
      });
      filterBar.append(btn);
    }
  }

  function visibleTeachers() {
    const q = normalize(state.query.trim());
    return teachers.filter((t) => {
      if (state.group !== "all" && t.group !== state.group) return false;
      if (!q) return true;
      return normalize(`${t.name} ${t.degree} ${t.school}`).includes(q);
    });
  }

  function renderCards() {
    const list = visibleTeachers();
    track.innerHTML = "";
    list.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "card";
      li.style.setProperty("--i", Math.min(i, 8));
      li.innerHTML = `
        <button class="card-link" type="button" aria-label="Xem hồ sơ ${t.name}">
          <img src="assets/cards/${t.card}" alt="${t.name} – ${t.degree}, ${t.school}"
               width="720" height="1080" loading="${i < 4 ? "eager" : "lazy"}" decoding="async">
          <span class="card-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>
          </span>
        </button>`;
      li.querySelector("button").addEventListener("click", () => openViewer(t));
      track.append(li);
    });
    empty.hidden = list.length > 0;
    track.scrollLeft = 0;
    updatePager();
  }

  // Pager: một "trang" = số card đang hiển thị trọn trên màn hình
  function metrics() {
    const first = track.querySelector(".card");
    if (!first) return { perView: 1, step: track.clientWidth, pages: 1 };
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardW = first.getBoundingClientRect().width + gap;
    const perView = Math.max(1, Math.floor((track.clientWidth + gap) / cardW + 0.01));
    const pages = Math.max(1, Math.ceil(track.children.length / perView));
    return { perView, step: cardW * perView, pages };
  }

  function updatePager() {
    const { step, pages } = metrics();
    const maxScroll = track.scrollWidth - track.clientWidth;
    let page = Math.round(track.scrollLeft / step) + 1;
    if (track.scrollLeft >= maxScroll - 2) page = pages;
    page = Math.min(Math.max(page, 1), pages);
    pageCurrent.textContent = pad(page);
    pageTotal.textContent = pad(pages);
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
  }

  prevBtn.addEventListener("click", () => track.scrollBy({ left: -metrics().step }));
  nextBtn.addEventListener("click", () => track.scrollBy({ left: metrics().step }));

  let raf = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updatePager);
  }, { passive: true });
  window.addEventListener("resize", updatePager);

  // Kéo bằng chuột trên desktop
  let drag = null;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5 && !drag.moved) {
      drag.moved = true;
      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
    }
    if (drag.moved) track.scrollLeft = drag.left - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    track.style.scrollSnapType = "";
    track.style.scrollBehavior = "";
    // chặn click mở hồ sơ ngay sau khi kéo
    track.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true });
  });

  let searchTimer = 0;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = searchInput.value;
      renderCards();
    }, 150);
  });

  // Viewer: mở card lớn, link chia sẻ dạng #slug
  let current = null;
  function openViewer(t, pushHash = true) {
    current = t;
    viewerImg.src = `assets/cards/${t.card}`;
    viewerImg.alt = `${t.name} – ${t.degree}, ${t.school}`;
    viewerCopy.textContent = "Sao chép link";
    if (pushHash) history.replaceState(null, "", `#${t.slug}`);
    if (!viewer.open) viewer.showModal();
  }
  function closeViewer() {
    viewer.close();
  }
  viewer.addEventListener("close", () => {
    current = null;
    history.replaceState(null, "", location.pathname + location.search);
  });
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer || e.target.closest("[data-close]")) closeViewer();
  });
  viewerCopy.addEventListener("click", async () => {
    if (!current) return;
    const url = `${location.origin}${location.pathname}${location.search}#${current.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      viewerCopy.textContent = "Đã sao chép";
    } catch {
      prompt("Sao chép link:", url);
    }
  });

  renderFilters();
  renderCards();

  const fromHash = teachers.find((t) => t.slug === decodeURIComponent(location.hash.slice(1)));
  if (fromHash) openViewer(fromHash, false);
})();
