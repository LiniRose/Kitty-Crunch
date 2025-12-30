const modalHTML = `
<div id="howto-popup" class="popup-overlay">
    <div class="popup-box">
        <button id="close-howto" class="close-btn">✕</button>
        <h1>How to Crunch?</h1>
        <ol>
            <li>Use the arrow keys to move the kitty left and right.</li>
            <li>Your goal is to catch ALL falling tacos.</li>
            <li>Avoid catching bombs.</li>
            <li>Each taco gives you points!</li>
            <li>Have fun and happy crunching!</li>
        </ol>
    </div>
</div>
`;


document.body.insertAdjacentHTML("afterbegin", modalHTML);


const popup = document.getElementById("howto-popup");
const openBtn = document.getElementById("open-howto");
const closeBtn = document.getElementById("close-howto");


openBtn.addEventListener("click", () => {
  popup.style.display = "flex";
  openBtn.style.display = "none";
});


closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  openBtn.style.display = "block";
});
