import { useState, useEffect, useRef } from "react";

// ─── Exact colors extracted from BTW_BookClub_Spreadsheet.xlsx ───
const C = {
  deepBurgundy:  "#4E0F24",  // title header bg & book title text
  wineRed:       "#7A1E3B",  // column header bg & primary accent
  blushRow:      "#F5E8ED",  // alternating row background
  warmCream:     "#FAF6F0",  // page background
  monthAccent:   "#B5476A",  // month/year text color
  mutedText:     "#7A6470",  // secondary text (genre, numbers)
  bodyText:      "#1C1018",  // author / main body text
  starColor:     "#C9933A",  // rating star color
  // Status badge colors — exact from spreadsheet cells
  readBg:        "#E6F4EE",  readText:    "#2E7D5A",  readBorder:    "#A8D8C0",
  currentBg:     "#F5E6C8",  currentText: "#C9933A",  currentBorder: "#E8C880",
  tbrBg:         "#EEF0F8",  tbrText:     "#4A5A9A",  tbrBorder:     "#B0BAE0",
  dnfBg:         "#F5E8E8",  dnfText:     "#8B2020",  dnfBorder:     "#D0A0A0",
};

const STATUS_META = {
  "Read":              { bg: C.readBg,    text: C.readText,    border: C.readBorder,    label: "Read" },
  "Currently Reading": { bg: C.currentBg, text: C.currentText, border: C.currentBorder, label: "Reading" },
  "To Be Read":        { bg: C.tbrBg,     text: C.tbrText,     border: C.tbrBorder,     label: "TBR" },
  "Did Not Finish":    { bg: C.dnfBg,     text: C.dnfText,     border: C.dnfBorder,     label: "DNF" },
};
const STATUS_OPTIONS = Object.keys(STATUS_META);

const BOOKS_INITIAL = [
  { id: 1,  month: "May",       year: 2026, title: "Her Last Breath",                                         author: "Taylor Adams",              genre: "Thriller",                        clubStatus: "Currently Reading", rating: "—",       notes: null,                                              myStatus: "Currently Reading" },
  { id: 2,  month: "April",     year: 2026, title: "The Lost Heiress",                                        author: "Elizabeth Klehfoth",         genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 3,  month: "March",     year: 2026, title: "The First Time I Saw Him",                                author: "Laura Dave",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 4,  month: "February",  year: 2026, title: "Onyx Storm",                                              author: "Rebecca Yarros",             genre: "Fantasy",                         clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 5,  month: "January",   year: 2026, title: "Winter Garden",                                           author: "Kristin Hannah",             genre: "Literary Fiction",                clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 6,  month: "December",  year: 2025, title: "Wreck the Halls",                                         author: "Tessa Bailey",               genre: "Romance",                         clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 7,  month: "November",  year: 2025, title: "The Woman in the Cabin",                                  author: "Becca Day",                  genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 8,  month: "November",  year: 2025, title: "The Boyfriend",                                           author: "Freida McFadden",            genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: "Bonus book",                                      myStatus: null },
  { id: 9,  month: "October",   year: 2025, title: "The Surrogate Mother",                                    author: "Freida McFadden",            genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 10, month: "October",   year: 2025, title: "The Woman in Cabin 10",                                   author: "Ruth Ware",                  genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: "Bonus book",                                      myStatus: null },
  { id: 11, month: "September", year: 2025, title: "Not Quite Dead Yet",                                      author: "Holly Jackson",              genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 12, month: "August",    year: 2025, title: "Atmosphere",                                              author: "Taylor Jenkins Reid",        genre: "Literary Fiction",                clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 13, month: "July",      year: 2025, title: "The Amalfi Curse",                                        author: "Sarah Penner",               genre: "Historical Fantasy",              clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 14, month: "June",      year: 2025, title: "The Orphanage by the Lake",                               author: "Daniel G. Miller",           genre: "Mystery Thriller",                clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 15, month: "May",       year: 2025, title: "The Blue Hour",                                           author: "Paula Hawkins",              genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 16, month: "April",     year: 2025, title: "The Lost Heiress",                                        author: "Elizabeth Klehfoth",         genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 17, month: "April",     year: 2025, title: "The Housemaid",                                           author: "Freida McFadden",            genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 18, month: "March",     year: 2025, title: "The Lake House Children",                                 author: "Gregg Dunnett",              genre: "Thriller",                        clubStatus: "Read",              rating: "★★★☆☆",   notes: null,                                              myStatus: null },
  { id: 19, month: "February",  year: 2025, title: "The First Time I Saw Him",                                author: "Laura Dave",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 20, month: "January",   year: 2025, title: "The Frozen River",                                        author: "Ariel Lawhon",               genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 21, month: "December",  year: 2024, title: "The Christmas Bookshop",                                  author: "Jenny Colgan",               genre: "Fiction",                         clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 22, month: "November",  year: 2024, title: "The Fragile Threads of Power",                            author: "V.E. Schwab",                genre: "Fantasy",                         clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 23, month: "October",   year: 2024, title: "The Heiress",                                             author: "Rachel Hawkins",             genre: "Mystery Thriller",                clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 24, month: "September", year: 2024, title: "The Midnight Feast",                                      author: "Lucy Foley",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 25, month: "August",    year: 2024, title: "The Wilds",                                               author: "Sarah Pearse",               genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 26, month: "July",      year: 2024, title: "The Fury",                                                author: "Alex Michaelides",           genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 27, month: "June",      year: 2024, title: "End of Story",                                            author: "A.J. Finn",                  genre: "Thriller",                        clubStatus: "Read",              rating: "★★★☆☆",   notes: null,                                              myStatus: null },
  { id: 28, month: "May",       year: 2024, title: "Iron Flame",                                              author: "Rebecca Yarros",             genre: "Fantasy",                         clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 29, month: "April",     year: 2024, title: "Fourth Wing",                                             author: "Rebecca Yarros",             genre: "Fantasy",                         clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 30, month: "March",     year: 2024, title: "Hello Beautiful",                                         author: "Ann Napolitano",             genre: "Literary Fiction",                clubStatus: "Read",              rating: "★★★★☆",   notes: "Oprah's Book Club",                               myStatus: null },
  { id: 31, month: "February",  year: 2024, title: "Yellowface",                                              author: "R.F. Kuang",                 genre: "Literary Fiction",                clubStatus: "Read",              rating: "★★★★★",   notes: "Goodreads Best Fiction 2023",                     myStatus: null },
  { id: 32, month: "January",   year: 2024, title: "The Other Mrs.",                                          author: "Mary Kubica",                genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 33, month: "November",  year: 2023, title: "The Whispers",                                            author: "Ashley Audrain",             genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 34, month: "October",   year: 2023, title: "None of This Is True",                                   author: "Lisa Jewell",                genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 35, month: "September", year: 2023, title: "One Last Rainy Day",                                      author: "Kate Stewart",               genre: "Romance",                         clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 36, month: "July",      year: 2023, title: "The Book Haters' Book Club",                              author: "Gretchen Anthony",           genre: "Fiction",                         clubStatus: "Read",              rating: "★★★☆☆",   notes: null,                                              myStatus: null },
  { id: 37, month: "June",      year: 2023, title: "Homecoming",                                              author: "Kate Morton",                genre: "Mystery",                         clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 38, month: "May",       year: 2023, title: "The Cuban Heiress",                                       author: "Chanel Cleeton",             genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★☆",   notes: "Bonus: After I Do (Taylor Jenkins Reid)",         myStatus: null },
  { id: 39, month: "April",     year: 2023, title: "The London Séance Society",                               author: "Sarah Penner",               genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★★",   notes: "Bonus: The Perfumist of Paris",                   myStatus: null },
  { id: 40, month: "March",     year: 2023, title: "Someone Else's Shoes",                                    author: "Jojo Moyes",                 genre: "Fiction",                         clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 41, month: "February",  year: 2023, title: "Spare",                                                   author: "Prince Harry",               genre: "Memoir",                          clubStatus: "Read",              rating: "★★★☆☆",   notes: null,                                              myStatus: null },
  { id: 42, month: "January",   year: 2023, title: "Wish You Were Here",                                      author: "Jodi Picoult",               genre: "Literary Fiction",                clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 43, month: "December",  year: 2022, title: "Last Christmas in Paris",                                 author: "Hazel Gaynor & Heather Webb",genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★☆",   notes: "Christmas Bonus book",                            myStatus: null },
  { id: 44, month: "November",  year: 2022, title: "Pretty Little Wife",                                      author: "Darby Kane",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 45, month: "October",   year: 2022, title: "The Henna Artist",                                        author: "Alka Joshi",                 genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 46, month: "September", year: 2022, title: "The Retreat",                                             author: "Sarah Pearse",               genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: "Bonus: Come Fly the World",                       myStatus: null },
  { id: 47, month: "August",    year: 2022, title: "The Good Lie",                                            author: "A.R. Torre",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★☆☆",   notes: "Bonus: Things We Never Got Over",                 myStatus: null },
  { id: 48, month: "July",      year: 2022, title: "Counterfeit",                                             author: "Kirstin Chen",               genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 49, month: "June",      year: 2022, title: "The Diamond Eye",                                         author: "Kate Quinn",                 genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★★",   notes: "Bonus: The Overnight Guest + A Flicker in the Dark", myStatus: null },
  { id: 50, month: "May",       year: 2022, title: "The Maidens",                                             author: "Alex Michaelides",           genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: "Bonus: Too Late (Colleen Hoover)",                myStatus: null },
  { id: 51, month: "April",     year: 2022, title: "The Things We Cannot Say",                                author: "Kelly Rimmer",               genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 52, month: "March",     year: 2022, title: "The Paris Apartment",                                     author: "Lucy Foley",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★☆",   notes: null,                                              myStatus: null },
  { id: 53, month: "February",  year: 2022, title: "Reminders of Him",                                        author: "Colleen Hoover",             genre: "Romance",                         clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 54, month: "January",   year: 2022, title: "The Last Thing He Told Me",                               author: "Laura Dave",                 genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 55, month: "December",  year: 2021, title: "Verity",                                                  author: "Colleen Hoover",             genre: "Thriller",                        clubStatus: "Read",              rating: "★★★★★",   notes: "Bonus book",                                      myStatus: null },
  { id: 56, month: "November",  year: 2021, title: "People We Meet on Vacation",                              author: "Emily Henry",                genre: "Romance",                         clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 57, month: "October",   year: 2021, title: "The Lost Apothecary",                                     author: "Sarah Penner",               genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★★",   notes: null,                                              myStatus: null },
  { id: 58, month: "September", year: 2021, title: "Aristotle and Dante Discover the Secrets of the Universe",author: "Benjamin Alire Sáenz",       genre: "YA / LGBTQ+ Fiction",            clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 59, month: "August",    year: 2021, title: "Educated",                                                author: "Tara Westover",              genre: "Memoir",                          clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 60, month: "July",      year: 2021, title: "Mujeres del alma mía",                                    author: "Isabel Allende",             genre: "Nonfiction / Feminist Memoir",    clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 61, month: "June",      year: 2021, title: "Mexican Gothic",                                          author: "Silvia Moreno-García",       genre: "Gothic Horror",                   clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 62, month: "May",       year: 2021, title: "The Midnight Library",                                    author: "Matt Haig",                  genre: "Contemporary Fiction / Fantasy",  clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 63, month: "April",     year: 2021, title: "Fifty Words for Rain",                                    author: "Asha Lemmie",                genre: "Historical Fiction",              clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 64, month: "March",     year: 2021, title: "The Sanatorium",                                          author: "Sarah Pearse",               genre: "Thriller / Mystery",              clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 65, month: "February",  year: 2021, title: "One of Us Is Lying",                                      author: "Karen M. McManus",           genre: "YA Mystery",                      clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 66, month: "January",   year: 2021, title: "With the Fire on High",                                   author: "Elizabeth Acevedo",          genre: "YA Contemporary",                 clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 67, month: "December",  year: 2020, title: "Exodus",                                                  author: "Kate Stewart",               genre: "Romance / Suspense",              clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 68, month: "November",  year: 2020, title: "Flock",                                                   author: "Kate Stewart",               genre: "Romance / Suspense",              clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 69, month: "October",   year: 2020, title: "Flirting with 40",                                        author: "K. Bromberg",                genre: "Romance",                         clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 70, month: "September", year: 2020, title: "In Five Years",                                           author: "Rebecca Serle",              genre: "Contemporary Fiction / Romance",  clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 71, month: "August",    year: 2020, title: "The Silent Patient",                                      author: "Alex Michaelides",           genre: "Psychological Thriller",          clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 72, month: "July",      year: 2020, title: "Then She Was Gone",                                       author: "Lisa Jewell",                genre: "Thriller / Mystery",              clubStatus: "Read",              rating: null,      notes: null,                                              myStatus: null },
  { id: 73, month: "June",      year: 2020, title: "The Giver of Stars",                                      author: "Jojo Moyes",                 genre: "Historical Fiction",              clubStatus: "Read",              rating: "★★★★★",   notes: "The very first pick!",                            myStatus: null },
];

const STORAGE_KEY = "btw_bookclub_v2";
function loadData() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
  return BOOKS_INITIAL;
}
function saveData(books) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(books)); } catch {}
}

export default function App() {
  const [books, setBooks] = useState(() => loadData());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [tab, setTab] = useState("list");
  const [addForm, setAddForm] = useState({ title: "", author: "", genre: "", month: "", year: new Date().getFullYear(), notes: "", myStatus: "To Be Read" });
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => { saveData(books); }, [books]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function updateMyStatus(id, status) {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, myStatus: status } : b));
    showToast(`Updated to "${status}"`);
  }

  function addBook() {
    if (!addForm.title.trim() || !addForm.author.trim()) { showToast("Title and author are required", "error"); return; }
    const newBook = {
      id: Date.now(), month: addForm.month || "—", year: parseInt(addForm.year) || new Date().getFullYear(),
      title: addForm.title.trim(), author: addForm.author.trim(),
      genre: addForm.genre.trim() || "Fiction", clubStatus: "—", rating: "—",
      notes: addForm.notes.trim() || null, myStatus: addForm.myStatus,
    };
    setBooks(prev => [newBook, ...prev]);
    setAddForm({ title: "", author: "", genre: "", month: "", year: new Date().getFullYear(), notes: "", myStatus: "To Be Read" });
    showToast(`"${newBook.title}" added!`);
    setTab("list");
  }

  const filtered = books.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.genre || "").toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || b.myStatus === filterStatus || (!b.myStatus && filterStatus === "No Status");
    return matchSearch && matchStatus;
  });

  const totalBooks = books.length;
  const readCount = books.filter(b => b.myStatus === "Read").length;
  const currentlyCount = books.filter(b => b.myStatus === "Currently Reading").length;
  const tbrCount = books.filter(b => b.myStatus === "To Be Read").length;
  const dnfCount = books.filter(b => b.myStatus === "Did Not Finish").length;
  const noStatusCount = books.filter(b => !b.myStatus).length;

  const genreCounts = {};
  books.forEach(b => { const g = b.genre || "Unknown"; genreCounts[g] = (genreCounts[g] || 0) + 1; });
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid #D4A8B8`, fontSize: 14, fontFamily: "Georgia, serif", outline: "none", background: "#fff", color: C.bodyText, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: C.warmCream, fontFamily: "Georgia, serif", maxWidth: 600, margin: "0 auto", paddingBottom: 80 }}>

      {/* ── HEADER ── */}
      <div style={{ background: C.deepBurgundy, color: "#fff", padding: "22px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 5, textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Between The Wines</div>
        <div style={{ fontSize: 26, fontWeight: "bold" }}>🍷 Book Club</div>
        <div style={{ fontSize: 11, opacity: 0.55, marginTop: 3, fontStyle: "italic" }}>We can read between the wines</div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 20 }}>
          {[["📚", totalBooks, "total"], ["✅", readCount, "read"], ["📖", currentlyCount, "reading"]].map(([icon, n, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: "bold" }}>{icon} {n}</div>
              <div style={{ fontSize: 9, opacity: 0.55, textTransform: "uppercase", letterSpacing: 1 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB BAR — wine red, matching spreadsheet header row ── */}
      <div style={{ display: "flex", background: C.wineRed, position: "sticky", top: 0, zIndex: 10 }}>
        {[["list", "📖 Books"], ["add", "➕ Add"], ["stats", "📊 Stats"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "12px 0", border: "none", background: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === key ? "bold" : "normal",
            color: tab === key ? "#fff" : "rgba(255,255,255,0.5)",
            borderBottom: tab === key ? "3px solid #fff" : "3px solid transparent",
            fontFamily: "Georgia, serif",
          }}>{label}</button>
        ))}
      </div>