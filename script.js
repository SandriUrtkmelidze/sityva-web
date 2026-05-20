// === SCREEN ELEMENTS ===
const homeScreen = document.getElementById("home");
const instructionsScreen = document.getElementById("instructions");
const gameScreen = document.getElementById("game");

const backHome2 = document.getElementById("back-home-2");
const startBtn = document.getElementById("start-btn");

const sentenceArea = document.getElementById("sentence-area");
const wordGrid = document.getElementById("word-grid");
const progressBar = document.getElementById("progress-bar");

const showInstructionsBtn = document.getElementById("show-instructions");
const modal = document.getElementById("modal-instructions");
const continueBtn = document.getElementById("continue-btn");

const popup = document.getElementById("open-popup");
const confirmOpen = document.getElementById("confirm-open");
const cancelOpen = document.getElementById("cancel-open");

const wordBank = document.getElementById("word-bank");
const toggleBankBtn = document.getElementById("toggle-bank");

// === SOUNDS ===
const correctSound =
  new Audio("./sounds/correct.wav");

// === STATE ===
let selectedStory = null;
let hiddenIndices = [];
let correctMap = {};
let placedWords = {};
let openedIndices = new Set();

let draggedSource = null;
let draggedIndex = null;
let draggedText = null;

let openTargetIndex = null;
let bankCollapsed = false;

let bankWordElsByText = {};

// ======================================================
// SAVE SYSTEM
// ======================================================

function saveNow() {

  if (!selectedStory) return;

  const saveData = {
    placedWords,
    openedIndices: [...openedIndices]
  };

  localStorage.setItem(
    `story-${selectedStory.title}`,
    JSON.stringify(saveData)
  );
}


// NEW FUNCTION BELOW
function loadSave() {

  if (!selectedStory) return;

  const raw = localStorage.getItem(
    `story-${selectedStory.title}`
  );

  if (!raw) return;

  const saveData = JSON.parse(raw);

  if (saveData.placedWords) {
    placedWords = saveData.placedWords;
  }

  if (saveData.openedIndices) {
    openedIndices = new Set(
      saveData.openedIndices
    );
  }
}

// ====================================================================
// === STORIES =========================================================
// ====================================================================

const stories = {

    1: {
    title: "ადამიანის სხეულის ნაწილების ჩხუბი",

sentence: [
  "ერთხელ","ადამიანის","სხეულის","ნაწილები","წაიჩხუბნენ:","ფეხებმა","თქვეს",", აღარ","გვინდა","თქვენი","ტარება",", თუ კარგია,","თავად","იარეთო.","ხელები",
"აბუზღუნდნენ",", გვეყო, რაც","ვიმუშავეთ",", ახლა","თვითონ","გაისარჯეთ",", თუ კარგიაო.","პირმა","ჩაიბურტყუნა",",","სულელი","ვარ",
  ", რომ","მუდამ","გასმევთ-გაჭმევთ",", აღარ","მინდა","თქვენთვის","საჭმლის","ღეჭვაო.","თვალებმა","თქვეს",",","მოგვბეზრდა","თქვენი",
  "დარაჯობა",", გვეყო,","ყველას","ნაცვლად",", ცქერაო.","გაიბუტნენ","და","ერთმანეთის","სამსახური","შეწყვიტეს",".","მაგრამ","რა","გამოვიდა",
  "აქედან","?","თავიანთი","ბუტიანობით","სხეული","ერთიანად","დაასუსტეს","!","მაშინ კი","მიხვდნენ","წაჩხუბებულები",
  ", რომ ეს","ჩხუბი","ყველას","ამარცხებდა",".","შერიგდნენ",", და ისევ","ერთმანეთზე","ზრუნვა","დაიწყეს",".","სხეული","კი","გაძლიერდა","."
],

revealed: [
  0,4,7,11,13,16,18,21,24,27,
  30,34,37,41,44,46,50,51,52,
  55,59,61,62,65,69,71,75,77,79
],

hidden: [
  1,2,3,5,6,8,9,10,12,14,15,
  17,19,20,22,23,25,26,28,29,
  31,32,33,35,36,38,39,40,42,
  43,45,47,48,49,53,54,56,57,
  58,60,63,64,66,67,68,70,72,
  73,74,76,78
],

words: [
  { text: "ადამიანის" },
  { text: "სხეულის" },
  { text: "ნაწილები" },

  { text: "ფეხებმა" },
  { text: "თქვეს" },

  { text: "გვინდა" },
  { text: "თქვენი" },
  { text: "ტარება" },

  { text: "თავად" },

  { text: "ხელები" },
  { text: "აბუზღუნდნენ" },

  { text: "ვიმუშავეთ" },

  { text: "თვითონ" },
  { text: "გაისარჯეთ" },

  { text: "პირმა" },
  { text: "ჩაიბურტყუნა" },

  { text: "სულელი" },
  { text: "ვარ" },

  { text: "მუდამ" },
  { text: "გასმევთ-გაჭმევთ" },

  { text: "მინდა" },
  { text: "თქვენთვის" },
  { text: "საჭმლის" },

  { text: "თვალებმა" },
  { text: "თქვეს" },

  { text: "მოგვბეზრდა" },
  { text: "თქვენი" },
  { text: "დარაჯობა" },

  { text: "ყველას" },
  { text: "ნაცვლად" },

  { text: "გაიბუტნენ" },

  { text: "ერთმანეთის" },
  { text: "სამსახური" },
  { text: "შეწყვიტეს" },

  { text: "გამოვიდა" },
  { text: "აქედან" },

  { text: "თავიანთი" },
  { text: "ბუტიანობით" },
  { text: "სხეული" },

  { text: "დაასუსტეს" },

  { text: "მიხვდნენ" },
  { text: "წაჩხუბებულები" },

  { text: "ჩხუბი" },
  { text: "ყველას" },
  { text: "ამარცხებდა" },

  { text: "შერიგდნენ" },

  { text: "ერთმანეთზე" },
  { text: "ზრუნვა" },
  { text: "დაიწყეს" },

  { text: "სხეული" },

  { text: "გაძლიერდა" }
]
    
  },

  2: {
  title: "ირემი",

  sentence: [
    "ირემმა","ჩაიხედა","წყალში","და","თავისი","ანარეკლი","დაინახა",".","მოიხიბლა","თავისი","გრძელი",
    "დატოტვილი","რქებით",", მერე კი","ფეხებზე","დაიხედა","და","თქვა:","- რა","ლამაზი",
    "ვიქნებოდი",", ეს","წვრილი","და","თხელი","ფეხები","რომ არ","მაუშნოებდესო",".",
    "უცებ,","საიდანღაც,","გამოხტა","ლომი","და","ირმისკენ","ისკუპა",".","ირემი","ისარივით",
    "გავარდა","ტრიალ","მინდორზე",", მაგრამ",", როგორც კი","ტყეში","შევარდა",",","რქებით",
    "გაიხლართა","ხის","ტოტებში","და","ლომმა","დაიჭირა",".","იღუპებოდა","და",
    "ამბობდა:","- აი,","სულელო","ჩემო","თავო!","რასაც","იწუნებდი",", იმათ",
    "ხიფათს","გადაგარჩინეს","და","რაც","მოგწონდა",", იმან","დაგღუპაო","."
  ],

  revealed: [
    3,5,7,9,13,16,17,18,21,23,
    26,28,29,30,33,36,38,42,
    43,46,49,51,54,56,57,58,
    61,62,64,67,70,72
  ],

  hidden: [
    0,1,2,4,6,8,10,11,12,14,
    15,19,20,22,24,25,27,31,
    32,34,35,37,39,40,41,44,
    45,47,48,50,52,53,55,59,
    60,63,65,66,68,69,71
  ],

  words: [
    { text: "ირემმა" },
    { text: "ჩაიხედა" },
    { text: "წყალში" },

    { text: "თავისი" },

    { text: "დაინახა" },

    { text: "მოიხიბლა" },

    { text: "გრძელი" },
    { text: "დატოტვილი" },
    { text: "რქებით" },

    { text: "ფეხებზე" },
    { text: "დაიხედა" },

    { text: "ლამაზი" },
    { text: "ვიქნებოდი" },

    { text: "წვრილი" },

    { text: "თხელი" },
    { text: "ფეხები" },

    { text: "მაუშნოებდესო" },

    { text: "გამოხტა" },
    { text: "ლომი" },

    { text: "ირმისკენ" },
    { text: "ისკუპა" },

    { text: "ირემი" },

    { text: "გავარდა" },
    { text: "ტრიალ" },
    { text: "მინდორზე" },

    { text: "ტყეში" },
    { text: "შევარდა" },

    { text: "რქებით" },
    { text: "გაიხლართა" },

    { text: "ტოტებში" },

    { text: "ლომმა" },
    { text: "დაიჭირა" },

    { text: "იღუპებოდა" },

    { text: "სულელო" },
    { text: "ჩემო" },

    { text: "იწუნებდი" },

    { text: "ხიფათს" },
    { text: "გადაგარჩინეს" },

    { text: "რაც" },
    { text: "მოგწონდა" },

    { text: "დაგღუპაო" }
  ]
},

  3: {
  title: "ლომი, ვირი და მელია",

  sentence: [
    "ლომი",",","ვირი","და","მელა","სანადიროდ","წავიდნენ",".","უამრავი","რამ","მოინადირეს",",","ნანადირევის","გაყოფა","კი",
    "ლომმა","ვირს","მიანდო",".","ვირმა","სამ","თანაბარ","ნაწილად","გაჰყო","საერთო","ნადავლი","და","თქვა",":",
    "-","ყველამ","თავისი","აიღოსო",".","ლომი","გაბრაზდა",",","ვირი","შეჭამა","და","ახლა","მელიას","უბრძანა",
    ", რომ","ნანადირევი","ხელახლა","გაეყო",".","მელიამ","მთელი","ნანადირევი","ლომს","დაუხვავა","წინ",",",
    "თავისთვის","კი","სულ","პაწია","წილი","დაიტოვა",".","ლომი","კმაყოფილი","დარჩა",", მოუწონა:",
    "- რა","ჭკვიანი","ყოფილხარ","!","ვინ","გასწავლა","გაყოფა","ასე","კარგადო","?","-","შენმა",
    "შეჭმულმა","ვირმაო",", - არ","დაიბნა","მელია","."
  ],

  revealed: [
    1,3,7,9,11,14,18,21,24,26,
    28,29,33,36,39,40,43,45,
    47,52,54,56,57,61,65,66,
    69,70,73,75,76,77,80,83
  ],

  hidden: [
    0,2,4,5,6,8,10,12,13,15,
    16,17,19,20,22,23,25,27,
    30,31,32,34,35,37,38,41,
    42,44,46,48,49,50,51,53,
    55,58,59,60,62,63,64,67,
    68,71,72,74,78,79,81,82
  ],

  words: [
    { text: "ლომი" },

    { text: "ვირი" },

    { text: "მელა" },
    { text: "სანადიროდ" },
    { text: "წავიდნენ" },

    { text: "უამრავი" },

    { text: "მოინადირეს" },

    { text: "ნანადირევის" },
    { text: "გაყოფა" },

    { text: "ლომმა" },
    { text: "ვირს" },
    { text: "მიანდო" },

    { text: "ვირმა" },
    { text: "სამ" },

    { text: "ნაწილად" },
    { text: "გაჰყო" },

    { text: "ნადავლი" },

    { text: "თქვა" },

    { text: "ყველამ" },
    { text: "თავისი" },
    { text: "აიღოსო" },

    { text: "ლომი" },
    { text: "გაბრაზდა" },

    { text: "ვირი" },
    { text: "შეჭამა" },

    { text: "მელიას" },
    { text: "უბრძანა" },

    { text: "ნანადირევი" },

    { text: "გაეყო" },

    { text: "მელიამ" },
    { text: "მთელი" },
    { text: "ნანადირევი" },
    { text: "ლომს" },

    { text: "წინ" },

    { text: "თავისთვის" },

    { text: "პაწია" },
    { text: "წილი" },
    { text: "დაიტოვა" },

    { text: "ლომი" },
    { text: "კმაყოფილი" },
    { text: "დარჩა" },

    { text: "ჭკვიანი" },
    { text: "ყოფილხარ" },

    { text: "გასწავლა" },
    { text: "გაყოფა" },

    { text: "კარგადო" },

    { text: "შეჭმულმა" },
    { text: "ვირმაო" },

    { text: "დაიბნა" },
    { text: "მელია" }
  ]
},

  4: {
  title: "მონადირე კურდღელი",

  sentence: [
    "დიდი","მხეცები","შეიკრიბნენ","და","სანადიროდ","წავიდნენ",".","დაიჭირეს","მოზრდილი","ირემი",",",
    "წამოაქციეს","და","დაუწყეს","გაყოფა",".","ამ დროს","საიდანღაც","გამოძვრა","კურდღელი",",",
    "ყურში","პირი","ჩაავლო","ირემს","და","ცდილობდა",", თავისკენ","გაეწია",".","- შე","ბრუტიანო",
    ", შენა,","ნადირობაზე","არც","გამოჩენილხარ","და ახლა","დააჭყიტე","თვალებიო ?","-","შეუძახეს","აქეთ-იქიდან.",
    "- დახე","ამ","უმადურებს","!","მაშ","ტყიდან","ნადირი","ვინ","დააფრთხო","და","თქვენკენ",
    "ვინ","გამოაგდოო?","- დაიკვეხა","ენამოსწრებულმა","კურდღელმა",".","ისე","გულიანად","აცინა",
    "მხეცები",", რომ","ხორცის","ერთი ნაჭერი","მასაც","არგუნეს","."
  ],

  revealed: [
    3,6,10,12,15,16,20,25,27,29,
    30,32,34,36,38,39,41,42,
    45,46,49,51,53,54,55,58,
    63,66,68
  ],

  hidden: [
    0,1,2,4,5,7,8,9,11,13,
    14,17,18,19,21,22,23,24,
    26,28,31,33,35,37,40,43,
    44,47,48,50,52,56,57,59,
    60,61,62,64,65,67
  ],

  words: [
    { text: "დიდი" },
    { text: "მხეცები" },
    { text: "შეიკრიბნენ" },

    { text: "სანადიროდ" },
    { text: "წავიდნენ" },

    { text: "დაიჭირეს" },
    { text: "მოზრდილი" },
    { text: "ირემი" },

    { text: "წამოაქციეს" },

    { text: "დაუწყეს" },
    { text: "გაყოფა" },

    { text: "საიდანღაც" },
    { text: "გამოძვრა" },
    { text: "კურდღელი" },

    { text: "ყურში" },
    { text: "პირი" },
    { text: "ჩაავლო" },
    { text: "ირემს" },

    { text: "ცდილობდა" },

    { text: "გაეწია" },

    { text: "ბრუტიანო" },

    { text: "ნადირობაზე" },

    { text: "გამოჩენილხარ" },

    { text: "დააჭყიტე" },

    { text: "შეუძახეს" },

    { text: "ამ" },
    { text: "უმადურებს" },

    { text: "ტყიდან" },
    { text: "ნადირი" },

    { text: "დააფრთხო" },

    { text: "თქვენკენ" },

    { text: "ენამოსწრებულმა" },
    { text: "კურდღელმა" },

    { text: "ისე" },
    { text: "გულიანად" },
    { text: "აცინა" },

    { text: "მხეცები" },

    { text: "ხორცის" },
    { text: "ერთი ნაჭერი" },

    { text: "არგუნეს" }
  ]
},
  
  5: {
    title: "ორი მეგობარი და დათვი",

    sentence: [
      "ორი","მეგობარი","გზაზე","მიდიოდა",".",
      "შემოხვდათ","დათვი",".",
      "ერთი","მაშინვე","ხეს","ეცა",",",
      "ავარდა","ზედ","და","ფოთლებში","დაიმალა",".",
      "მეორემ","კი,","მარტოდ","დარჩენილმა",", სხვა რომ",
      "ვეღარაფერი","მოიფიქრა",",",
      "წაიქცა","მიწაზე","და","თავი","მოიმკვდარუნა",".",
      "მოვიდა","დათვი","და","გულზე","ყური","დაადო",
      "მწოლიარეს.","კაცმა","სული","შეიგუბა",", იცოდა, რომ",
      "დათვი","მკვდარს","არ","ერჩოდა",".",
      "მართლაც,","დათვს","არაფერი","დაუშავებია",", ისე",
      "წავიდა",".","როგორც კი","ის","მიეფარა","თვალს",",",
      "ჩამოვიდა","ხეზე","ასული","და","კაცს","ჰკითხა",":",
      "- რა იყო,","დათვი","ყურში","რას","გეჩურჩულებოდაო","?",
      "- მირჩია,","არასდროს","დაუმეგობრდე","მას",", ვინც",
      "გაჭირვებისას","ღალატი","იცისო,","- უპასუხა",
      "გადარჩენილმა","."
    ],

    revealed: [
      4,7,9,12,14,15,18,20,23,26,29,32,35,39,
      42,43,46,48,49,53,55,56,58,60,64,67,
      68,71,73,74,81,84
    ],

    hidden: [
      0,1,2,3,5,6,8,10,11,13,16,17,19,21,22,
      24,25,27,28,30,31,33,34,36,37,38,40,41,
      44,45,47,50,51,52,54,57,59,61,62,63,65,
      66,69,70,72,75,76,77,78,79,80,82,83
    ],

    // ONLY HIDDEN WORDS
    words: [
      { text: "ორი" },
      { text: "მეგობარი" },
      { text: "გზაზე" },
      { text: "მიდიოდა" },

      { text: "შემოხვდათ" },
      { text: "დათვი" },

      { text: "ერთი" },

      { text: "ხეს" },
      { text: "ეცა" },

      { text: "ავარდა" },

      { text: "ფოთლებში" },
      { text: "დაიმალა" },

      { text: "მეორემ" },

      { text: "მარტოდ" },
      { text: "დარჩენილმა" },

      { text: "ვეღარაფერი" },
      { text: "მოიფიქრა" },

      { text: "წაიქცა" },
      { text: "მიწაზე" },

      { text: "თავი" },
      { text: "მოიმკვდარუნა" },

      { text: "მოვიდა" },
      { text: "დათვი" },

      { text: "გულზე" },
      { text: "ყური" },
      { text: "დაადო" },

      { text: "კაცმა" },
      { text: "სული" },

      { text: "დათვი" },

      { text: "მკვდარს" },
      { text: "ერჩოდა" },

      { text: "დათვს" },
      { text: "არაფერი" },
      { text: "დაუშავებია" },

      { text: "წავიდა" },

      { text: "ის" },

      { text: "თვალს" },

      { text: "ჩამოვიდა" },
      { text: "ხეზე" },
      { text: "ასული" },

      { text: "კაცს" },
      { text: "ჰკითხა" },

      { text: "დათვი" },
      { text: "ყურში" },

      { text: "გეჩურჩულებოდაო" },

      { text: "არასდროს" },
      { text: "დაუმეგობრდე" },

      { text: "მას" },
      { text: ", ვინც" },

      { text: "გაჭირვებისას" },
      { text: "ღალატი" },

      { text: "- უპასუხა" },

      { text: "გადარჩენილმა" }
    ]
  }
};


// ====================================================================
// === GENERATE STORY BUTTONS =========================================
// ====================================================================

function generateStoryButtons() {
  const storyList = document.getElementById("story-list");

  storyList.innerHTML = "";

  Object.keys(stories).forEach(id => {
    const btn = document.createElement("button");

    btn.classList.add("story-btn");

    btn.dataset.story = id;

    btn.textContent = stories[id].title;

    btn.addEventListener("click", () => {
      selectedStory = id;
      showScreen(instructionsScreen);
    });

    storyList.appendChild(btn);
  });
}


// ====================================================================
// === SHUFFLE =========================================================
// ====================================================================

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}


// ====================================================================
// === SAVE / LOAD =====================================================
// ====================================================================

function saveProgressForStory(id, data) {
  localStorage.setItem(
    "progress-story-" + id,
    JSON.stringify(data)
  );
}

function loadProgressForStory(id) {
  const raw = localStorage.getItem(
    "progress-story-" + id
  );

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveNow() {
  if (!selectedStory) return;

  saveProgressForStory(selectedStory, {
    placedWords,
    openedIndices: Array.from(openedIndices),
    bankCollapsed
  });
}


// ====================================================================
// === SCREEN NAVIGATION ===============================================
// ====================================================================

function showScreen(target) {
  [homeScreen, instructionsScreen, gameScreen]
    .forEach(s => s.classList.remove("active"));

  target.classList.add("active");
}


backHome2.addEventListener("click", () => {
  showScreen(homeScreen);
});

startBtn.addEventListener("click", () => {
  if (!selectedStory) return;

  showScreen(gameScreen);

  loadStory(selectedStory);
});


// ====================================================================
// === MODAL ===========================================================
// ====================================================================

showInstructionsBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

continueBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});


// ====================================================================
// === OPEN WORD POPUP =================================================
// ====================================================================

cancelOpen.addEventListener("click", () => {
  popup.classList.add("hidden");

  openTargetIndex = null;
});

confirmOpen.addEventListener("click", () => {
  if (openTargetIndex == null) return;

  const correctWord = correctMap[openTargetIndex];

  const cell = sentenceArea.querySelector(
    `.sentence-cell[data-index="${openTargetIndex}"]`
  );

  if (!cell || !correctWord) return;

  cell.textContent = correctWord;

  cell.dataset.empty = "false";

  cell.classList.add("revealed");

  cell.draggable = true;

  cell.addEventListener("dragstart", onSlotDragStart);

  placedWords[openTargetIndex] = correctWord;

  openedIndices.add(openTargetIndex);

  refreshBankVisuals();

  updateProgress();

  saveNow();

  popup.classList.add("hidden");

  openTargetIndex = null;
});


// ====================================================================
// === WORD BANK COLLAPSE ==============================================
// ====================================================================

toggleBankBtn.addEventListener("click", () => {
  bankCollapsed = !bankCollapsed;

  wordBank.classList.toggle(
    "collapsed",
    bankCollapsed
  );

  wordBank.classList.toggle(
    "expanded",
    !bankCollapsed
  );

  saveNow();
});


// ====================================================================
// === LOAD STORY ======================================================
// ====================================================================

function loadStory(id) {
  const story = stories[id];
  selectedStory = id;

  if (!story) return;

  sentenceArea.innerHTML = "";
  wordGrid.innerHTML = "";

  hiddenIndices = [...story.hidden];

  correctMap = {};
  placedWords = {};

  openedIndices = new Set();

  loadSave();

  draggedSource = null;
  draggedIndex = null;
  draggedText = null;

  bankWordElsByText = {};

  bankCollapsed = false;

  // BUILD CORRECT MAP FROM SENTENCE
  story.hidden.forEach(slotIndex => {
    correctMap[slotIndex] =
      story.sentence[slotIndex];
  });

  // BUILD SENTENCE GRID
  story.sentence.forEach((word, index) => {
    const cell = document.createElement("div");

    cell.classList.add("sentence-cell");

    cell.dataset.index = index;

    if (hiddenIndices.includes(index)) {

      cell.dataset.empty = "true";

      cell.textContent = "";

      if (placedWords[index]) {

  cell.textContent = placedWords[index];

  cell.dataset.empty = "false";

  cell.draggable = true;

  if (correctMap[index] === placedWords[index]) {
    cell.classList.add("correct");
  }

  cell.addEventListener(
    "dragstart",
    onSlotDragStart
  );
}

      cell.addEventListener("click", () => {
        if (cell.dataset.empty === "true") {
          openTargetIndex = index;
          popup.classList.remove("hidden");
        }
      });

      cell.addEventListener("dragover", e =>
        e.preventDefault()
      );

      cell.addEventListener("drop", e => {
        e.preventDefault();

        onDropToSlot(index);
      });

    } else {

      cell.dataset.empty = "false";

      cell.textContent = word;

      cell.classList.add("revealed");
    }

    sentenceArea.appendChild(cell);
  });

  // BUILD WORD BANK
  let shuffled = shuffleArray([...story.words]);

  shuffled.forEach(w => {
    const el = document.createElement("div");

    const uid =
  (window.crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : "id-" + Math.random().toString(36).slice(2);

    el.dataset.uid = uid;

    const text = w.text;

    el.dataset.text = text;

    el.classList.add("word");

    el.textContent = text;

    el.draggable = true;

    el.addEventListener("dragstart", onBankDragStart);

    if (!bankWordElsByText[text]) {
      bankWordElsByText[text] = [];
    }

    bankWordElsByText[text].push(el);

    wordGrid.appendChild(el);
  });

  // ALLOW RETURNING WORDS
  wordGrid.addEventListener("dragover", e =>
    e.preventDefault()
  );

  wordGrid.addEventListener("drop", e => {
    e.preventDefault();

    onDropToBank();
  });

  refreshBankVisuals();

  updateProgress();
}


// ====================================================================
// === DRAG & DROP =====================================================
// ====================================================================

function onBankDragStart(e) {
  if (e.target.classList.contains("faded")) {
    return e.preventDefault();
  }

  draggedSource = "bank";

  draggedIndex = null;

  draggedText = e.target.dataset.text;
}

function onSlotDragStart(e) {
  const cell = e.target;

  if (cell.dataset.empty === "true") {
    return e.preventDefault();
  }

  draggedSource = "slot";

  draggedIndex = parseInt(cell.dataset.index);

  draggedText = cell.textContent;
}

function onDropToSlot(targetIndex) {
  if (!draggedText) return;

  const targetCell = sentenceArea.querySelector(
    `.sentence-cell[data-index="${targetIndex}"]`
  );

  if (!targetCell ||
      !hiddenIndices.includes(targetIndex)) {
    resetDragState();
    return;
  }

  if (draggedSource === "slot" &&
      draggedIndex === targetIndex) {
    resetDragState();
    return;
  }

  if (targetCell.dataset.empty === "false") {
    placedWords[targetIndex] = null;
  }

  if (draggedSource === "slot" &&
      draggedIndex !== null) {

    const fromCell = sentenceArea.querySelector(
      `.sentence-cell[data-index="${draggedIndex}"]`
    );

    if (fromCell) {
      fromCell.textContent = "";

      fromCell.dataset.empty = "true";

      fromCell.draggable = false;

      fromCell.classList.remove("revealed");

      fromCell.classList.remove("correct");
    }

    placedWords[draggedIndex] = null;

    openedIndices.delete(draggedIndex);
  }

if (correctMap[targetIndex] === draggedText) {
  correctSound.currentTime = 0;
  correctSound.play();

  targetCell.classList.add("correct");
}

  targetCell.textContent = draggedText;

  targetCell.dataset.empty = "false";

  targetCell.draggable = true;

  targetCell.addEventListener(
    "dragstart",
    onSlotDragStart
  );

  placedWords[targetIndex] = draggedText;

  refreshBankVisuals();

  updateProgress();

  saveNow();

  resetDragState();
}

function onDropToBank() {
  if (draggedSource !== "slot") {
    return resetDragState();
  }

  const fromCell = sentenceArea.querySelector(
    `.sentence-cell[data-index="${draggedIndex}"]`
  );

  if (fromCell) {
    fromCell.textContent = "";

    fromCell.dataset.empty = "true";

    fromCell.draggable = false;

    fromCell.classList.remove("revealed");
  }

  placedWords[draggedIndex] = null;

  openedIndices.delete(draggedIndex);

  refreshBankVisuals();

  updateProgress();

  saveNow();

  resetDragState();
}

function resetDragState() {
  draggedSource = null;

  draggedIndex = null;

  draggedText = null;
}


// ====================================================================
// === DUPLICATE WORD FIX ==============================================
// ====================================================================

function refreshBankVisuals() {
  const usedCounts = {};

  Object.values(placedWords).forEach(word => {
    if (!word) return;

    usedCounts[word] =
      (usedCounts[word] || 0) + 1;
  });

  Object.keys(bankWordElsByText).forEach(text => {
    const elements = bankWordElsByText[text];

    const fadeCount = usedCounts[text] || 0;

    elements.forEach((el, index) => {

      if (index < fadeCount) {

        el.classList.add("faded");

        el.draggable = false;

      } else {

        el.classList.remove("faded");

        el.draggable = true;
      }
    });
  });
}


// ====================================================================
// === PROGRESS BAR ====================================================
// ====================================================================

function updateProgress() {
  let correctCount = 0;

  hiddenIndices.forEach(idx => {
    if (placedWords[idx] === correctMap[idx]) {
      correctCount++;
    }
  });

  const total = hiddenIndices.length;

  const pct = Math.round(
    (correctCount / total) * 100
  );

  progressBar.style.width = pct + "%";

  if (correctCount === total && total > 0) {
    setTimeout(() => {
      alert("გილოცავ! მოთხრობა სწორად ააწყე.");
    }, 120);
  }
}


// ====================================================================
// === INIT ============================================================
// ====================================================================

generateStoryButtons();