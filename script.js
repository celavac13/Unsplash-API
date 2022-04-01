"use strict"
const PUBLIC_KEY = "34L37bpndqC4DMR9vq_cJIZDGX6lipWNAZbYx3j5pT8";
const PRIVATE_KEY = `AW6Avq7OQF5sgOdsBtO3aOU9HjWHGn6MOCr9Py0nbGk`;
const holderImages = document.querySelector(".holderImages");
const loader = document.querySelector("#loader");
const columnView = document.querySelector(".column");
const gridView = document.querySelector(".grid");

// elements for modal
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modalClose");
const modalImg = document.querySelector(".modal-img");
const imgLink = document.querySelector(".modal-info");
const likes = document.querySelector(".like-count");
const portrait = document.querySelector(".modal-portrait");
const userName = document.querySelector(".modal-username");
const portfolio = document.querySelector("#portfolio");
const socails = document.querySelector(".modal-links");

// counter for pages;
let pages = 1;

// closing modal
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
    modal.style.opacity = "0";
});
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
        modal.style.opacity = "0";
    }
});

// function for filling modal
const renderingModal = function (data) {
    modal.style.display = "block";
    modal.style.opacity = "1";

    modalImg.src = data.urls.regular;
    modalImg.alt = data.alt_description ? data.alt_description : "Unsplash photo";

    imgLink.href = imgLink.textContent = data.links.html;
    likes.textContent = data.likes;
    portrait.src = data.user.profile_image.medium;
    userName.textContent = data.user.username;
    portfolio.href = portfolio.textContent = data.user.portfolio_url;

    // checking for social and rendering
    socails.innerHTML = "";
    if (data.user.instagram_username) {
        const linkSocial = document.createElement("a");
        linkSocial.href = `https://www.instagram.com/${data.user.instagram_username}`;
        linkSocial.target = "_blank";
        linkSocial.textContent = `Instagram`;
        linkSocial.classList.add("modal-link");
        socails.appendChild(linkSocial);
    }
    if (data.user.paypal_email) {
        const linkSocial = document.createElement("a");
        linkSocial.href = data.user.paypal_email;
        linkSocial.target = "_blank";
        linkSocial.textContent = `PayPal`;
        linkSocial.classList.add("modal-link");
        socails.appendChild(linkSocial);
    }
    if (data.user.twitter_username) {
        const linkSocial = document.createElement("a");
        linkSocial.href = `https://www.twitter.com/${data.user.twitter_username}`;
        linkSocial.target = "_blank";
        linkSocial.textContent = `Twitter`;
        linkSocial.classList.add("modal-link");
        socails.appendChild(linkSocial);
    }
}

// function for geting photos from site and rendering them
const getPhotos = function (page) {
    const request = new XMLHttpRequest;
    loader.style.display = "block"
    request.open("GET", `https://api.unsplash.com/photos?page=${page}&per_page=15&client_id=${PUBLIC_KEY}`);
    request.send();

    request.addEventListener("load", function () {
        const data = JSON.parse(this.responseText);
        loader.style.display = "none"

        // rendering images on page
        data.forEach(el => {
            const img = `
                <div class="card col-xl-4 col-lg-6 col-md-12 viewHandle">
                    <a href="${el.urls.full}" target="_blank">
                        <img src="${el.urls.regular}" class="card-img-top" alt="${el.alt_description ? el.alt_description : "Unsplash photo"}">
                    </a>
                    
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <img src="${el.user.profile_image.medium}" class="card-img">
                            <h5 class="card-title margin-left">${el.user.username}</h5>
                        </div>
                        <div class="d-flex align-items-center card-likes">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            </svg>
                            <p class="card-text margin-left">${el.likes}</p>
                        </div>
                        <a href="#" class="btn btn-primary modalBtn"  data-bs-toggle="modal" data-bs-target="#exampleModal">Full info</a>
                    </div>
                </div>`

            holderImages.insertAdjacentHTML("beforeend", img);

            // variables for selecting last added element
            const modalBtn = document.querySelectorAll(".modalBtn")[document.querySelectorAll(".modalBtn").length - 1];
            const modalShowImg = document.querySelectorAll(".card-img-top")[document.querySelectorAll(".card-img-top").length - 1];

            // showing modal
            modalBtn.addEventListener("click", (e) => {
                e.preventDefault();
                renderingModal(el);
            });
        });
    });
}

// calling function for rendering data
getPhotos(pages);

// adding more imgs, when scrolled to the bottom
window.addEventListener("scroll", () => {
    let totalPageHeight = document.body.scrollHeight;
    let scrollPoint = window.pageYOffset + window.innerHeight;
    let imgs = document.querySelectorAll(".card-img-top");
    let lastImg = imgs[imgs.length - 1];
    if (scrollPoint >= totalPageHeight - 1 && document.readyState === "complete" && lastImg.complete) {
        pages++
        getPhotos(pages);
    }
});

// switch to grid view
gridView.addEventListener("click", () => {
    document.querySelectorAll(".viewHandle").forEach(el => {
        el.className = "card col-xl-4 col-lg-6 col-md-12 viewHandle";
    })
})

// switch to column view
columnView.addEventListener("click", () => {
    document.querySelectorAll(".viewHandle").forEach(el => {
        el.className = "card col-xl-12 col-lg-12 col-md-12 viewHandle";
    })
})