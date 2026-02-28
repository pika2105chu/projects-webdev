const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "YOUR_API_KEY_HERE";  // ⚠️ Never expose real key in production

let isImageGenerating = false;

// Update image cards after generation
const updateImageCards = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {

        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneratedImg = imgObject.url;

        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${Date.now()}.jpg`);
        };

    });
};

// Generate images from OpenAI
const generateAiImages = async (userPrompt, userImgQuantity) => {

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
            model: "gpt-image-1",
            prompt: userPrompt,
            size: "512x512"
})
        });

        if (!response.ok) {
            throw new Error("Failed to generate images. Check API key or request format.");
        }

        const result = await response.json();
        updateImageCards(result.data);

    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
};

// Form submit handler
const handleFormSubmission = (e) => {
    e.preventDefault();

    if (isImageGenerating) return;
    isImageGenerating = true;

    const userPrompt = generateForm.querySelector(".prompt-input").value;
    const userImgQuantity = generateForm.querySelector(".img-quantity").value;

    // Create loading cards
    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
            <img src="images/loader.svg" alt="loading">
            <a href="#" class="download-btn">
                <img src="images/download.png" alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;

    generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);