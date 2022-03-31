"use strict"
const PUBLIC_KEY = "34L37bpndqC4DMR9vq_cJIZDGX6lipWNAZbYx3j5pT8";
const PRIVATE_KEY = `AW6Avq7OQF5sgOdsBtO3aOU9HjWHGn6MOCr9Py0nbGk`;
const holderImages = document.querySelector(".holderImages");
const columnView = document.querySelector(".column");
const gridView = document.querySelector(".grid");

// elements for modal
const modal = document.querySelector(".modal-wrapper");
const modalImg = document.querySelector(".modal__img");
const imgLink = document.querySelector(".modal__info__link");
const imgAlt = document.querySelector(".modal__info__alt");
const likes = document.querySelector(".modal__likes__num");
const portrait = document.querySelector("#user-photo");
const userName = document.querySelector("#user-name");
const portfolio = document.querySelector("#portfolio");
const socails = document.querySelector(".modal__user__links");

// counter for pages;
let pages = 1;

// creating loader
const loader = document.createElement("div");
const loaderCircle = document.createElement("div");
loader.setAttribute("id", "loader");
loaderCircle.setAttribute("id", "loader-circle");
loader.appendChild(loaderCircle);

// closing modal when clicked outside of it
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.visibility = "hidden";
    }
});

// handling view
columnView.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#viewCss").href = "css/column-view.css"
});
gridView.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#viewCss").href = "css/grid-view.css"
});

// function for geting photos from site and rendering them
const getPhotos = function (page) {
    const request = new XMLHttpRequest;
    request.open("GET", `https://api.unsplash.com/photos?page=${page}&per_page=15&client_id=${PUBLIC_KEY}`);
    request.send();
    holderImages.appendChild(loader)

    request.addEventListener("load", function () {
        const data = JSON.parse(this.responseText);

        // removing loader
        document.querySelector("#loader").remove();

        // rendering images on page
        data.forEach(el => {
            const img = document.createElement("img");
            img.src = el.urls.regular;
            img.classList.add("holderImages__img");
            holderImages.appendChild(img);

            // event for modal
            img.addEventListener("click", () => {
                modal.style.visibility = "visible";

                modalImg.src = el.urls.regular;
                modalImg.alt = el.alt_description;

                imgLink.href = imgLink.textContent = el.links.html;
                imgLink.target = "_blank";
                if (el.alt_description) {
                    imgAlt.textContent = el.alt_description;
                } else if (el.description) {
                    imgAlt.textContent = el.description;
                } else {
                    imgAlt.textContent = `Alt is not availble for this photo`
                }

                likes.textContent = el.likes;
                portrait.src = el.user.profile_image.medium;
                userName.textContent = el.user.username;
                portfolio.href = portfolio.textContent = el.user.portfolio_url;
                portfolio.target = "_blank";

                // checking if there is a social link, and rendering
                socails.innerHTML = "";
                if (el.user.instagram_username) {
                    const linkSocial = document.createElement("a");
                    linkSocial.href = `https://www.instagram.com/${el.user.instagram_username}`;
                    linkSocial.target = "_blank";
                    linkSocial.textContent = `Instagram`;
                    linkSocial.classList.add("modal__user__links__link");
                    socails.appendChild(linkSocial);
                }
                if (el.user.paypal_email) {
                    const linkSocial = document.createElement("a");
                    linkSocial.href = el.user.paypal_email;
                    linkSocial.target = "_blank";
                    linkSocial.textContent = `PayPal`;
                    linkSocial.classList.add("modal__user__links__link");
                    socails.appendChild(linkSocial);
                }
                if (el.user.twitter_username) {
                    const linkSocial = document.createElement("a");
                    linkSocial.href = `https://www.twitter.com/${el.user.twitter_username}`;
                    linkSocial.target = "_blank";
                    linkSocial.textContent = `Twitter`;
                    linkSocial.classList.add("modal__user__links__link");
                    socails.appendChild(linkSocial);
                }
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
    let imgs = document.querySelectorAll(".holderImages__img");
    let lastImg = imgs[imgs.length - 1];
    if (scrollPoint >= totalPageHeight - 1 && document.readyState === "complete" && lastImg.complete) {
        pages++
        getPhotos(pages);
    }
});

