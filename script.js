/* ---------- pointer effects (skipped on touch) ---------- */
const spots = [...document.querySelectorAll(".spot")];
const hero = document.getElementById("hero");
let px = -1,
  py = -1,
  raf = 0;

function updateSpots() {
  raf = 0;
  spots.forEach((el) => {
    const r = el.getBoundingClientRect();
    const near =
      px > r.left - 160 &&
      px < r.right + 160 &&
      py > r.top - 160 &&
      py < r.bottom + 160;
    el.classList.toggle("near", near);
    if (near) {
      el.style.setProperty("--x", px - r.left + "px");
      el.style.setProperty("--y", py - r.top + "px");
    }
  });
}
window.addEventListener(
  "pointermove",
  (e) => {
    if (e.pointerType === "touch") return;
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(updateSpots);
  },
  { passive: true },
);
document.documentElement.addEventListener("pointerleave", () => {
  px = py = -1;
  spots.forEach((el) => el.classList.remove("near"));
});

// hero: orange grid lines light up around the cursor
hero.addEventListener(
  "pointermove",
  (e) => {
    if (e.pointerType === "touch") return;
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", e.clientX - r.left + "px");
    hero.style.setProperty("--my", e.clientY - r.top + "px");
    hero.classList.add("lit");
  },
  { passive: true },
);
hero.addEventListener("pointerleave", () => hero.classList.remove("lit"));

// scroll progress line + keep spotlight correct while scrolling
const bar = document.getElementById("bar");
window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    if (px >= 0 && !raf) raf = requestAnimationFrame(updateSpots);
  },
  { passive: true },
);

/* ---------- triage practice (sample scenarios, not real incidents) ---------- */
const ALERTS = [
  {
    id: 1,
    sev: "hi",
    time: "09:12",
    title: "38 failed logins, then 1 success, same account",
    src: "203.0.113.24",
    host: "vpn-gw-01",
    user: "a.sharma",
    note: "Failed attempts over 4 minutes followed by a successful login from a country the user has never signed in from.",
    answer: "escalate",
    why: "Brute force followed by a success suggests a compromised account. Escalate and disable the session per playbook.",
  },
  {
    id: 2,
    sev: "md",
    time: "09:31",
    title: "Port scan across 200 hosts on TCP 445",
    src: "198.51.100.7",
    host: "fw-edge",
    user: "n/a",
    note: "Source is the internal vulnerability scanner, and the scan window matches the change ticket for this week.",
    answer: "benign",
    why: "Known scanner inside an approved window. Verify against the ticket, document it and close as benign.",
  },
  {
    id: 3,
    sev: "hi",
    time: "10:04",
    title: "Email attachment .iso opened, then cmd.exe spawned",
    src: "mail-gw",
    host: "WKS-0417",
    user: "r.gupta",
    note: "The user opened an invoice attachment from an external sender. The endpoint then launched a command shell and made an outbound connection.",
    answer: "escalate",
    why: "Phishing delivery with execution on the host. Escalate, isolate the endpoint and preserve the email.",
  },
  {
    id: 4,
    sev: "lo",
    time: "10:47",
    title: "DNS query to a newly registered domain",
    src: "10.10.4.22",
    host: "WKS-0233",
    user: "m.khan",
    note: "A single lookup, no follow-up connection. Domain is a marketing tool the team signed up for last week.",
    answer: "benign",
    why: "Single lookup with a business reason and no follow-up traffic. Note it and close, but watch for repeats.",
  },
];
const VERDICTS = [
  ["escalate", "Escalate to L2"],
  ["benign", "Close as benign"],
  ["more", "Need more info"],
];
const listEl = document.getElementById("alerts");
const detailEl = document.getElementById("detail");

function renderList(activeId) {
  listEl.innerHTML = "";
  ALERTS.forEach((a) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-pressed", String(a.id === activeId));
    b.innerHTML =
      '<span class="sev ' +
      a.sev +
      '">' +
      { hi: "high", md: "med", lo: "low" }[a.sev] +
      '</span><span class="t"></span><span class="time">' +
      a.time +
      "</span>";
    b.querySelector(".t").textContent = a.title;
    b.addEventListener("click", () => select(a.id));
    li.appendChild(b);
    listEl.appendChild(li);
  });
}

function select(id) {
  const a = ALERTS.find((x) => x.id === id);
  renderList(id);
  detailEl.innerHTML = "";
  const h = document.createElement("h3");
  h.textContent = a.title;
  const dl = document.createElement("dl");
  [
    ["source", a.src],
    ["host", a.host],
    ["user", a.user],
    ["context", a.note],
  ].forEach(([k, v]) => {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    dl.append(dt, dd);
  });
  const vs = document.createElement("div");
  vs.className = "verdicts";
  const res = document.createElement("div");
  res.className = "result";
  res.setAttribute("role", "status");
  VERDICTS.forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      const ok = key === a.answer;
      res.className = "result show";
      res.innerHTML = "";
      const s = document.createElement("b");
      s.className = ok ? "right" : "wrong";
      s.textContent = ok
        ? "Matches the usual call. "
        : "Most analysts would call this differently. ";
      res.append(s, document.createTextNode(a.why));
    });
    vs.appendChild(btn);
  });
  detailEl.append(h, dl, vs, res);
}
select(1);
