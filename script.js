// COSMOS interactions: mobile menu, gallery modal, planet explorer, NASA APOD and quiz.
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle?.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => mainNav.classList.remove("open")));

  // Highlight the current navigation section.
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));

  // Gallery filtering.
  const filterButtons = document.querySelectorAll(".filter-button");
  const galleryItems = document.querySelectorAll(".gallery-item");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    galleryItems.forEach(item => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
  }));

  // Gallery image modal.
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
  galleryItems.forEach(item => item.addEventListener("click", () => {
    modalImage.src = item.querySelector("img").src;
    modalImage.alt = item.querySelector("img").alt;
    document.getElementById("modalTitle").textContent = item.dataset.title;
    document.getElementById("modalDescription").textContent = item.dataset.description;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  }));
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

  // Planet explorer.
  const planets = {
    earth: {name:"Earth",type:"TERRESTRIAL PLANET",description:"Our pale blue dot is the only world known to support life. Its oceans, atmosphere and magnetic field make it a remarkable home.",distance:"149.6 million km",day:"24 hours",moons:"1",caption:"THE BLUE PLANET",className:""},
    mars: {name:"Mars",type:"TERRESTRIAL PLANET",description:"A cold desert world with giant volcanoes, ancient river valleys and a thin atmosphere. Scientists are exploring whether it once had conditions suitable for life.",distance:"227.9 million km",day:"24.6 hours",moons:"2",caption:"THE RED PLANET",className:"mars"},
    jupiter: {name:"Jupiter",type:"GAS GIANT",description:"The largest planet in our solar system. Its swirling cloud bands and enormous Great Red Spot make it one of the most recognizable worlds.",distance:"778.6 million km",day:"9.9 hours",moons:"95 confirmed",caption:"THE GIANT",className:"jupiter"},
    saturn: {name:"Saturn",type:"GAS GIANT",description:"Famous for its spectacular rings, Saturn is a giant world made mostly of hydrogen and helium. Its moon Titan has lakes of liquid hydrocarbons.",distance:"1.43 billion km",day:"10.7 hours",moons:"146 confirmed",caption:"THE RINGED WORLD",className:"saturn"},
    neptune: {name:"Neptune",type:"ICE GIANT",description:"A deep-blue, distant world with supersonic winds. Neptune takes about 165 Earth years to complete one orbit around the Sun.",distance:"4.5 billion km",day:"16.1 hours",moons:"16 known",caption:"THE BLUE GIANT",className:"neptune"}
  };
  document.querySelectorAll(".planet-tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".planet-tab").forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    const planet = planets[tab.dataset.planet];
    document.getElementById("planetName").textContent = planet.name;
    document.getElementById("planetType").textContent = planet.type;
    document.getElementById("planetDescription").textContent = planet.description;
    document.getElementById("planetDistance").textContent = planet.distance;
    document.getElementById("planetDay").textContent = planet.day;
    document.getElementById("planetMoons").textContent = planet.moons;
    document.getElementById("planetVisualCaption").textContent = planet.caption;
    document.getElementById("planetObject").className = `planet-object ${planet.className}`;
  }));

  // NASA Astronomy Picture of the Day. DEMO_KEY is for experimentation; use your own key for regular use.
  async function loadAPOD() {
    const title = document.getElementById("apodTitle");
    const explanation = document.getElementById("apodExplanation");
    const image = document.getElementById("apodImage");
    const date = document.getElementById("apodDate");
    const credit = document.getElementById("apodCredit");
    try {
      const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
      if (!response.ok) throw new Error("NASA API request failed");
      const data = await response.json();
      title.textContent = data.title || "Astronomy Picture of the Day";
      explanation.textContent = data.explanation || "Discover today's astronomy feature from NASA.";
      date.textContent = data.date || "NASA APOD";
      credit.textContent = data.copyright ? `IMAGE CREDIT: ${data.copyright}` : "IMAGE CREDIT: NASA / APOD";
      if (data.media_type === "image" && data.url) { image.src = data.url; image.alt = data.title || "NASA astronomy image"; }
      else { credit.textContent += " · Today's feature is a video. Visit NASA APOD to view it."; }
    } catch (error) {
      title.textContent = "A universe of possibilities";
      explanation.textContent = "NASA's live picture could not load right now. You can still explore the official Astronomy Picture of the Day on NASA's website.";
      credit.textContent = "NASA APOD · Live connection unavailable";
    }
  }
  loadAPOD();

  // Five-question quiz.
  const questions = [
    {q:"Which planet is known as the Red Planet?",a:["Venus","Mars","Mercury","Neptune"],correct:1,why:"Mars looks reddish because iron minerals in its soil have oxidized, or rusted."},
    {q:"What is the name of the galaxy we live in?",a:["Andromeda","Whirlpool","Milky Way","Sombrero"],correct:2,why:"Our Solar System is located in the Milky Way galaxy."},
    {q:"Which star is closest to Earth?",a:["Sirius","Polaris","The Sun","Proxima Centauri"],correct:2,why:"The Sun is our nearest star, about 150 million kilometres away."},
    {q:"Which planet has the most prominent ring system?",a:["Saturn","Earth","Mars","Venus"],correct:0,why:"All four giant planets have rings, but Saturn's are by far the most spectacular."},
    {q:"What does a light-year measure?",a:["Time","Brightness","Distance","Temperature"],correct:2,why:"A light-year is the distance light travels in one year — about 9.46 trillion kilometres."}
  ];
  let current = 0, score = 0, answered = false;
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const nextBtn = document.getElementById("quizNext");
  function renderQuestion() {
    answered = false;
    const q = questions[current];
    document.getElementById("quizProgress").textContent = `QUESTION ${String(current+1).padStart(2,"0")} / 05`;
    document.getElementById("quizScore").textContent = `SCORE: ${score}`;
    document.getElementById("progressFill").style.width = `${(current+1)/questions.length*100}%`;
    questionEl.textContent = q.q;
    document.getElementById("quizFeedback").textContent = "";
    optionsEl.innerHTML = "";
    q.a.forEach((answer,index) => {
      const button = document.createElement("button");
      button.className = "quiz-option"; button.textContent = answer;
      button.addEventListener("click", () => chooseAnswer(index));
      optionsEl.appendChild(button);
    });
    nextBtn.disabled = true;
    nextBtn.innerHTML = current === questions.length-1 ? 'See results <i data-lucide="arrow-right"></i>' : 'Next question <i data-lucide="arrow-right"></i>';
    if (window.lucide) lucide.createIcons();
  }
  function chooseAnswer(index) {
    if (answered) return;
    answered = true;
    const q = questions[current], buttons = [...optionsEl.children];
    buttons.forEach((button,i) => { button.disabled = true; if (i === q.correct) button.classList.add("correct"); });
    if (index === q.correct) { score++; document.getElementById("quizFeedback").textContent = `Correct! ${q.why}`; }
    else { buttons[index].classList.add("wrong"); document.getElementById("quizFeedback").textContent = `Not quite. ${q.why}`; }
    document.getElementById("quizScore").textContent = `SCORE: ${score}`;
    nextBtn.disabled = false;
  }
  nextBtn.addEventListener("click", () => {
    if (!answered) return;
    if (current < questions.length-1) { current++; renderQuestion(); }
    else {
      questionEl.textContent = `You scored ${score} out of ${questions.length}!`;
      optionsEl.innerHTML = "";
      document.getElementById("quizFeedback").textContent = score === 5 ? "Outstanding! You're a true cosmic explorer." : "Keep exploring — the universe has plenty more to teach you.";
      nextBtn.disabled = false; nextBtn.textContent = "Play again";
      nextBtn.onclick = () => { current = 0; score = 0; nextBtn.onclick = null; renderQuestion(); };
    }
  });
  renderQuestion();
});
